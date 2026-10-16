// 날짜·금액·기록 표시용 함수. 화면에 보이는 형식은 모두 여기서 맞춘다.

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/** 한국 시간 기준 연·월·일·요일·시·분 */
function kstParts(input: string | Date) {
  const d = typeof input === "string" ? new Date(input) : input;
  // 시연 환경의 시간대와 상관없이 한국 시간으로 표시한다.
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
    weekday: WEEKDAYS[kst.getUTCDay()],
    hour: kst.getUTCHours(),
    minute: kst.getUTCMinutes(),
  };
}

/** 2027년 5월 15일(토) */
export function formatDate(input: string | Date): string {
  const p = kstParts(input);
  return `${p.year}년 ${p.month}월 ${p.day}일(${p.weekday})`;
}

/** 5월 15일(토) */
export function formatShortDate(input: string | Date): string {
  const p = kstParts(input);
  return `${p.month}월 ${p.day}일(${p.weekday})`;
}

/** 오전 10시, 오후 2시 30분 */
export function formatTime(input: string | Date): string {
  const p = kstParts(input);
  const ampm = p.hour < 12 ? "오전" : "오후";
  const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  return `${ampm} ${h12}시${p.minute ? ` ${p.minute}분` : ""}`;
}

/** 2027년 5월 15일(토) 오전 10시 */
export function formatDateTime(input: string | Date): string {
  return `${formatDate(input)} ${formatTime(input)}`;
}

/** 50,000원 */
export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

/** 1,122초 → 18:42 */
export function formatRecord(totalSec: number): string {
  const sign = totalSec < 0 ? "-" : "";
  const abs = Math.abs(Math.round(totalSec));
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${sign}${m}:${String(s).padStart(2, "0")}`;
}

/** 홍길동 → 홍*동, 김철 → 김*, 남궁민수 → 남**수 */
export function maskName(name: string): string {
  const chars = Array.from(name.trim());
  if (chars.length <= 1) return name;
  if (chars.length === 2) return `${chars[0]}*`;
  return chars[0] + "*".repeat(chars.length - 2) + chars[chars.length - 1];
}

/** 01012345678 → 010-1234-5678 */
export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

/** 한국 시간 기준 날짜끼리의 차이(일). 마감까지 남은 날 등에 쓴다. */
export function daysBetween(from: string | Date, to: string | Date): number {
  const a = kstParts(from);
  const b = kstParts(to);
  const ua = Date.UTC(a.year, a.month - 1, a.day);
  const ub = Date.UTC(b.year, b.month - 1, b.day);
  return Math.round((ub - ua) / (24 * 60 * 60 * 1000));
}
