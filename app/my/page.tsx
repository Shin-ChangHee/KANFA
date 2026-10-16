import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "신청 조회" };

export default function Page() {
  return (
    <Placeholder
      title="신청 조회"
      lead="접수번호와 휴대폰 번호 뒤 4자리로 신청 내역을 확인해요."
      plan={[
        "신청 상세 · 신청 취소(대회 7일 전까지)",
        "종료된 대회: 내 기록, 출발조 안 순위, 체력 분석 리포트, 운동처방",
      ]}
    />
  );
}
