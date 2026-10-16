import type { Metadata } from "next";
import { Suspense } from "react";
import CourseTabs, { CourseTabsFallback } from "@/components/CourseTabs";
import PageIntro from "@/components/PageIntro";
import { courses } from "@/lib/data";

export const metadata: Metadata = { title: "코스 안내" };

export default function CoursePage() {
  return (
    <>
      <PageIntro title="코스 안내" lead="국민체력100 공식 측정 동작으로 만든 6개 구간을 차례로 돌아요. 나이에 따라 성인 코스와 어르신 코스로 나뉘어요." />
      <div className="container-page py-10">
        {/* 정적 내보내기에서는 주소의 ?tab 값을 브라우저에서 읽는다. 읽기 전에는 성인 코스를 보여준다. */}
        <Suspense fallback={<CourseTabsFallback courses={courses} />}>
          <CourseTabs courses={courses} />
        </Suspense>

        <section aria-labelledby="course-note" className="measure mt-10 rounded-xl border border-mist bg-white p-6">
          <h2 id="course-note" className="text-lg font-bold">
            알아 두세요
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>동작은 국민체력100 공식 측정항목이며, 횟수·기준값은 성별·연령대별로 다르고 대회 공지로 확정됩니다.</li>
            <li>성인 코스는 약 15~20분, 구간 사이를 100m씩 이동해요.</li>
            <li>어르신 코스는 약 10분, 구간 사이를 20m씩 이동해요.</li>
          </ul>
        </section>
      </div>
    </>
  );
}
