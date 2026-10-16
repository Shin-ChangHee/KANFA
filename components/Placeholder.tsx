import type { ReactNode } from "react";
import PageIntro from "./PageIntro";

/** Phase 1 빈 페이지: 이후 Phase에서 채울 내용을 적어 둔다. */
export default function Placeholder({ title, lead, plan, children }: { title: string; lead?: string; plan: string[]; children?: ReactNode }) {
  return (
    <>
      <PageIntro title={title} lead={lead} />
      <div className="container-page py-10">
        <section aria-labelledby="todo-title" className="measure rounded-xl border-2 border-dashed border-mist bg-white p-6">
          <h2 id="todo-title" className="text-lg font-bold">
            준비 중인 화면이에요
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-slate">
            {plan.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        {children}
      </div>
    </>
  );
}
