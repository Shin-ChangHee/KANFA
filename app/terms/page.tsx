import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "이용약관" };

export default function Page() {
  return (
    <Placeholder
      title="이용약관"
      lead="시안용 자리표시 문서예요."
      plan={[
        "대회 참가 약관 · 취소·환불 규정(자리표시)",
      ]}
    />
  );
}
