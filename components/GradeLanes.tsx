import type { Grade } from "@/lib/types";
import LaneBadge from "./LaneBadge";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

/** 등급별 레인: 같은 등급끼리 한 레인에서 출발하는 모습 */
export default function GradeLanes() {
  return (
    <figure>
      <ul className="overflow-hidden rounded-xl bg-track" aria-label="국민체력100 등급별 출발 레인">
        {GRADES.map((g) => (
          <li key={g} className="flex items-center gap-4 border-b border-white/40 px-4 py-3 last:border-b-0">
            <LaneBadge grade={g} />
            <span aria-hidden="true" className="flex min-w-0 flex-1 items-center gap-2 border-l-4 border-white pl-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`h-3.5 w-3.5 shrink-0 rounded-full ${i >= 3 ? "hidden sm:block" : ""} ${g === 6 ? "bg-amber" : "bg-white/85"}`} />
              ))}
            </span>
            <span className="text-right font-semibold whitespace-nowrap text-white">{g}등급끼리</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-sm text-slate">흰 세로선이 출발선이에요. 한 레인이 하나의 출발조를 뜻해요.</figcaption>
    </figure>
  );
}
