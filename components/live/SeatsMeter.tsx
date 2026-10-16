"use client";

import { useApplications } from "@/lib/useApplications";
import { seatsLeft } from "@/lib/event";
import type { KanfaEvent } from "@/lib/types";

/** 남은 자리 숫자와 신청률 막대 */
export default function SeatsMeter({ event }: { event: KanfaEvent }) {
  const apps = useApplications();
  const left = seatsLeft(event, apps);
  const filled = Math.round(((event.capacity - left) / event.capacity) * 100);
  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="text-sm font-semibold text-slate">남은 자리</span>
        <span className="font-num text-[2.5rem] leading-none font-bold text-ink">{left.toLocaleString("ko-KR")}</span>
        <span className="font-semibold">명</span>
        <span className="ml-auto text-sm text-slate">정원 {event.capacity.toLocaleString("ko-KR")}명</span>
      </p>
      <div
        role="meter"
        aria-label="신청률"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={filled}
        aria-valuetext={`정원의 ${filled}% 신청`}
        className="mt-3 h-2.5 overflow-hidden rounded-full bg-mist"
      >
        <div className="h-full rounded-full bg-track" style={{ width: `${filled}%` }} />
      </div>
      <p className="mt-1.5 text-sm text-slate">정원의 {filled}%가 신청했어요</p>
    </div>
  );
}
