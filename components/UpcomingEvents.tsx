import Link from "next/link";
import { events } from "@/lib/data";
import { demoNow } from "@/lib/clock";
import { daysUntilApplyEnd, upcomingFirst } from "@/lib/event";
import { daysBetween, formatDate, formatShortDate, formatTime, kstYmd } from "@/lib/format";
import { buttonClass } from "./ButtonLink";
import { ApplyAction, LiveStatusBadge } from "./live/EventLive";
import SeatsMeter from "./live/SeatsMeter";

const WEEKDAY = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

/** 홈의 다가오는 대회: 가장 가까운 대회 1개를 크게, 나머지는 작게 */
export default function UpcomingEvents() {
  const [main, ...rest] = upcomingFirst(events);
  const d = kstYmd(main.date);
  const weekday = WEEKDAY[new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()];
  const dday = daysBetween(demoNow(), main.date);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
      <article
        aria-labelledby="main-event-title"
        className="grid overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_var(--color-mist),0_18px_40px_-24px_rgb(20_33_61/0.45)] sm:grid-cols-[11rem_1fr]"
      >
        {/* 날짜 전광판 */}
        <div className="on-dark relative flex items-center justify-between gap-4 overflow-hidden bg-track-night p-6 text-white sm:flex-col sm:items-start sm:justify-between">
          <div aria-hidden="true" className="lanes absolute inset-0 opacity-60" />
          <p className="relative">
            <span className="block font-num text-2xl leading-none font-semibold text-on-track">{d.month}월</span>
            <span className="block font-num text-[4.5rem] leading-[0.9] font-bold">{d.day}</span>
            <span className="mt-1 block font-semibold text-on-track">{weekday}</span>
          </p>
          <p className="relative rounded-lg bg-amber px-3 py-1.5 text-ink">
            <span className="sr-only">대회까지 </span>
            <span className="font-num text-2xl font-bold">D-{dday}</span>
          </p>
        </div>

        <div className="p-6 md:p-8">
          <LiveStatusBadge event={main} />
          <h3 id="main-event-title" className="mt-3 text-[1.625rem] font-extrabold md:text-[2rem]">
            {main.name}
          </h3>
          <p className="mt-1 text-lg text-slate">
            {formatDate(main.date)} · {main.venue}
          </p>

          <div className="mt-6 grid gap-6 border-t border-mist pt-6 md:grid-cols-[auto_1fr] md:gap-10">
            <p>
              <span className="block text-sm font-semibold text-slate">접수 마감까지</span>
              {main.status === "open" ? (
                <>
                  <span className="font-num text-[2.5rem] leading-none font-bold text-track">{daysUntilApplyEnd(main)}</span>
                  <span className="ml-1 font-semibold">일</span>
                  <span className="mt-1 block text-sm text-slate">
                    {formatShortDate(main.applyEnd)} {formatTime(main.applyEnd)}
                  </span>
                </>
              ) : (
                <span className="font-semibold">{formatShortDate(main.applyStart)} 접수 시작</span>
              )}
            </p>
            <SeatsMeter event={main} />
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ApplyAction event={main} />
            <Link href={`/events/${main.id}`} className={buttonClass("secondary")}>
              대회 자세히 보기
            </Link>
          </div>
        </div>
      </article>

      <div>
        <h3 className="text-lg font-bold">다른 대회</h3>
        <ul className="mt-3 divide-y divide-mist border-y border-mist">
          {rest.map((e) => {
            const ed = kstYmd(e.date);
            return (
              <li key={e.id} className="relative flex gap-4 py-4">
                <p aria-hidden="true" className="w-12 shrink-0 text-center">
                  <span className="block font-num text-sm font-semibold text-slate">{ed.month}월</span>
                  <span className="block font-num text-3xl leading-none font-bold text-ink">{ed.day}</span>
                </p>
                <div>
                  <p className="flex flex-wrap items-center gap-2">
                    <Link href={`/events/${e.id}`} className="font-bold text-ink after:absolute after:inset-0 hover:underline">
                      {e.name}
                    </Link>
                    <LiveStatusBadge event={e} />
                  </p>
                  <p className="mt-0.5 text-slate">
                    {formatDate(e.date)} · {e.venue}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/events" className="mt-3 inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4">
          전체 대회 일정 보기
        </Link>
      </div>
    </div>
  );
}
