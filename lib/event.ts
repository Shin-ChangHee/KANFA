import { localSeatsTaken } from "./applications";
import { demoNow } from "./clock";
import { daysBetween, formatShortDate, formatTime } from "./format";
import type { Application, EventStatus, KanfaEvent } from "./types";

export const STATUS_LABEL: Record<EventStatus, string> = {
  upcoming: "접수 예정",
  open: "접수 중",
  closed: "마감",
  finished: "종료",
};

/** 취소 마감·출발조 배정: 대회 7일 전 */
export const CANCEL_DAYS_BEFORE = 7;

/** 남은 자리. 이 브라우저에서 신청한 인원도 뺀다. */
export function seatsLeft(e: KanfaEvent, apps: Application[] = []): number {
  return Math.max(0, e.capacity - e.applied - localSeatsTaken(e.id, apps));
}

/** 정원이 다 차면 접수 중이어도 마감으로 본다. */
export function statusOf(e: KanfaEvent, apps: Application[] = []): EventStatus {
  if (e.status === "open" && seatsLeft(e, apps) === 0) return "closed";
  return e.status;
}

/** 접수 마감까지 남은 날 (시연 기준 날짜 기준) */
export function daysUntilApplyEnd(e: KanfaEvent): number {
  return daysBetween(demoNow(), e.applyEnd);
}

/** 접수 중이 아닐 때 신청할 수 없는 이유. 신청할 수 있으면 null */
export function applyBlockedReason(e: KanfaEvent, apps: Application[] = []): string | null {
  const status = statusOf(e, apps);
  if (status === "upcoming") {
    return `${formatShortDate(e.applyStart)} ${formatTime(e.applyStart)}에 접수를 시작해요.`;
  }
  if (status === "finished") return "이미 끝난 대회예요. 기록·순위에서 결과를 볼 수 있어요.";
  if (status === "closed") return "정원이 다 차서 접수를 마감했어요.";
  return null;
}

/** 대회일 7일 전 날짜 */
export function cancelDeadline(e: KanfaEvent): Date {
  return new Date(new Date(e.date).getTime() - CANCEL_DAYS_BEFORE * 24 * 60 * 60 * 1000);
}

/** 시연 기준 날짜에 취소할 수 있는지 */
export function canCancelNow(e: KanfaEvent): boolean {
  return e.status !== "finished" && daysBetween(demoNow(), e.date) >= CANCEL_DAYS_BEFORE;
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
