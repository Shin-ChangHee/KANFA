import type { ReactNode } from "react";

export default function SectionHeading({ id, title, lead, children }: { id: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 id={id} className="text-[1.625rem] font-extrabold md:text-[2rem]">
          {title}
        </h2>
        {lead && <p className="measure mt-2 text-slate">{lead}</p>}
      </div>
      {children}
    </div>
  );
}
