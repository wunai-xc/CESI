// src/app/components/layout/FooterWordmark.tsx
// 页脚底部的大字粒子效果（参考 GTMC 的 footer-wordmark 思路，但用 2D canvas 自己实现，
// 不引入 three.js：文字先画到离屏 canvas，再按像素采样成粒子，
// 粒子用弹簧回到原位 + 轻微飘动，鼠标经过会被推开再弹回来）。
//
// 细节：
// - 颜色读自 canvas 的 computed style，跟随主题（亮/暗）变化自动更新；
// - 系统开启「减少动态效果」时只画一帧静态粒子，不跑 rAF；
// - 滚出视口时暂停渲染，省电；
// - 没有 JS 时 canvas 为空，但下面那层 <p> 仍然把文字显示出来。

"use client";

import { useEffect, useRef } from "react";

type Particle = {
  // 原位
  hx: number;
  hy: number;
  // 当前位置与速度
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  size: number;
};

// 目标粒子数：手机上也扛得住，形状还能看出字
const TARGET_PARTICLES = 2600;

export default function FooterWordmark({ text = "WUNAI" }: { text?: string }) {
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
    let visible = true;

    const pointer = { x: -9999, y: -9999, active: false };

    // 颜色跟着主题走：直接从 canvas 的计算样式里取 currentColor 的实际值
    const readColor = () => {
      const value = getComputedStyle(canvas).color;
      if (value) color = value;
    };

    // 把文字画到离屏 canvas，再按 alpha 采样成粒子
    const build = () => {
      const rect = wrap.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColor();

      const off = document.createElement("canvas");
      off.width = width;
      off.height = height;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;

      // 字号：按高度和文字长度折中，保证宽度不溢出
      const fontSize = Math.round(
        Math.min(height * 0.86, (width * 1.7) / Math.max(text.length, 1)),
      );

      offCtx.fillStyle = "#ffffff";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.font = `700 ${fontSize}px "cesi-sans", system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif`;
      offCtx.fillText(text, width / 2, height / 2);

      const { data } = offCtx.getImageData(0, 0, width, height);

      // 自适应步长：先估一下步长多少能落在目标粒子数附近
      let stride = 2;
      for (; stride < 14; stride += 1) {
        let count = 0;
        for (let y = 0; y < height; y += stride) {
          for (let x = 0; x < width; x += stride) {
            if (data[(y * width + x) * 4 + 3] > 128) count += 1;
          }
        }
        if (count <= TARGET_PARTICLES) break;
      }

      particles = [];
      for (let y = 0; y < height; y += stride) {
        for (let x = 0; x < width; x += stride) {
          if (data[(y * width + x) * 4 + 3] <= 128) continue;
          const px = x + (Math.random() - 0.5) * stride;
          const py = y + (Math.random() - 0.5) * stride;
          particles.push({
            hx: px,
            hy: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0,
            seed: Math.random() * Math.PI * 2,
            // 少量稍大的点，避免整片看起来太平均
            size: Math.random() > 0.82 ? 1.6 : 1,
          });
        }
      }
    };

    // 画一帧（静态模式只调用一次）
    const draw = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05) || 0.016;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      const seconds = time / 1000;

      for (const particle of particles) {
        // 弹簧归位 + 阻尼
        let ax = (particle.hx - particle.x) * 34 - particle.vx * 9;
        let ay = (particle.hy - particle.y) * 34 - particle.vy * 9;

        if (!reducedMotion) {
          // 静止时的轻微飘动
          ax += Math.sin(seconds * 1.7 + particle.seed) * 9;
          ay += Math.cos(seconds * 1.3 + particle.seed * 1.4) * 9;
        }

        // 指针推开：越近推力越大
        if (pointer.active) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          const radius = 78;
          if (distance < radius && distance > 0.5) {
            const force = (1 - distance / radius) * 1500;
            ax += (dx / distance) * force;
            ay += (dy / distance) * force;
          }
        }

        particle.vx += ax * dt;
        particle.vy += ay * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        // 方点，符合站点"无圆角"的调性
        ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      }
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf || reducedMotion) return;
      lastTime = 0;
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const renderStatic = () => {
      draw(performance.now());
    };

    // 先按当前可用字体构建，字体加载完成后再重建一次，避免用回退字体采样
    build();
    if (reducedMotion) renderStatic();
    else start();

    const fontSet = document.fonts;
    fontSet?.ready.then(() => {
      build();
      if (reducedMotion) renderStatic();
    });

    const onResize = () => {
      build();
      if (reducedMotion) renderStatic();
    };

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrap);

    // 主题切换：<html> 的 class 变了就重新取色并重绘一帧
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

    // 滚出视口就停，省电
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
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
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stop();
      resizeObserver.disconnect();
      themeObserver.disconnect();
      intersectionObserver.disconnect();
      motionQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [text]);

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden">
      {/* 无 JS / 首帧之前：用普通文字兜底，粒子生成后盖在上面 */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-bold tracking-tight text-zinc-200 dark:text-zinc-800"
        style={{ fontSize: "clamp(2.5rem, 13vw, 7rem)", lineHeight: 1 }}
      >
        {text}
      </p>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="relative block h-[clamp(4.5rem,14vw,8rem)] w-full text-zinc-900 dark:text-zinc-100"
      />
      <span className="sr-only">{text}</span>
    </div>
  );
}
