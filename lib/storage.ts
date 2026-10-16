// localStorage 접근. 개인 브라우저 저장이라 실패할 수 있어 모두 try/catch로 감싼다.

export const STORAGE_KEYS = {
  applications: "kanfa.applications",
  textSize: "kanfa.textSize",
} as const;

export type TextSize = "normal" | "large";

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장 공간이 막힌 환경(사생활 보호 모드 등)에서는 조용히 넘어간다.
  }
}

export function readTextSize(): TextSize {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.textSize) === "large" ? "large" : "normal";
  } catch {
    return "normal";
  }
}

export function writeTextSize(size: TextSize): void {
  try {
    window.localStorage.setItem(STORAGE_KEYS.textSize, size);
  } catch {
    // 무시
  }
}

/**
 * 첫 화면이 그려지기 전에 글자 크기를 적용하는 인라인 스크립트.
 * 이 스크립트가 없으면 큰 글자 사용자가 매번 작은 글자 → 큰 글자로 깜빡이는 화면을 본다.
 */
export const TEXT_SIZE_BOOT_SCRIPT = `try{if(localStorage.getItem("${STORAGE_KEYS.textSize}")==="large"){document.documentElement.dataset.textSize="large"}}catch(e){}`;
