import type { Metadata } from "next";
import Link from "next/link";
import Placeholder from "@/components/Placeholder";
import { sortedEvents } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "대회 일정" };

export default function Page() {
  return (
    <Placeholder
      title="대회 일정"
      lead="다가오는 KANFA 대회를 확인하고 신청하세요."
      plan={["대회 목록과 접수 상태(접수 예정·접수 중·마감·종료)", "지역 · 월 · 부문 필터"]}
    >
      <ul className="mt-8 space-y-2">
        {sortedEvents().map((e) => (
          <li key={e.id}>
            <Link href={`/events/${e.id}`} className="inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4">
              {e.name} · {formatDate(e.date)} · {e.venue}
            </Link>
          </li>
        ))}
      </ul>
    </Placeholder>
  );
}
