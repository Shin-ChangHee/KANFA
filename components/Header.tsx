"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { APPLY_HREF, MAIN_NAV, SUB_NAV } from "@/lib/site";
import { buttonClass } from "./ButtonLink";
import TextSizeToggle from "./TextSizeToggle";
import Wordmark from "./Wordmark";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const menuId = useId();
  // 메뉴를 연 주소를 기억해 두고, 주소가 바뀌면 자동으로 닫힌 것으로 본다.
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const open = openedAt === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenedAt(null);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="주 메뉴" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {MAIN_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-md px-3 font-semibold transition-colors ${
                      active ? "text-track underline decoration-2 underline-offset-8" : "text-ink hover:bg-lane"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <TextSizeToggle />
          <Link href={APPLY_HREF} className={buttonClass("primary")}>
            참가 신청
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border-2 border-mist bg-white px-3 font-semibold xl:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpenedAt(open ? null : pathname)}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
          {open ? "닫기" : "메뉴"}
        </button>
      </div>

      <div id={menuId} hidden={!open} className="border-t border-mist bg-white xl:hidden">
        <nav aria-label="모바일 메뉴" className="container-page py-3">
          <ul className="divide-y divide-mist">
            {[...MAIN_NAV, ...SUB_NAV].map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpenedAt(null)}
                    className={`flex min-h-12 items-center text-lg font-semibold ${active ? "text-track" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 pb-1">
            <TextSizeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
