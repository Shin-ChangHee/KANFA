import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "훈련 장소 찾기" };

export default function Page() {
  return (
    <Placeholder
      title="훈련 장소 찾기"
      lead="가까운 체력인증센터와 KANFA 훈련 파트너를 찾아보세요."
      plan={[
        "체력인증센터 8곳 · 훈련 파트너 4곳 목록",
        "지역 필터 · 지도 자리표시",
      ]}
    />
  );
}
