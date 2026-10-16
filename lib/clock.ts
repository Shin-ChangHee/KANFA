/**
 * 시연 기준 날짜.
 * 목업 대회는 2027년 일정이라 실제 오늘 날짜로 계산하면 접수 상태·남은 날이 맞지 않는다.
 * 모든 '오늘' 계산은 이 값을 기준으로 한다. (docs/assumptions.md 참고)
 */
export const DEMO_TODAY = "2027-04-20T09:00:00+09:00";

export function demoNow(): Date {
  return new Date(DEMO_TODAY);
}
