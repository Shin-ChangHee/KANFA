import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Placeholder from "@/components/Placeholder";
import { events, getEvent } from "@/lib/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.filter((e) => e.status === "finished").map((e) => ({ eventId: e.id }));
}

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).eventId);
  return { title: event ? `기록·순위 - ${event.name}` : "기록·순위" };
}

export default async function Page({ params }: Props) {
  const event = getEvent((await params).eventId);
  if (!event) notFound();

  return <Placeholder title={`${event.name} 기록·순위`} plan={["순위 표 · 코스·성별·연령대·등급 필터", "성장상 탭"]} />;
}
