import type { ReactNode } from "react";

/** 각 페이지 맨 위 제목 영역 */
export default function PageIntro({ title, lead, children }: { title: string; lead?: string; children?: ReactNode }) {
  return (
    <div className="border-b border-mist bg-white">
      <div className="container-page py-10 md:py-14">
        <h1 className="text-[2rem] font-extrabold md:text-[2.5rem]">{title}</h1>
        {lead && <p className="measure mt-3 text-lg text-slate">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
