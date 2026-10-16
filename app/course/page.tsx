import type { Metadata } from "next";
import Placeholder from "@/components/Placeholder";

export const metadata: Metadata = { title: "코스 안내" };

export default function Page() {
  return (
    <Placeholder
      title="코스 안내"
      lead="국민체력100 공식 측정 동작 6개 구간을 차례로 돌아요."
      plan={[
        "성인 코스 / 어르신 코스 탭(주소 ?tab=senior 연동)",
        "6개 구간 상세: 체력요소, 원래 측정항목, 레이스 규칙, 동작 설명, 도움말",
      ]}
    />
  );
}
