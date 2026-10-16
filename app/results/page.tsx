import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { buttonClass } from "@/components/ButtonLink";
import { events, getResults } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "기록·순위" };

export default function ResultsIndexPage() {
  const finished = events.filter((e) => e.status === "finished").sort((a, b) => b.date.localeCompare(a.date));
  const upcoming = events.filter((e) => e.status !== "finished");

  return (
    <>
      <PageIntro title="기록·순위" lead="대회를 골라 기록과 성장상 순위를 확인하세요." />
      <div className="container-page space-y-10 py-10">
        <section aria-labelledby="done-title">
          <h2 id="done-title" className="text-xl font-extrabold">
            끝난 대회
          </h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {finished.map((e) => (
              <li key={e.id} className="rounded-xl border border-mist bg-white p-6">
                <h3 className="text-xl font-extrabold">{e.name}</h3>
                <p className="mt-1 text-slate">
                  {formatDate(e.date)} · {e.venue}
                </p>
                <p className="mt-3">
                  완주 <strong className="font-num text-2xl">{getResults(e.id).length}</strong>명
                </p>
                <Link href={`/results/${e.id}`} className={buttonClass("primary", "mt-4")}>
                  기록 보기<span className="sr-only"> ({e.name})</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="soon-title">
          <h2 id="soon-title" className="text-xl font-extrabold">
            기록이 나올 대회
          </h2>
          <ul className="mt-3 space-y-1 text-slate">
            {upcoming.map((e) => (
              <li key={e.id}>
                {e.name} · {formatDate(e.date)} · 대회가 끝나면 기록을 올려요.
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
