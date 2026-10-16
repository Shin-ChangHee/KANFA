import Link from "next/link";

/** 텍스트 워드마크와 레인 모양 표시. 실제 공단 로고·CI 이미지는 쓰지 않는다. */
export default function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2.5 rounded-md">
      <svg aria-hidden="true" width="34" height="34" viewBox="0 0 34 34">
        <rect width="34" height="34" rx="8" fill={onDark ? "#FFFFFF" : "#1E4FA0"} />
        <rect x="6" y="9" width="22" height="16" rx="8" fill="none" stroke={onDark ? "#1E4FA0" : "#FFFFFF"} strokeWidth="2.2" />
        <rect x="10.5" y="13.5" width="13" height="7" rx="3.5" fill="none" stroke="#F2A93B" strokeWidth="2.2" />
      </svg>
      <span className={`font-num text-[1.75rem] leading-none font-bold tracking-wide ${onDark ? "text-white" : "text-ink"}`}>
        KANFA
      </span>
      <span className={`hidden border-l pl-2.5 text-[0.8rem] leading-tight font-semibold sm:inline ${onDark ? "border-white/40 text-on-track" : "border-mist text-slate"}`}>
        국민체력
        <br />
        레이스
      </span>
      <span className="sr-only"> 홈</span>
    </Link>
  );
}
