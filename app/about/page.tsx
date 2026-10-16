import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "KANFA 소개" };

export default function Page() {
  return (
    <Placeholder
      title="KANFA 소개"
      lead="국민체력100 측정항목으로 겨루는 국민체육진흥공단 주관 참가형 체력 경기이자 시즌 리그예요."
      plan={[
        "KANFA란? · 이름의 뜻",
        "참여 순환 그림(측정 → 인증 → 레이스 → 등급 상승 → 재도전)",
        "세 가지 원칙",
        "체력왕 선발대회에서 이어진 이야기",
        "국민체력100과의 관계",
      ]}
    />
  );
}
