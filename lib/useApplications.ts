// 신청 내역 구독 훅. 클라이언트 컴포넌트에서만 쓴다.
import { useSyncExternalStore } from "react";
import { EMPTY_APPLICATIONS, readApplications, subscribeApplications } from "./applications";
import type { Application } from "./types";

/** 신청 내역 구독. 서버(정적 HTML)에서는 빈 배열이다. */
export function useApplications(): Application[] {
  return useSyncExternalStore(subscribeApplications, readApplications, () => EMPTY_APPLICATIONS);
}

const noopSubscribe = () => () => {};
/** 브라우저에서 저장소를 읽을 수 있게 된 뒤인지 (첫 화면 깜빡임 방지용) */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
