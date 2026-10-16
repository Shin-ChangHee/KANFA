"use client";

import { useEffect, useRef } from "react";

/**
 * 트랙을 한 바퀴 도는 점. 페이지를 열 때 한 번만 돌고 출발선에 멈춘다.
 * 움직임 줄이기 설정이면 돌지 않고 출발선에 서 있는다.
 */
export default function TrackRunner({ d, start }: { d: string; start: { x: number; y: number } }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const total = path.getTotalLength();
    const duration = 4200;
    let startTime: number | null = null;
    let frame = 0;
    const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      const p = path.getPointAtLength(ease(t) * total);
      dot.setAttribute("cx", String(p.x));
      dot.setAttribute("cy", String(p.y));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    // 첫 화면이 그려진 뒤 출발한다.
    const timer = window.setTimeout(() => (frame = requestAnimationFrame(tick)), 500);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <g>
      <path ref={pathRef} d={d} fill="none" stroke="none" />
      <circle ref={dotRef} cx={start.x} cy={start.y} r={9} fill="#F2A93B" stroke="#14213D" strokeWidth={3} />
    </g>
  );
}
