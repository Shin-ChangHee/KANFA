// 국민체력100 등급 조회 목업. 실제 시스템과 연동하지 않는다. (계획서 5.2)
import { demoNow } from "./clock";
import type { Grade } from "./types";

export type GradeLookupResult =
  | { status: "found"; grade: Grade; measuredAt: string }
  | { status: "none" }
  | { status: "expired"; grade: Grade; measuredAt: string };

const DAY = 24 * 60 * 60 * 1000;
/** 등급 유효기간: 측정 후 1년 */
export const GRADE_VALID_DAYS = 365;

/**
 * 휴대폰 번호 끝자리로 결과를 정한다.
 * 0~5: 끝자리+1 등급 / 6~7: 측정 이력 없음 / 8~9: 측정한 지 1년 지남
 */
export function lookupGrade(phone: string, eventDate: string): GradeLookupResult {
  const last = Number(phone.replace(/\D/g, "").slice(-1));
  const now = demoNow().getTime();

  if (last <= 5) {
    const measuredAt = new Date(now - (last + 1) * 25 * DAY).toISOString();
    return { status: "found", grade: (last + 1) as Grade, measuredAt };
  }
  if (last <= 7) return { status: "none" };

  const measuredAt = new Date(now - 420 * DAY).toISOString();
  // 끝자리 8은 3등급, 9는 5등급이었던 것으로 둔다.
  const grade = (last === 8 ? 3 : 5) as Grade;
  // 대회일 기준으로 유효기간이 지났는지 다시 확인한다.
  const expired = new Date(eventDate).getTime() - new Date(measuredAt).getTime() > GRADE_VALID_DAYS * DAY;
  return expired ? { status: "expired", grade, measuredAt } : { status: "found", grade, measuredAt };
}
