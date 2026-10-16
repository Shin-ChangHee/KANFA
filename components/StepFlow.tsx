import { STEPS } from "@/lib/content";

/** 참여 5단계. compact는 홈의 가로 흐름, detailed는 참여 방법의 세로 목록 */
export default function StepFlow({ variant = "compact" }: { variant?: "compact" | "detailed" }) {
  if (variant === "compact") {
    return (
      <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
        {/* 다섯 단계를 잇는 레인 */}
        <span aria-hidden="true" className="absolute top-6 right-[10%] left-[10%] hidden h-1 rounded-full bg-[repeating-linear-gradient(to_right,var(--color-track)_0_14px,transparent_14px_22px)] md:block" />
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
            <span
              className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-num text-2xl font-bold ring-4 ring-white ${
                i === STEPS.length - 1 ? "bg-field-ink text-white" : "bg-track text-white"
              }`}
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-lg font-extrabold">{s.title}</h3>
              <p className="mt-1 text-slate">{s.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className="space-y-0">
      {STEPS.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
          {i < STEPS.length - 1 && <span aria-hidden="true" className="absolute top-12 bottom-0 left-[1.35rem] w-0.5 bg-mist" />}
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-track font-num text-2xl font-bold text-white">
            {i + 1}
          </span>
          <div className="measure pt-1">
            <h3 className="text-xl font-bold">{s.title}</h3>
            <p className="mt-1">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
