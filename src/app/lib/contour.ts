// src/app/lib/contour.ts
// 纯代码生成"地形等高线"：把若干高斯山峰叠加成一个高程场，再叠一点低频噪声，
// 然后用 marching squares 求等值线，并把碎线段首尾相连成连续曲线。
// 之所以要"山峰 + 连接"，是因为纯噪声生成的线是散的，看不出地形；有主峰才能形成一圈套一圈的闭合等高线。
//
// 全部在构建期（服务端组件里）算一次，运行时零成本，不需要任何图片素材。

// 二维整数哈希：给定格点坐标 + 种子，得到 [0,1) 的稳定伪随机值
function hash(x: number, y: number, seed: number): number {
  let h = x * 374761393 + y * 668265263 + seed * 362437;
  h = (h ^ (h >>> 13)) * 1274126177;
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

function fade(t: number): number {
  return t * t * (3 - 2 * t);
}

// 值噪声：格点哈希 + 平滑插值
function valueNoise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = fade(x - xi);
  const v = fade(y - yi);

  const v00 = hash(xi, yi, seed);
  const v10 = hash(xi + 1, yi, seed);
  const v01 = hash(xi, yi + 1, seed);
  const v11 = hash(xi + 1, yi + 1, seed);

  const top = v00 * (1 - u) + v10 * u;
  const bottom = v01 * (1 - u) + v11 * u;
  return top * (1 - v) + bottom * v;
}

// 两个倍频就够了：等高线需要的是大起伏，不是细碎噪点
function fbm(x: number, y: number, seed: number): number {
  return (
    0.65 * valueNoise(x, y, seed) +
    0.35 * valueNoise(x * 2.1, y * 2.1, seed + 31)
  );
}

type Peak = { x: number; y: number; radius: number; height: number };

// 几座山峰的相对位置（0~1 归一化坐标），决定等高线的"山形"
const PEAKS: Peak[] = [
  { x: 0.26, y: 0.3, radius: 0.34, height: 1 },
  { x: 0.68, y: 0.24, radius: 0.22, height: 0.62 },
  { x: 0.55, y: 0.74, radius: 0.28, height: 0.8 },
  { x: 0.86, y: 0.7, radius: 0.18, height: 0.45 },
  // 下面几座更小的山包：让等高线在中景里有更多起伏，不至于只有四座主峰
  { x: 0.12, y: 0.78, radius: 0.2, height: 0.5 },
  { x: 0.4, y: 0.5, radius: 0.15, height: 0.34 },
  { x: 0.92, y: 0.16, radius: 0.16, height: 0.38 },
  { x: 0.02, y: 0.16, radius: 0.18, height: 0.3 },
];

function terrain(u: number, v: number, seed: number): number {
  let height = 0;

  for (const peak of PEAKS) {
    const dx = (u - peak.x) / peak.radius;
    const dy = (v - peak.y) / peak.radius;
    height += peak.height * Math.exp(-(dx * dx + dy * dy) * 1.5);
  }

  // 低频扰动：让等高线不是标准的同心圆
  height += 0.34 * (fbm(u * 2.6, v * 2.6, seed) - 0.5);
  // 中频扰动：在山腰上再制造一些凹凸，起伏更多
  height += 0.16 * (fbm(u * 5.2, v * 5.2, seed + 7) - 0.5);
  // 轻微斜坡：整体向右上方抬升，接近真实地形的一侧靠山
  height += 0.09 * (1 - v) + 0.05 * u;

  return height;
}

const round1 = (value: number) => Math.round(value * 10) / 10;

type Point = { x: number; y: number };
type Segment = { a: Point; b: Point };

// 端点吸附到 0.5px 网格，用来判断两段是否首尾相接
const keyOf = (p: Point) => `${Math.round(p.x * 2)}:${Math.round(p.y * 2)}`;

