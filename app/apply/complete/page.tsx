import type { Metadata } from "next";
import { Suspense } from "react";
import CompleteView from "@/components/apply/CompleteView";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = { title: "신청 완료" };

export default function CompletePage() {
  return (
    <>
      <PageIntro title="신청 완료" />
      <div className="container-page py-10">
        <Suspense fallback={<p className="text-slate">신청 내역을 불러오고 있어요.</p>}>
          <CompleteView />
        </Suspense>
      </div>
    </>
  );
}
