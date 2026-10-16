import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function Page() {
  return (
    <Placeholder
      title="개인정보처리방침"
      lead="시안용 자리표시 문서예요."
      plan={[
        "개인정보 수집 항목 · 이용 목적 · 보관 기간(자리표시)",
      ]}
    />
  );
}
