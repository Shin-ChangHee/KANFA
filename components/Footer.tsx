import Link from "next/link";
import { LEGAL_NAV, MAIN_NAV, SUB_NAV } from "@/lib/site";
import Wordmark from "./Wordmark";

export default function Footer() {
  return (
    <footer className="on-dark bg-track-night text-white">
      {/* 트랙 가장자리처럼 여섯 줄 */}
      <div aria-hidden="true" className="h-3 bg-[repeating-linear-gradient(to_bottom,#1E4FA0_0_1px,transparent_1px_2px)]" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <Wordmark onDark />
          <dl className="space-y-1 text-on-track">
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold whitespace-nowrap text-white">주최</dt>
              <dd>국민체육진흥공단(시안)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="shrink-0 font-semibold whitespace-nowrap text-white">문의</dt>
              <dd>KANFA 운영사무국 000-0000-0000 · help@kanfa.example (자리표시)</dd>
            </div>
          </dl>
          <p className="measure text-sm text-on-track">
            이 사이트는 키보드만으로 모든 기능을 쓸 수 있도록 만들고 있어요. 이용하기 어려운 점이 있으면 위 문의처로 알려 주세요. 한국형 웹 콘텐츠 접근성 지침(KWCAG 2.2)을
            목표로 해요.
          </p>
        </div>

        <nav aria-label="바닥글 메뉴" className="grid grid-cols-2 gap-x-6 gap-y-1">
          {[...MAIN_NAV, ...SUB_NAV].map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center text-white hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-1 py-4 text-sm text-on-track">
          {LEGAL_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="inline-flex min-h-11 items-center font-semibold text-white hover:underline">
              {item.label}
            </Link>
          ))}
          <p>© KANFA 시안. 실제 서비스가 아니에요.</p>
        </div>
      </div>
    </footer>
  );
}
