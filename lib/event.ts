import { demoNow } from "./clock";
import { daysBetween, formatShortDate, formatTime } from "./format";
import type { EventStatus, KanfaEvent } from "./types";

export const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: "접수 예정",
  open: "접수 중",
  closed: "마감",
  finished: "종료",
};

export function remainingSeats(e: KanfaEvent): number {
  return Math.max(0, e.capacity - e.applied);
}

/** 접수 마감까지 남은 날 (시연 기준 날짜 기준) */
export function daysUntilApplyEnd(e: KanfaEvent): number {
  return daysBetween(demoNow(), e.applyEnd);
}

/** 접수 중이 아닐 때 신청할 수 없는 이유. 신청할 수 있으면 null */
export function applyBlockedReason(e: KanfaEvent): string | null {
  if (e.status === "upcoming") {
    return `${formatShortDate(e.applyStart)} ${formatTime(e.applyStart)}에 접수를 시작해요.`;
  }
  if (e.status === "finished") return "이미 끝난 대회예요. 기록·순위에서 결과를 볼 수 있어요.";
  if (e.status === "closed" || remainingSeats(e) === 0) return "정원이 다 차서 접수를 마감했어요.";
  return null;
}

/** 아직 끝나지 않은 대회 중 가장 가까운 것부터 */
export function upcomingFirst(list: KanfaEvent[]): KanfaEvent[] {
  return [...list].sort((a, b) => {
    const fa = a.status === "finished" ? 1 : 0;
    const fb = b.status === "finished" ? 1 : 0;
    if (fa !== fb) return fa - fb;
    return fa ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
  });
}
