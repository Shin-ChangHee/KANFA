import PageIntro from "./PageIntro";

/** 개인정보처리방침·이용약관 자리표시 문서 */
export default function LegalDoc({ title, sections }: { title: string; sections: { heading: string; body: string }[] }) {
  return (
    <>
      <PageIntro title={title} lead="시안용 자리표시 문서예요. 실제 내용은 법무 검토 후 확정해요." />
      <div className="container-page py-10">
        <ol className="measure space-y-8">
          {sections.map((s, i) => (
            <li key={s.heading}>
              <h2 className="text-xl font-extrabold">
                제{i + 1}조 {s.heading}
              </h2>
              <p className="mt-2 text-slate">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-slate">시행일: 2027년 3월 1일(시안)</p>
      </div>
    </>
  );
}
