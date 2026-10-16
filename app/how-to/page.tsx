import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "참여 방법" };

export default function Page() {
  return (
    <Placeholder
      title="참여 방법"
      lead="측정부터 결과까지 다섯 단계로 참여해요."
      plan={[
        "5단계 참여 흐름",
        "출발조 편성 규칙 · 부문 · 시상",
        "준비물 · 안전 안내",
      ]}
    />
  );
}
