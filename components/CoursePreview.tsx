"use client";

import Link from "next/link";
import { useState } from "react";
import type { Course, CourseType } from "@/lib/types";
import CourseTabList from "./CourseTabList";

/** 홈의 코스 미리보기: 성인·어르신 전환과 6개 구간 한 줄 설명 */
export default function CoursePreview({ courses }: { courses: Course[] }) {
  const [type, setType] = useState<CourseType>("adult");
  const course = courses.find((c) => c.type === type)!;

  return (
    <div>
      <CourseTabList idPrefix="preview" value={type} onChange={setType} label="코스 고르기" />
      <div id="preview-panel" role="tabpanel" aria-labelledby={`preview-tab-${type}`} className="mt-6">
        <p className="text-slate">
          {course.ageRange} · {course.durationMin} · 구간 사이 이동 {course.transferDistance}
        </p>
        <ol className="mt-4 divide-y divide-mist border-y border-mist">
          {course.stations.map((s) => (
            <li key={s.order} className="flex items-start gap-4 py-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber font-num text-xl font-bold text-ink">{s.order}</span>
              <div className="grid flex-1 gap-x-6 sm:grid-cols-[9rem_1fr]">
                <span className="font-bold">{s.element}</span>
                <span className="text-slate">
                  {s.sourceTest} · {s.raceRule}
                </span>
              </div>
            </li>
          ))}
        </ol>
        <Link
          href={type === "senior" ? "/course?tab=senior" : "/course"}
          className="mt-4 inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4"
        >
          {course.name} 자세히 보기
        </Link>
      </div>
    </div>
  );
}
