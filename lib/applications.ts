// 신청 내역 저장소. localStorage 키 `kanfa.applications`에 배열로 저장한다.
import { STORAGE_KEYS, writeJSON } from "./storage";
import type { Application } from "./types";

const KEY = STORAGE_KEYS.applications;
export const EMPTY_APPLICATIONS: Application[] = [];
const listeners = new Set<() => void>();

// 같은 문자열이면 같은 배열을 돌려줘야 useSyncExternalStore가 불필요하게 다시 그리지 않는다.
let cacheRaw: string | null = null;
let cache: Application[] = EMPTY_APPLICATIONS;

export function readApplications(): Application[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? (parsed as Application[]) : EMPTY_APPLICATIONS;
  } catch {
    cache = EMPTY_APPLICATIONS;
  }
  return cache;
}

export function subscribeApplications(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(list: Application[]) {
  writeJSON(KEY, list);
  listeners.forEach((l) => l());
}

export function getApplications(): Application[] {
  return readApplications();
}

export function addApplication(app: Application): void {
  write([...readApplications(), app]);
}

export function cancelApplication(id: string): void {
  write(readApplications().map((a) => (a.id === id ? { ...a, status: "cancelled" as const, cancelledAt: new Date().toISOString() } : a)));
}

/** KANFA-2027-0001 형식의 다음 접수번호 */
export function nextApplicationId(year: number): string {
  const prefix = `KANFA-${year}-`;
  const max = readApplications()
    .filter((a) => a.id.startsWith(prefix))
    .reduce((m, a) => Math.max(m, Number(a.id.slice(prefix.length)) || 0), 0);
  return prefix + String(max + 1).padStart(4, "0");
}

/** 이 브라우저에서 신청해 차지한 자리 수 (취소 제외) */
export function localSeatsTaken(eventId: string, list: Application[]): number {
  return list.filter((a) => a.eventId === eventId && a.status === "paid").reduce((n, a) => n + a.participants.length, 0);
}

/** 같은 대회에 같은 휴대폰 번호로 신청한 내역 (취소 제외) */
export function findByPhone(eventId: string, phone: string, list: Application[]): Application | undefined {
  return list.find((a) => a.eventId === eventId && a.status === "paid" && a.participants.some((p) => p.phone === phone));
}
