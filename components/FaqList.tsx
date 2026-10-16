import type { FaqItem } from "@/lib/types";

/** 자주 묻는 질문 아코디언. <details>를 써서 키보드·스크린 리더에서 기본 동작한다. */
export default function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-mist border-y-2 border-ink">
      {items.map((f) => (
        <details key={f.id} id={`faq-${f.id}`} className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-5 text-lg font-bold hover:text-track md:text-xl [&::-webkit-details-marker]:hidden">
            <span>{f.question}</span>
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-track-soft text-track transition-transform group-open:rotate-45">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="measure pb-6 text-lg text-slate">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
