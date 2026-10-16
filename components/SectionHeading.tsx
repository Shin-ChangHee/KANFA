import type { ReactNode } from "react";

export default function SectionHeading({ id, title, lead, children, onDark = false }: { id: string; title: string; lead?: string; children?: ReactNode; onDark?: boolean }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <span aria-hidden="true" className="lane-mark mb-4" />
        <h2 id={id} className="text-[1.875rem] font-extrabold md:text-[2.375rem]">
          {title}
        </h2>
        {lead && <p className={`measure mt-3 text-lg ${onDark ? "text-on-track" : "text-slate"}`}>{lead}</p>}
      </div>
      {children}
    </div>
  );
}
