import type { Grade } from "@/lib/types";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];
// 레인마다 주자 위치를 조금씩 달리해 '함께 달리는' 느낌을 준다
const RUNNERS: Record<Grade, number[]> = {
  1: [8, 22, 30, 47, 58],
  2: [12, 19, 35, 44, 61],
  3: [6, 26, 33, 52, 57],
  4: [15, 21, 38, 46, 63],
  5: [9, 28, 36, 49, 55],
  6: [11, 24, 32, 45, 60],
};

/** 위에서 본 직선 주로. 레인 번호가 곧 국민체력100 등급이다. */
export default function GradeLanes() {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl bg-track-deep p-2">
        <ul aria-label="국민체력100 등급별 출발 레인" className="relative">
          {GRADES.map((g) => (
            <li key={g} className="relative flex h-14 items-center border-b border-white/45 last:border-b-0">
              <span className="w-14 shrink-0 text-center font-num text-[2rem] leading-none font-bold text-white" aria-hidden="true">
                {g}
              </span>
              <span aria-hidden="true" className="h-full w-1 shrink-0 bg-white" />
              <span aria-hidden="true" className="relative h-full flex-1">
                {RUNNERS[g].map((x, i) => (
                  <span
                    key={i}
                    className={`absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full ${g === 6 ? "bg-amber" : "bg-white"}`}
                    style={{ left: `${x}%` }}
                  />
                ))}
              </span>
              <span className={`w-28 shrink-0 pr-3 text-right text-sm whitespace-nowrap ${g === 6 ? "font-extrabold text-white" : "font-semibold text-on-track"}`}>
                {g}등급끼리
              </span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-sm text-slate">왼쪽 흰 선이 출발선이에요. 한 레인이 하나의 출발조예요.</figcaption>
    </figure>
  );
}
