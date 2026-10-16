import { kstYmd } from "./format";
import type { CourseType } from "./types";

/**
 * 생년월일 입력을 YYYY-MM-DD로 바꾼다. 19900315, 1990-03-15, 1990.03.15 모두 받는다.
 * 없는 날짜이거나 형식이 다르면 null.
 */
export function parseBirth(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.length !== 8) return null;
  const y = Number(d.slice(0, 4));
  const m = Number(d.slice(4, 6));
  const day = Number(d.slice(6, 8));
  if (y < 1900 || m < 1 || m > 12 || day < 1) return null;
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  if (day > last) return null;
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

/** 기준일(한국 시간)의 만 나이 */
export function ageOn(birthIso: string, on: string | Date): number {
  const [by, bm, bd] = birthIso.split("-").map(Number);
  const t = kstYmd(on);
  const beforeBirthday = t.month < bm || (t.month === bm && t.day < bd);
  return t.year - by - (beforeBirthday ? 1 : 0);
}

export const MIN_AGE = 19;
export const SENIOR_AGE = 65;

/** 만 19~64세 성인 코스, 만 65세 이상 어르신 코스, 만 19세 미만은 null(신청 불가) */
export function courseForAge(age: number): CourseType | null {
  if (age < MIN_AGE) return null;
  return age >= SENIOR_AGE ? "senior" : "adult";
}

export const COURSE_NAME: Record<CourseType, string> = {
  adult: "성인 코스",
  senior: "어르신 코스",
};
