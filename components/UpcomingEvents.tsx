import Link from "next/link";
import { events } from "@/lib/data";
import { applyBlockedReason, daysUntilApplyEnd, remainingSeats, upcomingFirst } from "@/lib/event";
import { formatDate, formatShortDate } from "@/lib/format";
import { buttonClass } from "./ButtonLink";
import StatusBadge from "./StatusBadge";

/** 홈의 다가오는 대회: 가장 가까운 대회 1개를 크게, 나머지는 작게 */
export default function UpcomingEvents() {
  const [main, ...rest] = upcomingFirst(events);
  const blocked = applyBlockedReason(main);
  const days = daysUntilApplyEnd(main);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <article aria-labelledby="main-event-title" className="rounded-2xl border-2 border-track bg-white p-6 md:p-8">
        <StatusBadge status={main.status} />
        <h3 id="main-event-title" className="mt-3 text-2xl font-extrabold md:text-[1.75rem]">
          {main.name}
        </h3>
        <p className="mt-1 text-lg">
          {formatDate(main.date)} · {main.venue}
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-mist py-5">
          <div>
            <dt className="text-sm font-semibold text-slate">접수 마감까지</dt>
            <dd className="mt-1">
              {main.status === "open" ? (
                <>
                  <span className="font-num text-[2.75rem] leading-none font-bold text-track">{days}</span>
                  <span className="ml-1 font-semibold">일</span>
                </>
              ) : (
                <span className="font-semibold">{formatShortDate(main.applyStart)} 접수 시작</span>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-slate">남은 자리</dt>
            <dd className="mt-1">
              <span className="font-num text-[2.75rem] leading-none font-bold text-track">{remainingSeats(main).toLocaleString("ko-KR")}</span>
              <span className="ml-1 font-semibold">명</span>
              <span className="ml-2 text-sm text-slate">/ 정원 {main.capacity.toLocaleString("ko-KR")}명</span>
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {blocked ? (
            <p className="font-semibold">{blocked}</p>
          ) : (
            <Link href={`/apply/${main.id}`} className={buttonClass("primary")}>
              신청하기
            </Link>
          )}
          <Link href={`/events/${main.id}`} className={buttonClass("secondary")}>
            대회 자세히 보기
          </Link>
        </div>
      </article>

      <div>
        <h3 className="text-lg font-bold">다른 대회</h3>
        <ul className="mt-3 divide-y divide-mist border-y border-mist">
          {rest.map((e) => (
            <li key={e.id}>
              <Link href={`/events/${e.id}`} className="block py-4 hover:bg-white">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-track underline-offset-4 hover:underline">{e.name}</span>
                  <StatusBadge status={e.status} />
                </span>
                <span className="mt-1 block text-slate">
                  {formatDate(e.date)} · {e.venue}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/events" className="mt-3 inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4">
          전체 대회 일정 보기
        </Link>
      </div>
    </div>
  );
}
