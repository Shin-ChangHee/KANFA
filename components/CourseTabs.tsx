"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Course, CourseType } from "@/lib/types";
import CourseTabList from "./CourseTabList";
import StationList from "./StationList";

/** 코스 안내 탭. 선택한 탭을 주소(?tab=senior)에 반영한다. */
export default function CourseTabs({ courses }: { courses: Course[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const type: CourseType = params.get("tab") === "senior" ? "senior" : "adult";

  const change = (next: CourseType) => {
    router.replace(next === "senior" ? `${pathname}?tab=senior` : pathname, { scroll: false });
  };

  return <CourseTabsView courses={courses} type={type} onChange={change} />;
}

export function CourseTabsView({ courses, type, onChange }: { courses: Course[]; type: CourseType; onChange: (t: CourseType) => void }) {
  const course = courses.find((c) => c.type === type)!;
  return (
    <div>
      <CourseTabList idPrefix="course" value={type} onChange={onChange} label="코스 고르기" />
      <section id="course-panel" role="tabpanel" aria-labelledby={`course-tab-${type}`} className="mt-8">
        <h2 className="sr-only">{course.name} 구간</h2>
        <dl className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { k: "참가 나이", v: course.ageRange },
            { k: "예상 소요 시간", v: course.durationMin },
            { k: "구간 사이 이동", v: course.transferDistance },
          ].map((x) => (
            <div key={x.k} className="rounded-xl border border-mist bg-white px-5 py-4">
              <dt className="text-sm font-semibold text-slate">{x.k}</dt>
              <dd className="mt-1 text-xl font-bold">{x.v}</dd>
            </div>
          ))}
        </dl>
        <StationList course={course} />
      </section>
    </div>
  );
}

/** 주소를 읽기 전(정적 HTML) 보여줄 기본 화면: 성인 코스 */
export function CourseTabsFallback({ courses }: { courses: Course[] }) {
  return <CourseTabsView courses={courses} type="adult" onChange={() => {}} />;
}
