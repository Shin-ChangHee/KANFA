"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APPLY_HREF } from "@/lib/site";
import { buttonClass } from "./ButtonLink";

/** 모바일에서 화면 하단에 고정되는 [참가 신청] 버튼. 신청서 작성 중에는 숨긴다. */
export default function MobileApplyBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/apply")) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-mist bg-white/95 px-4 py-3 backdrop-blur xl:hidden">
      <Link href={APPLY_HREF} className={buttonClass("primary", "w-full")}>
        참가 신청
      </Link>
    </div>
  );
}
