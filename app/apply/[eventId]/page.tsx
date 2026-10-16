import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import { events, getEvent } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ eventId: e.id }));
}

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).eventId);
  return { title: event ? `참가 신청 - ${event.name}` : "참가 신청" };
}

export default async function Page({ params }: Props) {
  const event = getEvent((await params).eventId);
  if (!event) notFound();

  return (
    <Placeholder
      title="참가 신청"
      lead={event.name}
      plan={[
        "1. 부문 선택",
        "2. 참가자 정보",
        "3. 국민체력100 등급 확인",
        "4. 건강 문진",
        "5. 출발 희망 시간대",
        "6. 동의",
        "7. 결제(시연)",
      ]}
    />
  );
}
