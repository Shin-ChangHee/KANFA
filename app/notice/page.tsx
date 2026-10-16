import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "공지사항" };

export default function Page() {
  return (
    <Placeholder
      title="공지사항"
      lead="KANFA 운영 소식을 알려 드려요."
      plan={[
        "공지 목록 · 상세",
      ]}
    />
  );
}
