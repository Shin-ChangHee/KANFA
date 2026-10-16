import Link from "next/link";
import { events, results } from "@/lib/data";
import { formatRecord } from "@/lib/format";
import { compareSplits, gradePeerCount, heatLabel, PRESCRIPTIONS, rankInHeat, weakestSplit } from "@/lib/results";
import type { Participant, Result } from "@/lib/types";
import { buttonClass } from "../ButtonLink";
import LaneBadge from "../LaneBadge";

// 차트 색: 나 = 트랙 블루, 같은 등급 평균 = 앰버 (팔레트 검사 통과, 값 라벨·표로 대비 보완)
const MINE = "#1E4FA0";
const AVG = "#E39A2D";

function SplitChart({ result }: { result: Result }) {
  const rows = compareSplits(result, results);
  const max = Math.max(...rows.flatMap((r) => [r.mine, r.average]));
  const pct = (v: number) => `${Math.max(2, (v / max) * 100)}%`;
  return (
    <figure>
      <figcaption className="sr-only">체력요소별 내 구간 기록과 같은 등급 평균 비교 막대그래프. 막대가 짧을수록 빨라요. 아래 표로도 볼 수 있어요.</figcaption>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm" aria-hidden="true">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-5 rounded-sm" style={{ background: MINE }} />나
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-5 rounded-sm" style={{ background: AVG }} />
          같은 등급 평균
        </span>
        <span className="text-slate">막대가 짧을수록 빨라요</span>
      </div>
      <ol className="mt-4 space-y-4" aria-hidden="true">
        {rows.map((r) => (
          <li key={r.order} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 sm:grid-cols-[8rem_1fr]">
            <span className="text-sm leading-tight font-bold">
              <span className="mr-1 font-num text-track">{r.order}</span>
              {r.element}
            </span>
            <span className="space-y-0.5 border-l border-mist">
              {[
                { v: r.mine, c: MINE, label: "나" },
                { v: r.average, c: AVG, label: "평균" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-2" title={`${b.label} ${formatRecord(b.v)}`}>
                  <span className="block h-3.5 rounded-r" style={{ width: pct(b.v), maxWidth: "calc(100% - 3.5rem)", background: b.c }} />
                  <span className="font-num text-sm font-semibold text-ink">{formatRecord(b.v)}</span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
      <details className="mt-5">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-track underline underline-offset-4">표로 보기</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">구간별 기록 비교표</caption>
            <thead className="bg-lane text-slate">
              <tr>
                <th scope="col" className="px-3 py-2">
                  구간
                </th>
                <th scope="col" className="px-3 py-2">
                  체력요소
                </th>
                <th scope="col" className="px-3 py-2 text-right">
                  내 기록
                </th>
                <th scope="col" className="px-3 py-2 text-right">
                  같은 등급 평균
                </th>
                <th scope="col" className="px-3 py-2 text-right">
                  차이
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mist">
              {rows.map((r) => (
                <tr key={r.order}>
                  <td className="px-3 py-2 font-num">{r.order}</td>
                  <th scope="row" className="px-3 py-2">
                    {r.element}
                  </th>
                  <td className="px-3 py-2 text-right font-num">{formatRecord(r.mine)}</td>
                  <td className="px-3 py-2 text-right font-num">{formatRecord(r.average)}</td>
                  <td className="px-3 py-2 text-right">{r.diffPct === 0 ? "평균과 같아요" : r.diffPct > 0 ? `${r.diffPct}% 느려요` : `${-r.diffPct}% 빨라요`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

export default function RaceReport({ participant }: { participant: Participant }) {
  const result = results.find((r) => r.bib === participant.bib);
  if (!result) {
    return <p className="rounded-xl border border-mist bg-white p-5">기록을 정리하고 있어요. 대회가 끝나고 3일 안에 올려 드려요.</p>;
  }
  const { rank, size } = rankInHeat(result, results);
  const rows = compareSplits(result, results);
  const weak = weakestSplit(rows);
  const strong = [...rows].sort((a, b) => a.diffPct - b.diffPct)[0];
  const rx = PRESCRIPTIONS[weak.element];
  const nextEvent = events.find((e) => e.status === "open") ?? events.find((e) => e.status === "upcoming");

  return (
    <div className="space-y-8">
      <section aria-labelledby={`rec-${result.bib}`} className="rounded-2xl border-2 border-track bg-white p-6 md:p-8">
        <h3 id={`rec-${result.bib}`} className="text-xl font-extrabold">
          {participant.name}님의 기록
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate">최종 기록</p>
            <p className="font-num text-[3rem] leading-none font-bold text-track">{formatRecord(result.totalSec)}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate">같은 출발조 안의 순위</p>
            <p className="leading-none">
              <span className="font-num text-[3rem] font-bold">{rank}</span>
              <span className="ml-1 font-bold">위</span>
              <span className="ml-2 text-slate">/ {size}명</span>
            </p>
          </div>
          {result.improvementSec ? (
            <div>
              <p className="text-sm font-semibold text-slate">사전 측정 레이스보다</p>
              <p className="leading-none text-field-ink">
                <span className="font-num text-[3rem] font-bold">{formatRecord(result.improvementSec)}</span>
                <span className="ml-1 font-bold">빨라졌어요</span>
              </p>
            </div>
          ) : null}
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-slate">
          <LaneBadge grade={result.grade} size="sm" /> 출발조: {heatLabel(result)} · 배번 {result.bib}
        </p>
      </section>

      <section aria-labelledby={`chart-${result.bib}`}>
        <h3 id={`chart-${result.bib}`} className="text-xl font-extrabold">
          체력 분석 리포트
        </h3>
        <p className="measure mt-1 text-slate">
          구간마다 내 기록을 같은 코스·같은 {result.grade}등급 참가자 {gradePeerCount(result, results)}명의 평균과 비교했어요.
        </p>
        <div className="mt-5 rounded-xl border border-mist bg-white p-5 md:p-6">
          <SplitChart result={result} />
        </div>
      </section>

      <section aria-labelledby={`rx-${result.bib}`} className="rounded-xl bg-field-soft p-6">
        <h3 id={`rx-${result.bib}`} className="text-xl font-extrabold">
          운동처방
        </h3>
        <p className="measure mt-3">
          <strong>{weak.element}</strong> 구간이 같은 등급 평균보다 {weak.diffPct > 0 ? `${weak.diffPct}% 느렸어요` : "조금 아쉬웠어요"}.
          {strong.diffPct < 0 && (
            <>
              {" "}
              반대로 <strong>{strong.element}</strong>은 평균보다 {-strong.diffPct}% 빨랐어요.
            </>
          )}
        </p>
        {rx && (
          <dl className="measure mt-4 space-y-2 rounded-lg bg-white p-4">
            <div>
              <dt className="inline font-bold">추천 운동 </dt>
              <dd className="inline">{rx.what}</dd>
            </div>
            <div>
              <dt className="inline font-bold">방법 </dt>
              <dd className="inline">{rx.how}</dd>
            </div>
          </dl>
        )}
        <p className="measure mt-4">
          가까운 체력인증센터의 체력증진교실에서 전문가와 함께 운동할 수 있어요. 운동한 뒤 다시 측정해 등급이 오르면 다음 대회에서 상위 출발조로 올라가요.
        </p>
        <p className="mt-2 text-sm text-slate">시안 문구예요. 실제 운동처방은 체력인증센터 측정 결과를 바탕으로 전문가가 정해요.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/places?kind=center" className={buttonClass("secondary")}>
            가까운 체력증진교실 찾기
          </Link>
          {nextEvent && (
            <Link href={`/events/${nextEvent.id}`} className={buttonClass("primary")}>
              다음 대회 신청하기
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
