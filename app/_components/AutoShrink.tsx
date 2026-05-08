"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  safetyMargin?: number;
  deps?: unknown[];
}

export default function AutoShrink({
  children,
  safetyMargin = 0,
  deps = [],
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const fit = fitRef.current;
    if (!container || !fit) return;

    const apply = () => {
      fit.style.transform = "";
      fit.style.width = "100%";

      const containerH = container.clientHeight;
      const target = containerH * (1 - safetyMargin);
      const measured = fit.scrollHeight;
      if (measured <= target + 1) return;

      const ratio = target / measured;
      fit.style.transform = `scale(${ratio})`;
      fit.style.transformOrigin = "top left";
      fit.style.width = `${100 / ratio}%`;
    };

    apply();

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(apply).catch(() => {});
    }

    const ro = new ResizeObserver(apply);
    ro.observe(container);
    if (fit.firstElementChild) ro.observe(fit.firstElementChild);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safetyMargin, ...deps]);

  return (
    <div
      ref={containerRef}
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <div
        ref={fitRef}
        style={{
          width: "100%",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}
