import type { ReactNode } from "react";

/** 각 페이지 맨 위 제목 띠. 트랙 블루 위에 레인 선을 깔아 사이트 전체에 같은 인상을 준다. */
export default function PageIntro({ title, lead, eyebrow, children }: { title: string; lead?: string; eyebrow?: ReactNode; children?: ReactNode }) {
  return (
    <div className="on-dark relative overflow-hidden bg-track text-white">
      <div aria-hidden="true" className="lanes absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-y-0 right-[12%] hidden w-1.5 bg-white/25 md:block" />
      <div className="container-page relative py-12 md:py-16">
        {eyebrow && <div className="mb-3 font-semibold text-on-track">{eyebrow}</div>}
        <h1 className="max-w-3xl text-[2.125rem] leading-tight font-extrabold md:text-[2.75rem]">{title}</h1>
        {lead && <p className="measure mt-4 text-lg text-on-track">{lead}</p>}
        {children}
      </div>
    </div>
  );
}
