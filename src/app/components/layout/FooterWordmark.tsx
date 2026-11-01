// src/app/components/layout/FooterWordmark.tsx
// 页脚底部的粒子大字，观感对齐 techmc.wiki 的 footer-wordmark：
// 文字先渲染成 SVG（衬线体、字重 200）→ 光栅化 → 按 alpha 权重采样成粒子云 →
// 透视投影 + 浮动起伏 + 轻微摇滚 + 鼠标推开/回弹/旋涡 + 拖拽旋转。
//
// 他们的实现是 three.js + WebGL 着色器（18000 点）；这里用 2D canvas 自己算透视，
// 零依赖、体积小一个数量级，参数名与默认值尽量一致（count / size / sizeVariance /
// radius / strength / swirl / spring / damping / drift / scale / floatIntensity /
// rotationIntensity / floatSpeed / fov / cameraDistance）。
// 粒子数按屏宽降档（桌面 9000、窄屏 4000），保证手机也能跑满帧。

"use client";

import { useEffect, useRef } from "react";

export type FooterWordmarkProps = {
  // 宽屏文案
  text?: string;
  // 窄屏文案（默认同 text）
  shortText?: string;
  count?: number;
  size?: number;
  sizeVariance?: number;
  radius?: number;
  strength?: number;
  swirl?: number;
  spring?: number;
  damping?: number;
  drift?: number;
  scale?: number;
  floatIntensity?: number;
  rotationIntensity?: number;
  floatSpeed?: number;
  fov?: number;
  cameraDistance?: number;
  className?: string;
};

type Particle = {
  // 归一化位置（-0.5 ~ 0.5，y 向上为正）
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  jitter: number;
  initialized: boolean;
};

const DEFAULTS = {
  count: 9000,
  size: 1.5,
  sizeVariance: 0.1,
  radius: 110,
  strength: 1,
  swirl: 0.6,
  spring: 18,
  damping: 7,
  drift: 0.6,
  scale: 10,
  floatIntensity: 1,
  rotationIntensity: 0.45,
  floatSpeed: 1.6,
  fov: 15,
  cameraDistance: 12,
};

