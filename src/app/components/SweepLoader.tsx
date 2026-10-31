"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const BASE_DURATION = 1000;

export default function SweepLoader() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLSpanElement>(null);
  const horizontalRef = useRef<HTMLSpanElement>(null);
  const lastRunRef = useRef(0);

  useEffect(() => {
    const overlay = overlayRef.current;
    const vertical = verticalRef.current;
    const horizontal = horizontalRef.current;
    if (!overlay || !vertical || !horizontal) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? BASE_DURATION * 2 : BASE_DURATION;
    const easing = reduced ? "linear" : "ease-in-out";

    const now = Date.now();
    if (now - lastRunRef.current < duration) return;
    lastRunRef.current = now;

    const sweep = {
      duration,
      easing,
      iterations: 1,
      fill: "forwards",
    } satisfies KeyframeAnimationOptions;

    const blur = overlay.animate(
      [
        { backdropFilter: "blur(16px)" },
        { backdropFilter: "blur(0px)" },
      ],
      { duration, easing: "ease-out", iterations: 1 },
    );

    const verticalAnimation = vertical.animate(
      [
        { opacity: 1, width: "10px", transform: "translateX(-100%)" },
        { opacity: 1, width: "50px", offset: 0.5 },
        { opacity: 1, width: "10px", transform: "translateX(100vw)" },
      ],
      sweep,
    );

    const horizontalAnimation = horizontal.animate(
      [
        { opacity: 1, height: "10px", transform: "translateY(100%)" },
        { opacity: 1, height: "50px", offset: 0.5 },
        { opacity: 1, height: "10px", transform: "translateY(-100svh)" },
      ],
      sweep,
    );

    return () => {
      blur.cancel();
      verticalAnimation.cancel();
      horizontalAnimation.cancel();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <span
        ref={verticalRef}
        className="absolute left-0 top-0 h-full w-[10px] bg-black opacity-0 dark:bg-white"
      />
      <span
        ref={horizontalRef}
        className="absolute bottom-0 left-0 h-[10px] w-full bg-black opacity-0 dark:bg-white"
      />
    </div>
  );
}
