import type { Metadata } from "next";
import { Suspense } from "react";
import PageIntro from "@/components/PageIntro";
import PlaceFinder, { PlaceFinderView } from "@/components/places/PlaceFinder";
import { places } from "@/lib/data";

export const metadata: Metadata = { title: "훈련 장소 찾기" };

export default function PlacesPage() {
  return (
    <>
      <PageIntro
        title="훈련 장소 찾기"
        lead="체력인증센터에서 무료로 측정하고 체력증진교실에 참여하거나, KANFA 훈련 파트너에서 코스 동작을 연습해 보세요."
      />
      <div className="container-page py-10">
        <Suspense fallback={<PlaceFinderView places={places} />}>
          <PlaceFinder places={places} />
        </Suspense>
        <p className="mt-8 text-sm text-slate">장소 이름과 주소는 모두 시안용 예시예요.</p>
      </div>
    </>
  );
}
