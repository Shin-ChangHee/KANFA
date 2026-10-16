import type { Course } from "@/lib/types";
import StationIllustration from "./StationIllustration";

/** 코스 안내의 6개 구간 상세 */
export default function StationList({ course }: { course: Course }) {
  return (
    <ol className="space-y-6">
      {course.stations.map((s) => {
        const finish = s.order === course.stations.length;
        return (
          <li key={s.order} className="grid gap-5 rounded-xl border border-mist bg-white p-5 md:grid-cols-[1fr_15rem] md:p-6">
            <div>
              <p className="flex flex-wrap items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber font-num text-2xl font-bold text-ink">{s.order}</span>
                <span className="text-sm font-semibold text-slate">
                  {s.order}구간{finish ? " · 결승" : ""}
                </span>
              </p>
              <h3 className="mt-3 text-2xl font-extrabold">{s.element}</h3>
              <dl className="mt-3 grid gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
                <dt className="font-semibold text-slate">원래 측정항목</dt>
                <dd>{s.sourceTest}</dd>
                <dt className="font-semibold text-slate">레이스 규칙</dt>
                <dd className="font-bold">{s.raceRule}</dd>
              </dl>
              <p className="measure mt-4">{s.description}</p>
              <p className="measure mt-3 rounded-lg bg-field-soft px-4 py-3 text-ink">
                <span className="font-bold text-field-ink">도움말 </span>
                {s.tip}
              </p>
            </div>
            <div className="md:pt-2">
              <StationIllustration order={s.order} name={s.sourceTest} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