// 把同一等值高度上的碎线段连成尽量长的折线（等高线观感的关键）
function joinSegments(segments: Segment[]): string[] {
  if (segments.length === 0) return [];

  // 端点 → 关联线段索引
  const adjacency = new Map<string, number[]>();
  segments.forEach((segment, index) => {
    for (const point of [segment.a, segment.b]) {
      const key = keyOf(point);
      const list = adjacency.get(key);
      if (list) list.push(index);
      else adjacency.set(key, [index]);
    }
  });

  const used = new Array<boolean>(segments.length).fill(false);
  const paths: string[] = [];

  const nextSegment = (key: string): number | null => {
    const candidates = adjacency.get(key);
    if (!candidates) return null;
    for (const index of candidates) {
      if (!used[index]) return index;
    }
    return null;
  };

  for (let start = 0; start < segments.length; start += 1) {
    if (used[start]) continue;

    used[start] = true;
    const points: Point[] = [segments[start].a, segments[start].b];

    // 向前延伸
    let tail = points[points.length - 1];
    for (;;) {
      const index = nextSegment(keyOf(tail));
      if (index === null) break;
      used[index] = true;
      const segment = segments[index];
      const next = keyOf(segment.a) === keyOf(tail) ? segment.b : segment.a;
      points.push(next);
      tail = next;
    }

    // 向后延伸
    let head = points[0];
    for (;;) {
      const index = nextSegment(keyOf(head));
      if (index === null) break;
      used[index] = true;
      const segment = segments[index];
      const previous = keyOf(segment.b) === keyOf(head) ? segment.a : segment.b;
      points.unshift(previous);
      head = previous;
    }

    const d = points
      .map((point, index) => `${index === 0 ? "M" : "L"}${round1(point.x)} ${round1(point.y)}`)
      .join("");

    // 太短的碎线（两三个点）在地图上没有意义，丢掉能让画面更干净
    if (points.length >= 4) paths.push(d);
  }

  return paths;
}

export type ContourLine = {
  value: number;
  // 一条等值高度上可能有多条独立曲线，这里给每个曲线一个 d 字符串
  paths: string[];
  // 计曲线：每隔几条加粗一条，模仿地图的层次
  major: boolean;
};

export function generateContours({
  width = 1200,
  height = 800,
  gridX = 130,
  gridY = 88,
  levels = 14,
  seed = 20261101,
  minPoints = 4,
}: {
  width?: number;
  height?: number;
  gridX?: number;
  gridY?: number;
  levels?: number;
  seed?: number;
  minPoints?: number;
} = {}): ContourLine[] {
  // 1) 采样高程场
  const field: number[][] = [];
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;

  for (let j = 0; j <= gridY; j += 1) {
    const row: number[] = [];
    for (let i = 0; i <= gridX; i += 1) {
      const value = terrain(i / gridX, j / gridY, seed);
      row.push(value);
      if (value < min) min = value;
      if (value > max) max = value;
    }
    field.push(row);
  }

  const cellW = width / gridX;
  const cellH = height / gridY;
  const lines: ContourLine[] = [];

  // 2) 每个等值高度扫一遍格子，marching squares 找交线
  for (let step = 1; step <= levels; step += 1) {
    const level = min + ((max - min) * step) / (levels + 1);
    const segments: Segment[] = [];

    for (let j = 0; j < gridY; j += 1) {
      for (let i = 0; i < gridX; i += 1) {
        const x0 = i * cellW;
        const y0 = j * cellH;
        const x1 = x0 + cellW;
        const y1 = y0 + cellH;

        const a = field[j][i];
        const b = field[j][i + 1];
        const c = field[j + 1][i + 1];
        const d = field[j + 1][i];

        // 逐条边判断是否与等值线相交：这样不会出现查表漏项导致的断线
        const crossings: { x: number; y: number }[] = [];

        if (a < level !== b < level) {
          crossings.push({ x: x0 + cellW * ((level - a) / (b - a)), y: y0 });
        }
        if (b < level !== c < level) {
          crossings.push({ x: x1, y: y0 + cellH * ((level - b) / (c - b)) });
        }
        if (c < level !== d < level) {
          crossings.push({ x: x0 + cellW * ((level - d) / (c - d)), y: y1 });
        }
        if (d < level !== a < level) {
          crossings.push({ x: x0, y: y0 + cellH * ((level - a) / (d - a)) });
        }

        if (crossings.length === 2) {
          segments.push({ a: crossings[0], b: crossings[1] });
        } else if (crossings.length === 4) {
          // 鞍点：按中心值决定怎么配对，保证相邻格子的连法一致
          const centerInside = (a + b + c + d) / 4 < level;
          const [p0, p1, p2, p3] = crossings;
          if (centerInside) {
            segments.push({ a: p0, b: p1 }, { a: p2, b: p3 });
          } else {
            segments.push({ a: p0, b: p3 }, { a: p1, b: p2 });
          }
        }
      }
    }

    const paths = joinSegments(segments).filter(
      // 丢掉点数过少的碎线
      (d) => (d.match(/L/g) ?? []).length + 1 >= minPoints,
    );

    if (paths.length === 0) continue;

    lines.push({
      value: level,
      paths,
      major: step % 5 === 0,
    });
  }

  return lines;
}
