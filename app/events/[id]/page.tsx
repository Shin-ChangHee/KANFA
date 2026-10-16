import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplyAction, LiveStatusBadge, SeatsLeft } from "@/components/live/EventLive";
import PageIntro from "@/components/PageIntro";
import { events, getEvent } from "@/lib/data";
import { daysUntilApplyEnd } from "@/lib/event";
import { formatDate, formatDateTime, formatWon } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).id);
  return { title: event?.name ?? "대회 상세" };
}

const H2 = "section-title";

export default async function EventDetailPage({ params }: Props) {
  const event = getEvent((await params).id);
  if (!event) notFound();

  const am = event.heatsPreview.filter((h) => h.time < "12:00");
  const pm = event.heatsPreview.filter((h) => h.time >= "12:00");
  const finished = event.status === "finished";

  return (
    <>
      <PageIntro
        title={event.name}
        lead={`${formatDate(event.date)} · ${event.venue}`}
        eyebrow={
          <Link href="/events" className="inline-flex min-h-11 items-center text-white underline underline-offset-4">
            대회 일정으로 돌아가기
          </Link>
        }
      >
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <LiveStatusBadge event={event} />
          <div className="[&_a]:bg-white [&_a]:text-track [&_a:hover]:bg-lane [&_p]:text-white">
            <ApplyAction event={event} label="참가 신청하기" />
          </div>
          {finished && (
            <Link href={`/results/${event.id}`} className="inline-flex min-h-11 items-center font-semibold text-white underline underline-offset-4">
              기록·순위 보기
            </Link>
          )}
        </div>
      </PageIntro>

      <div className="container-page grid gap-12 py-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="info-title">
            <h2 id="info-title" className={H2}>
              기본 정보
            </h2>
            <dl className="mt-5 divide-y divide-mist rounded-xl border border-mist bg-white">
              {[
                ["일시", `${formatDate(event.date)} 오전 9시부터`],
                ["장소", event.venue],
                ["접수 기간", `${formatDateTime(event.applyStart)} ~ ${formatDateTime(event.applyEnd)}`],
              ].map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
                  <dt className="font-bold text-slate">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
              <div className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
                <dt className="font-bold text-slate">정원</dt>
                <dd>
                  {event.capacity.toLocaleString("ko-KR")}명
                  {!finished && (
                    <>
                      {" "}
                      · 남은 자리 <strong className="font-num text-xl">{<SeatsLeft event={event} />}</strong>명
                    </>
                  )}
                  {event.status === "open" && <span className="ml-2 text-slate">(접수 마감까지 {daysUntilApplyEnd(event)}일)</span>}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="fee-title">
            <h2 id="fee-title" className={H2}>
              부문별 참가비
            </h2>
            <div className="mt-5 overflow-x-auto rounded-xl border border-mist bg-white">
              <table className="w-full min-w-[22rem] text-left">
                <caption className="sr-only">부문별 팀 인원과 참가비</caption>
                <thead className="bg-lane text-sm text-slate">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      부문
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      인원
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">
                      참가비(시안)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mist">
                  {event.divisions.map((d) => (
                    <tr key={d.name}>
                      <th scope="row" className="px-5 py-4 font-bold">
                        {d.name}
                      </th>
                      <td className="px-5 py-4">{d.teamSize}명</td>
                      <td className="px-5 py-4 text-right font-semibold">{formatWon(d.fee)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-slate">대회 7일 전까지 취소하면 전액 환불돼요(시안 기준).</p>
          </section>

          <section aria-labelledby="heat-title">
            <h2 id="heat-title" className={H2}>
              출발 시간표 예시
            </h2>
            <p className="measure mt-2 text-slate">출발조는 30명씩, 10분 간격으로 출발해요. 실제 출발조와 시간은 대회 7일 전에 문자로 알려 드려요.</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {[
                { title: "오전", rows: am },
                { title: "오후", rows: pm },
              ].map((g) => (
                <div key={g.title}>
                  <h3 className="text-lg font-bold">{g.title}</h3>
                  <ol className="mt-2 divide-y divide-mist rounded-xl border border-mist bg-white">
                    {g.rows.map((h) => (
                      <li key={h.time} className="flex items-baseline gap-4 px-4 py-3">
                        <span className="w-14 shrink-0 font-num text-xl font-bold whitespace-nowrap text-track">{h.time}</span>
                        <span>{h.label}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside aria-labelledby="map-title" className="min-w-0">
          <h2 id="map-title" className={H2}>
            오시는 길
          </h2>
          <div
            role="img"
            aria-label={`${event.venue} 지도 자리(지도 준비 중)`}
            className="mt-5 flex aspect-[4/3] w-full max-w-full items-center justify-center rounded-xl border-2 border-dashed border-track/40 bg-track-soft"
          >
            <span aria-hidden="true" className="text-center font-semibold text-track">
              지도 준비 중
              <br />
              <span className="text-sm font-normal text-slate">{event.venue}</span>
            </span>
          </div>
          <p className="mt-3 text-slate">대중교통과 주차 안내는 대회 공지로 알려 드려요. 대회장이 붐비니 대중교통을 이용해 주세요.</p>
        </aside>
      </div>
    </>
  );
}
