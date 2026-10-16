import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "자주 묻는 질문" };

export default function Page() {
  return (
    <Placeholder
      title="자주 묻는 질문"
      lead="참가 전에 많이 묻는 질문을 모았어요."
      plan={[
        "자주 묻는 질문 9개(아코디언)",
      ]}
    />
  );
}
