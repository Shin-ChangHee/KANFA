"use client";

import { useRef, type KeyboardEvent } from "react";
import type { CourseType } from "@/lib/types";

export const COURSE_TABS: { type: CourseType; label: string }[] = [
  { type: "adult", label: "성인 코스" },
  { type: "senior", label: "어르신 코스" },
];

/** 성인·어르신 전환 탭. 좌우 화살표로 이동할 수 있다. */
export default function CourseTabList({
  idPrefix,
  value,
  onChange,
  label,
}: {
  idPrefix: string;
  value: CourseType;
  onChange: (v: CourseType) => void;
  label: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent, index: number) => {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % COURSE_TABS.length;
    if (e.key === "ArrowLeft") next = (index - 1 + COURSE_TABS.length) % COURSE_TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = COURSE_TABS.length - 1;
    if (next < 0) return;
    e.preventDefault();
    onChange(COURSE_TABS[next].type);
    refs.current[next]?.focus();
  };

  return (
    <div role="tablist" aria-label={label} className="inline-flex rounded-xl border-2 border-mist bg-white p-1">
      {COURSE_TABS.map((t, i) => {
        const selected = t.type === value;
        return (
          <button
            key={t.type}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${t.type}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(t.type)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-11 rounded-lg px-5 font-bold transition-colors ${selected ? "bg-track text-white" : "text-ink hover:bg-lane"}`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
