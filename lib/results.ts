// 경기 기록 계산: 출발조, 순위, 같은 등급 평균, 운동처방 (계획서 4.8, 4.9)
import { getCourse } from "./data";
import type { Result } from "./types";

/** 시범 대회 출발조 편성(대회 상세의 출발 시간표와 같은 기준) */
export function heatKey(r: Result): string {
  if (r.course === "senior") return "senior";
  return `adult-${r.gender}-${r.grade <= 3 ? "1-3" : "4-6"}`;
}

export function heatLabel(r: Result): string {
  if (r.course === "senior") return "어르신 코스 · 남녀 · 1~6등급";
  return `성인 코스 · ${r.gender === "M" ? "남성" : "여성"} · ${r.grade <= 3 ? "1~3" : "4~6"}등급`;
}

const byTime = (a: Result, b: Result) => a.totalSec - b.totalSec;

/** 같은 출발조 안의 순위 */
export function rankInHeat(r: Result, all: Result[]): { rank: number; size: number } {
  const heat = all.filter((x) => x.eventId === r.eventId && heatKey(x) === heatKey(r)).sort(byTime);
  return { rank: heat.findIndex((x) => x.bib === r.bib) + 1, size: heat.length };
}

/** 같은 코스·같은 등급 참가자의 구간별 평균 기록(초) */
export function gradeAverageSplits(r: Result, all: Result[]): number[] {
  const peers = all.filter((x) => x.eventId === r.eventId && x.course === r.course && x.grade === r.grade);
  return r.splits.map((_, i) => Math.round(peers.reduce((s, x) => s + x.splits[i], 0) / peers.length));
}

export function gradePeerCount(r: Result, all: Result[]): number {
  return all.filter((x) => x.eventId === r.eventId && x.course === r.course && x.grade === r.grade).length;
}

export interface SplitCompare {
  order: number;
  element: string;
  mine: number;
  average: number;
  /** 평균보다 몇 % 느린지(+) 빠른지(-) */
  diffPct: number;
}

export function compareSplits(r: Result, all: Result[]): SplitCompare[] {
  const avg = gradeAverageSplits(r, all);
  return getCourse(r.course).stations.map((s, i) => ({
    order: s.order,
    element: s.element,
    mine: r.splits[i],
    average: avg[i],
    diffPct: Math.round(((r.splits[i] - avg[i]) / avg[i]) * 100),
  }));
}

/** 같은 등급 평균과 비교해 가장 느린 구간 */
export function weakestSplit(rows: SplitCompare[]): SplitCompare {
  return [...rows].sort((a, b) => b.diffPct - a.diffPct)[0];
}

/** 체력요소별 운동처방 (시안 문구, 한국스포츠과학원 검증 전) */
export const PRESCRIPTIONS: Record<string, { what: string; how: string }> = {
  심폐지구력: { what: "빠르게 걷기·가벼운 달리기", how: "주 3~5회, 한 번에 30분. 숨이 조금 차지만 말은 할 수 있는 속도로 해요." },
  근력: { what: "악력 공·밴드 당기기", how: "주 2~3회, 10~15회씩 3세트. 쥘 때 숨을 내쉬어요." },
  근지구력: { what: "윗몸 말아 올리기·플랭크", how: "주 3회, 윗몸 말아 올리기 15회씩 3세트, 플랭크 20~30초씩 3세트로 시작해요." },
  순발력: { what: "제자리 점프·스쿼트 점프", how: "주 2회, 8~10회씩 3세트. 착지할 때 무릎을 살짝 굽혀 충격을 줄여요." },
  민첩성: { what: "사다리 스텝·왕복 달리기", how: "주 2회, 10m 왕복 5회씩 3세트. 방향 바꾸기 연습에 집중해요." },
  유연성: { what: "앉아서 앞으로 굽히기 스트레칭", how: "매일 10분, 한 동작을 20~30초씩 반동 없이 유지해요." },
  하지근기능: { what: "의자에 앉았다 일어서기", how: "주 3회, 10회씩 3세트. 의자를 벽에 붙여 두고 해요." },
  평형성: { what: "한 발 서기·벽 짚고 발끝 걷기", how: "매일 5분, 벽이나 의자를 짚을 수 있는 곳에서 해요." },
  협응력: { what: "8자 걷기·공 주고받기", how: "주 3회, 10분씩. 천천히 정확하게 하는 데 집중해요." },
};
