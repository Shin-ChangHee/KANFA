import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import { events } from "@/lib/data";

export const metadata: Metadata = { title: "기록·순위" };

export default function Page() {
  return (
    <Placeholder
      title="기록·순위"
      lead="대회별 기록과 성장상 순위를 확인해요."
      plan={[
        "대회 선택 · 코스 · 성별 · 연령대 · 등급 필터",
        "성장상 탭",
      ]}
    >
      <ul className="mt-8 space-y-2">
        {events
          .filter((e) => e.status === "finished")
          .map((e) => (
            <li key={e.id}>
              <Link href={`/results/${e.id}`} className="inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4">
                {e.name} 기록 보기
              </Link>
            </li>
          ))}
      </ul>
    </Placeholder>
  );
}
