import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-base font-bold transition-colors";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-track text-white hover:bg-track-deep",
  secondary: "border-2 border-track bg-white text-track hover:bg-track-soft",
  ghost: "text-ink hover:bg-mist/60",
  // 트랙 블루 배경 위에 놓는 버튼
  inverse: "bg-white text-track hover:bg-lane",
};

export function buttonClass(variant: Variant = "primary", extra = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`.trim();
}

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export default function ButtonLink({ variant = "primary", className = "", ...rest }: Props) {
  return <Link className={buttonClass(variant, className)} {...rest} />;
}
