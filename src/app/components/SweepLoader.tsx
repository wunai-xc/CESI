"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const DURATION = 1000;

export default function SweepLoader() {
  const pathname = usePathname();
  const verticalRef = useRef<HTMLSpanElement>(null);
  const horizontalRef = useRef<HTMLSpanElement>(null);
  const lastRunRef = useRef(0);

  useEffect(() => {
    const vertical = verticalRef.current;
    const horizontal = horizontalRef.current;
    if (!vertical || !horizontal) return;

    const now = Date.now();
    if (now - lastRunRef.current < DURATION) return;
    lastRunRef.current = now;

    const options: KeyframeAnimationOptions = {
      duration: DURATION,
      easing: "ease-in-out",
      iterations: 1,
      fill: "forwards",
    };

    const verticalAnimation = vertical.animate(
      [
        { opacity: 1, width: "10px", transform: "translateX(-100%)" },
        { opacity: 1, width: "50px", offset: 0.5 },
        { opacity: 1, width: "10px", transform: "translateX(100vw)" },
      ],
      options,
    );

    const horizontalAnimation = horizontal.animate(
      [
        { opacity: 1, height: "10px", transform: "translateY(100%)" },
        { opacity: 1, height: "50px", offset: 0.5 },
        { opacity: 1, height: "10px", transform: "translateY(-100svh)" },
      ],
      options,
    );

    return () => {
      verticalAnimation.cancel();
      horizontalAnimation.cancel();
    };
  }, [pathname]);

  return (
    <div
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
