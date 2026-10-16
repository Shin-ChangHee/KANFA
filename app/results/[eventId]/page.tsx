import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ResultsBoard from "@/components/results/ResultsBoard";
import { events, getEvent, getResults } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.filter((e) => e.status === "finished").map((e) => ({ eventId: e.id }));
}

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).eventId);
  return { title: event ? `기록·순위 - ${event.name}` : "기록·순위" };
}

export default async function ResultsPage({ params }: Props) {
  const event = getEvent((await params).eventId);
  if (!event) notFound();
  const list = getResults(event.id);
  const finished = events.filter((e) => e.status === "finished");

  return (
    <>
      <PageIntro title={`${event.name} 기록·순위`} lead={`${formatDate(event.date)} · ${event.venue} · 완주 ${list.length}명(시안 데이터)`}>
        {finished.length > 1 && (
          <nav aria-label="다른 대회 기록" className="mt-4 flex flex-wrap gap-3">
            {finished.map((e) => (
              <Link key={e.id} href={`/results/${e.id}`} aria-current={e.id === event.id ? "page" : undefined} className="font-semibold text-track underline">
                {e.name}
              </Link>
            ))}
          </nav>
        )}
      </PageIntro>
      <div className="container-page py-10">
        <ResultsBoard results={list} />
        <p className="mt-8">
          참가했다면{" "}
          <Link href="/my" className="font-semibold text-track underline underline-offset-4">
            신청 조회
          </Link>
          에서 내 구간 기록과 체력 분석 리포트를 볼 수 있어요.
        </p>
      </div>
    </>
  );
}
