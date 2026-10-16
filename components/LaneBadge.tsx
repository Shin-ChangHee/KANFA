import type { Grade } from "@/lib/types";

const SIZES = {
  sm: "h-8 min-w-8 text-xl",
  md: "h-11 min-w-11 text-[1.75rem]",
  lg: "h-16 min-w-16 text-[2.75rem]",
};

/**
 * 국민체력100 등급을 트랙 레인 번호판 모양으로 보여주는 배지.
 * 등급 표시는 사이트 전체에서 이 배지 하나로 통일한다.
 */
export default function LaneBadge({
  grade,
  size = "md",
  label = true,
}: {
  grade: Grade;
  size?: keyof typeof SIZES;
  /** 스크린 리더용 '○등급' 문구를 붙일지 */
  label?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-md border-2 border-white bg-track px-1.5 font-num leading-none font-bold text-white shadow-[0_0_0_2px_var(--color-track)] ${SIZES[size]}`}
    >
      <span aria-hidden={label ? "true" : undefined}>{grade}</span>
      {label && <span className="sr-only">{grade}등급</span>}
    </span>
  );
}
