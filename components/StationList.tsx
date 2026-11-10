import Image from "next/image";
import { stationImage } from "@/lib/stationImages";
import type { Course } from "@/lib/types";

/** 코스 안내의 6개 구간 상세 */
export default function StationList({ course }: { course: Course }) {
  return (
    <ol className="space-y-6">
      {course.stations.map((s) => {
        const finish = s.order === course.stations.length;
        const img = stationImage(s.sourceTest);
        return (
          <li key={s.order} className="overflow-hidden rounded-2xl border border-mist bg-white">
            {img && (
              <div className="flex justify-center bg-track-soft md:p-5">
                {/* 높이가 20rem을, 폭이 원본 크기를 넘지 않도록 폭을 정한다. 폭이 정해져 있어 불러오기 전에도 자리가 잡힌다. */}
                <div className="w-full" style={{ maxWidth: `min(${img.src.width}px, calc(20rem * ${img.src.width} / ${img.src.height}))` }}>
                  <Image src={img.src} alt={img.alt} loading="eager" className="h-auto w-full md:rounded-xl" />
                </div>
              </div>
            )}
            <div className="p-5 md:p-7">
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
          </li>
        );
      })}
    </ol>
  );
}
