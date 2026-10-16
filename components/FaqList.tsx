import type { FaqItem } from "@/lib/types";

/** 자주 묻는 질문 아코디언. <details>를 써서 키보드·스크린 리더에서 기본 동작한다. */
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-mist rounded-xl border border-mist bg-white">
      {items.map((f) => (
        <details key={f.id} id={`faq-${f.id}`} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
            <span>{f.question}</span>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" className="shrink-0 transition-transform group-open:rotate-180">
              <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="measure px-5 pb-5 text-slate">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
