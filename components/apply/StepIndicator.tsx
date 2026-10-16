import { STEPS } from "./schema";

/** 신청 진행 단계. 지나온 단계는 눌러서 돌아갈 수 있다. */
export default function StepIndicator({ current, onGo }: { current: number; onGo: (step: number) => void }) {
  return (
    <nav aria-label="신청 단계">
      <p className="font-semibold text-slate md:hidden">
        <span className="font-num text-xl font-bold text-track">{current + 1}</span> / {STEPS.length} 단계
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-mist md:hidden" aria-hidden="true">
        <div className="h-full rounded-full bg-track" style={{ width: `${((current + 1) / STEPS.length) * 100}%` }} />
      </div>
      <ol className="hidden grid-cols-7 gap-2 md:grid">
        {STEPS.map((label, i) => {
          const done = i < current;
          const now = i === current;
          const content = (
            <>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-num text-lg font-bold ${
                  now ? "bg-track text-white" : done ? "bg-field-ink text-white" : "border-2 border-mist bg-white text-slate"
                }`}
              >
                {done ? (
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span className={`text-sm leading-tight ${now ? "font-extrabold text-ink" : "font-semibold text-slate"}`}>
                {label}
                {done && <span className="sr-only"> (완료)</span>}
              </span>
            </>
          );
          return (
            <li key={label} aria-current={now ? "step" : undefined} className={`border-t-4 pt-2 ${now ? "border-track" : done ? "border-field-ink" : "border-mist"}`}>
              {done ? (
                <button type="button" onClick={() => onGo(i)} className="flex min-h-11 w-full items-center gap-2 rounded-md text-left hover:underline">
                  {content}
                </button>
              ) : (
                <span className="flex min-h-11 items-center gap-2">{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
