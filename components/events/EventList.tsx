"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { useApplications } from "@/lib/useApplications";
import { seatsLeft, statusOf, upcomingFirst } from "@/lib/event";
import { formatDate, kstYmd } from "@/lib/format";
import type { DivisionType, KanfaEvent } from "@/lib/types";
import StatusBadge from "../StatusBadge";

const DIVISION_FILTERS: { value: DivisionType; label: string }[] = [
  { value: "solo", label: "개인" },
  { value: "pair", label: "2인" },
  { value: "relay4", label: "4인 릴레이" },
];

const selectClass = "mt-1 block min-h-11 w-full rounded-lg border-2 border-mist bg-white px-3 font-semibold focus:border-track";

export default function EventList({ events }: { events: KanfaEvent[] }) {
  const apps = useApplications();
  const [region, setRegion] = useState("");
  const [month, setMonth] = useState("");
  const [division, setDivision] = useState("");
  const ids = { region: useId(), month: useId(), division: useId(), count: useId() };

  const regions = [...new Set(events.map((e) => e.region))];
  const months = [...new Set(events.map((e) => kstYmd(e.date).month))].sort((a, b) => a - b);

  const list = upcomingFirst(events).filter(
    (e) =>
      (!region || e.region === region) &&
      (!month || kstYmd(e.date).month === Number(month)) &&
      (!division || e.divisions.some((d) => d.type === division)),
  );

  const reset = () => {
    setRegion("");
    setMonth("");
    setDivision("");
  };

  return (
    <div>
      <form role="search" aria-label="대회 찾기" className="grid gap-4 rounded-xl border border-mist bg-white p-5 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor={ids.region} className="text-sm font-bold">
            지역
          </label>
          <select id={ids.region} value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
            <option value="">전체 지역</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.month} className="text-sm font-bold">
            월
          </label>
          <select id={ids.month} value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
            <option value="">전체 월</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={ids.division} className="text-sm font-bold">
            부문
          </label>
          <select id={ids.division} value={division} onChange={(e) => setDivision(e.target.value)} className={selectClass}>
            <option value="">전체 부문</option>
            {DIVISION_FILTERS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={reset} className="min-h-11 rounded-lg px-4 font-semibold text-track underline underline-offset-4">
          조건 지우기
        </button>
      </form>

      <p id={ids.count} aria-live="polite" className="mt-6 text-slate">
        대회 {list.length}개
      </p>

      {list.length === 0 ? (
        <div className="mt-3 rounded-xl border-2 border-dashed border-mist bg-white p-8">
          <p className="font-bold">조건에 맞는 대회가 없어요.</p>
          <p className="mt-1 text-slate">지역이나 월을 바꾸거나 조건을 지워 보세요.</p>
        </div>
      ) : (
        <ul className="mt-3 divide-y divide-mist overflow-hidden rounded-xl border border-mist bg-white">
          {list.map((e) => {
            const d = kstYmd(e.date);
            const status = statusOf(e, apps);
            return (
              <li key={e.id} className="relative grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 p-5 hover:bg-lane md:grid-cols-[5rem_1fr_auto] md:items-center">
                <p aria-hidden="true" className="row-span-2 text-center md:row-span-1">
                  <span className="block font-num text-lg leading-none font-semibold text-slate">{d.month}월</span>
                  <span className="block font-num text-[2.5rem] leading-none font-bold text-track">{d.day}</span>
                </p>
                <div>
                  <h2 className="text-xl font-extrabold">
                    {/* 행 전체를 누를 수 있도록 링크 영역을 넓힌다 */}
                    <Link href={`/events/${e.id}`} className="after:absolute after:inset-0 hover:underline">
                      {e.name}
                    </Link>
                  </h2>
                  <p className="text-slate">
                    {formatDate(e.date)} · {e.venue}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <StatusBadge status={status} />
                  {status !== "finished" && (
                    <span className="text-sm">
                      남은 자리 <strong className="font-num text-xl">{seatsLeft(e, apps).toLocaleString("ko-KR")}</strong>명
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
