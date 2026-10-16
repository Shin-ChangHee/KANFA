import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "신청 완료" };

export default function Page() {
  return (
    <Placeholder
      title="신청 완료"
      lead="신청이 접수됐어요."
      plan={[
        "접수번호(KANFA-2027-0001 형식) · 신청 요약",
        "입장용 QR 자리표시 · 캘린더에 추가(.ics)",
      ]}
    />
  );
}
