import type { Metadata } from "next";
import { Suspense } from "react";
import MyLookup from "@/components/my/MyLookup";
import PageIntro from "@/components/PageIntro";

export const metadata: Metadata = { title: "신청 조회" };

export default function MyPage() {
  return (
    <>
      <PageIntro title="신청 조회" lead="접수번호와 휴대폰 번호 뒤 4자리로 신청 내역을 확인하고, 대회 7일 전까지 취소할 수 있어요." />
      <div className="container-page py-10">
        <Suspense fallback={<p className="text-slate">조회 화면을 준비하고 있어요.</p>}>
          <MyLookup />
        </Suspense>
      </div>
    </>
  );
}
