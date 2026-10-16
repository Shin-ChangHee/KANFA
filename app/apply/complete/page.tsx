import type { Metadata } from "next";
import { Suspense } from "react";
import CompleteView from "@/components/apply/CompleteView";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = { title: "신청 완료" };

export default function CompletePage() {
  return (
    <>
      <PageIntro title="신청 완료" lead="접수번호와 신청 내용을 확인하세요. 접수번호는 신청 조회와 취소에 필요하니 꼭 적어 두세요." />
      <div className="container-page py-10">
        <Suspense fallback={<p className="min-h-[13rem] rounded-xl border-2 border-mist bg-white p-6 text-slate">신청 내역을 불러오고 있어요.</p>}>
          <CompleteView />
        </Suspense>
      </div>
    </>
  );
}
