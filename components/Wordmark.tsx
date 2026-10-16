import Link from "next/link";

/** 텍스트 워드마크. 실제 공단 로고·CI 이미지는 쓰지 않는다. */
export default function Wordmark() {
  return (
    <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-md" aria-label="KANFA 국민체력 레이스 홈">
      <span aria-hidden="true" className="font-num text-[1.75rem] leading-none font-bold tracking-wide text-track">
        KANFA
      </span>
      <span aria-hidden="true" className="hidden border-l border-mist pl-2 text-sm leading-tight font-semibold text-slate sm:inline">
        국민체력
        <br />
        레이스
      </span>
    </Link>
  );
}
