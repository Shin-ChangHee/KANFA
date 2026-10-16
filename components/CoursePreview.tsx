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
        <ol className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-mist sm:grid-cols-2 lg:grid-cols-3">
          {course.stations.map((s) => {
            const finish = s.order === course.stations.length;
            return (
              <li key={s.order} className="flex flex-col gap-3 bg-white p-6">
                <span className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber font-num text-2xl font-bold text-ink">{s.order}</span>
                  <span className="text-sm font-semibold text-slate">{finish ? "결승" : `${s.order}구간`}</span>
                </span>
                <span className="text-xl font-extrabold">{s.element}</span>
                <span className="text-slate">{s.sourceTest}</span>
                <span className="mt-auto border-t border-mist pt-3 font-semibold">{s.raceRule}</span>
              </li>
            );
          })}
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