// 文字 → SVG data URI。字体沿用他们那套衬线 + 字重 200，只有文案不一样。
function buildSvgSource(text: string): string {
  const width = Math.max(1000, Math.ceil(text.length * 130 + 300));
  const height = 240;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" ` +
    `font-family="STIX Two Text, Noto Serif SC, Georgia, serif" font-size="190" ` +
    `font-weight="200" fill="#ffffff">${text}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// 光栅化到离屏 canvas，拿像素数据做采样
function rasterize(image: HTMLImageElement, longest = 520): ImageData | null {
  const ratio = Math.min(
    1,
    longest / Math.max(image.naturalWidth || 1, image.naturalHeight || 1),
  );
  const width = Math.max(1, Math.round((image.naturalWidth || 520) * ratio));
  const height = Math.max(1, Math.round((image.naturalHeight || 240) * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(0, 0, width, height);
}

export default function FooterWordmark({
  text = "WUNAI",
  shortText,
  className = "",
  ...options
}: FooterWordmarkProps) {
  const config = { ...DEFAULTS, ...options };
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let color = "#888888";
    let raf = 0;
    let lastTime = 0;
    let disposed = false;
    let rebuildToken = 0;

    const pointer = { x: -9999, y: -9999, active: false };
    const rotation = { x: 0, y: 0, vx: 0, vy: 0, dragging: false };
    let dragPointerId = -1;
    let dragLastX = 0;
    let dragLastY = 0;

    const readColor = () => {
      const value = getComputedStyle(canvas).color;
      if (value) color = value;
    };

    // 采样：按 alpha 作为权重挑点，归一化到 -0.5 ~ 0.5
    const sampleParticles = (data: ImageData, count: number) => {
      const { width: w, height: h } = data;
      const cumulative: number[] = [];
      const pixels: number[] = [];
      let total = 0;

      for (let i = 0; i < w * h; i += 1) {
        const alpha = data.data[i * 4 + 3];
        if (alpha < 10) continue;
        total += alpha;
        pixels.push(i);
        cumulative.push(total);
      }
      if (pixels.length === 0) return [];

      let minX = w;
      let maxX = 0;
      let minY = h;
      let maxY = 0;
      for (const index of pixels) {
        const x = index % w;
        const y = Math.floor(index / w);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const longestSide = Math.max(maxX - minX, maxY - minY, 1);

      const result: Particle[] = [];
      for (let i = 0; i < count; i += 1) {
        const pick = Math.random() * total;
        let lo = 0;
        let hi = cumulative.length - 1;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (cumulative[mid] < pick) lo = mid + 1;
          else hi = mid;
        }
        const index = pixels[lo];
        const px = index % w;
        const py = Math.floor(index / w);

        result.push({
          ox: (px - centerX) / longestSide,
          oy: -(py - centerY) / longestSide,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          seed: Math.random() * Math.PI * 2,
          jitter: 1 + config.sizeVariance * (Math.random() - 0.5) * 1.4,
          initialized: false,
        });
      }
      return result;
    };

    const build = async () => {
      const token = ++rebuildToken;

      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const short = shortText ?? text;
      const label = width < 640 ? short : text;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColor();

      // 粒子数按屏宽降档：窄屏少一些，桌面接近他们的 18000 的一半
      const count = Math.round(
        width < 640 ? Math.min(config.count, 4000) : config.count,
      );

      const image = new Image();
      image.decoding = "async";
      const ready = new Promise<HTMLImageElement | null>((resolve) => {
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = buildSvgSource(label);
      });

      const loaded = await ready;
      if (!loaded || disposed || token !== rebuildToken) return;

      const data = rasterize(loaded);
      if (!data) return;

      particles = sampleParticles(data, count);
      if (reducedMotion) renderStatic();
    };

    // 透视投影：归一化坐标 → 浮动/摇滚/拖拽旋转 → 按景深缩放到屏幕
    const project = (
      particle: Particle,
      seconds: number,
      out: { x: number; y: number; size: number },
    ) => {
      const { floatIntensity, rotationIntensity, floatSpeed, fov, size } = config;

      // 世界坐标（scale 决定文字在场景里的相对大小）
      const wx = particle.ox;
      let wy = particle.oy;
      const wz = 0;

      // 浮动起伏
      wy +=
        Math.sin(seconds * floatSpeed + particle.ox * 2.2) *
        0.012 *
        floatIntensity;

      // 自动摇滚 + 拖拽角度
      const angleY =
        rotation.y +
        Math.sin(seconds * floatSpeed * 0.7 + 0.6) * 0.14 * rotationIntensity;
      const angleX =
        rotation.x +
        Math.cos(seconds * floatSpeed * 0.55) * 0.06 * rotationIntensity;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      // 绕 Y 轴
      const rx = wx * cosY + wz * sinY;
      let rz = -wx * sinY + wz * cosY;
      // 绕 X 轴
      const ry = wy * cosX - rz * sinX;
      rz = wy * sinX + rz * cosX;

      // fov 越小越"长焦"，透视越平；整体宽度对齐容器
      const focalLength = 1 / Math.tan((fov * Math.PI) / 360);
      const depth = Math.max(focalLength + rz * 0.55, 0.2);
      const perspective = focalLength / depth;

      if (depth <= 0.3) {
        out.x = width / 2;
        out.y = height / 2;
        out.size = 0;
        return;
      }

      out.x = width / 2 + rx * perspective * width * 0.92;
      out.y = height / 2 - ry * perspective * width * 0.92;
      out.size = Math.max(0.5, size * particle.jitter * perspective);
    };

    const projected = { x: 0, y: 0, size: 1 };

    const draw = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05) || 0.016;
      lastTime = time;
      const seconds = time / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      const { spring, damping, radius, strength, swirl, drift } = config;
      const pushScale = 900 * strength;

      // 松手后的惯性
      if (!rotation.dragging) {
        rotation.y += rotation.vy * dt;
        rotation.x += rotation.vx * dt;
        const decay = Math.pow(0.02, dt);
        rotation.vy *= decay;
        rotation.vx *= decay;
        rotation.x = Math.max(-0.7, Math.min(0.7, rotation.x));
      }

      for (const particle of particles) {
        project(particle, seconds, projected);

        if (!particle.initialized || projected.size === 0) {
          particle.x = projected.x;
          particle.y = projected.y;
          particle.initialized = true;
        }

        let ax = (projected.x - particle.x) * spring - particle.vx * damping;
        let ay = (projected.y - particle.y) * spring - particle.vy * damping;

        if (!reducedMotion) {
          ax += Math.sin(seconds * 1.7 + particle.seed) * drift * 12;
          ay += Math.cos(seconds * 1.3 + particle.seed * 1.4) * drift * 12;
        }

        if (pointer.active && !rotation.dragging) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < radius && distance > 0.5) {
            const falloff = 1 - distance / radius;
            const nx = dx / distance;
            const ny = dy / distance;
            ax += nx * falloff * pushScale - ny * falloff * pushScale * swirl;
            ay += ny * falloff * pushScale + nx * falloff * pushScale * swirl;
          }
        }

        particle.vx += ax * dt;
        particle.vy += ay * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        ctx.fillRect(particle.x, particle.y, projected.size, projected.size);
      }
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reducedMotion || particles.length === 0) return;
      lastTime = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;
      for (const particle of particles) {
        project(particle, 0, projected);
        particle.x = projected.x;
        particle.y = projected.y;
        particle.vx = 0;
        particle.vy = 0;
        if (projected.size > 0) {
          ctx.fillRect(projected.x, projected.y, projected.size, projected.size);
        }
      }
    };

    void build().then(() => {
      if (disposed) return;
      if (reducedMotion) renderStatic();
      else start();
    });

    const onResize = () => {
      stop();
      void build().then(() => {
        if (disposed) return;
        if (reducedMotion) renderStatic();
        else start();
      });
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrap);

    const themeObserver = new MutationObserver(() => {
      readColor();
      if (reducedMotion) renderStatic();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const onMotionChange = () => {
      reducedMotion = motionQuery.matches;
      if (reducedMotion) {
        stop();
        renderStatic();
      } else {
        start();
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(wrap);

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;

      if (!rotation.dragging) return;

      const dx = event.clientX - dragLastX;
      const dy = event.clientY - dragLastY;
      dragLastX = event.clientX;
      dragLastY = event.clientY;

      rotation.y += dx * 0.008;
      rotation.x = Math.max(-0.7, Math.min(0.7, rotation.x + dy * 0.006));
      rotation.vy = dx * 0.008 * 60;
      rotation.vx = dy * 0.006 * 60;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      rotation.dragging = true;
      dragPointerId = event.pointerId;
      dragLastX = event.clientX;
      dragLastY = event.clientY;
      rotation.vy = 0;
      rotation.vx = 0;
      pointer.active = false;
      canvas.setPointerCapture(event.pointerId);
    };

    const endDrag = (event: PointerEvent) => {
      if (!rotation.dragging) return;
      rotation.dragging = false;
      if (dragPointerId !== -1 && canvas.hasPointerCapture(dragPointerId)) {
        canvas.releasePointerCapture(dragPointerId);
      }
      dragPointerId = -1;
      if (event.pointerType === "touch") pointer.active = false;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      disposed = true;
      stop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
    // config 的字段已在下面逐项列入依赖，避免整体依赖 config 对象导致每次渲染重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    text,
    shortText,
    config.count,
    config.size,
    config.sizeVariance,
    config.radius,
    config.strength,
    config.swirl,
    config.spring,
    config.damping,
    config.drift,
    config.scale,
    config.floatIntensity,
    config.rotationIntensity,
    config.floatSpeed,
    config.fov,
    config.cameraDistance,
  ]);

  return (
    <div ref={wrapRef} className={`relative h-full w-full select-none ${className}`}>
      {/* 静态兜底大字：无 JS 时可见，有粒子后作为背景衬托（对齐 techmc 的 15% 不透明度） */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex translate-y-[7%] select-none items-center justify-center whitespace-nowrap text-center font-bold leading-[0.78] tracking-[-0.03em] text-foreground/15"
        style={{ fontSize: "31cqi" }}
      >
        {shortText ?? text}
      </p>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full cursor-grab touch-pan-y text-foreground active:cursor-grabbing"
      />
      <span className="sr-only">{text}</span>
    </div>
  );
}
