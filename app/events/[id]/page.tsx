import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import { events, getEvent } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event?.name ?? "대회 상세" };
}

export default async function Page({ params }: Props) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  return (
    <Placeholder
      title={event.name}
      lead={`${formatDate(event.date)} · ${event.venue}`}
      plan={["일시 · 장소 · 접수 기간 · 정원과 잔여 인원", "부문별 참가비 · 출발 시간표 예시", "오시는 길(지도 자리표시)", "[참가 신청하기] 버튼(접수 중일 때만)"]}
    >
      <Link href={`/apply/${event.id}`} className="mt-8 inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4">
        참가 신청서 화면 보기
      </Link>
    </Placeholder>
  );
}
