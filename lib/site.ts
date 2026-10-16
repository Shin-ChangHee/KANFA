// 메뉴·링크 정의 (계획서 3장 사이트맵, 4.1 공통 레이아웃)

export interface NavItem {
  href: string;
  label: string;
}

/** 헤더 가운데 메뉴 */
export const MAIN_NAV: NavItem[] = [
  { href: "/about", label: "KANFA 소개" },
  { href: "/course", label: "코스 안내" },
  { href: "/how-to", label: "참여 방법" },
  { href: "/events", label: "대회 일정" },
  { href: "/results", label: "기록·순위" },
  { href: "/faq", label: "자주 묻는 질문" },
];

/** 헤더 메뉴에는 없지만 바로 갈 수 있어야 하는 곳 */
export const SUB_NAV: NavItem[] = [
  { href: "/my", label: "신청 조회" },
  { href: "/places", label: "훈련 장소 찾기" },
  { href: "/notice", label: "공지사항" },
];

export const LEGAL_NAV: NavItem[] = [
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];

/** [참가 신청] 버튼이 가는 곳: 대회를 먼저 골라야 하므로 대회 일정으로 보낸다. */
export const APPLY_HREF = "/events";

export const SITE_NAME = "KANFA 국민체력 레이스";
export const SITE_DESCRIPTION =
  "국민체력100 등급으로 출발조를 나눠 비슷한 체력끼리 겨루는 국민체육진흥공단 참가형 체력 경기, KANFA.";
