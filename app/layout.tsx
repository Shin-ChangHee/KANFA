import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "@fontsource/barlow-condensed/latin-600.css";
import "@fontsource/barlow-condensed/latin-700.css";
import "./globals.css";
import DemoBanner from "@/components/DemoBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MobileApplyBar from "@/components/MobileApplyBar";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { TEXT_SIZE_BOOT_SCRIPT } from "@/lib/storage";

export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: "#1E4FA0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* 글자 크게 설정을 첫 화면 전에 적용한다 */}
        <script dangerouslySetInnerHTML={{ __html: TEXT_SIZE_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col pb-20 antialiased xl:pb-0">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:rounded-lg"
        >
          본문 바로가기
        </a>
        <DemoBanner />
        <Header />
        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>
        <Footer />
        <MobileApplyBar />
      </body>
    </html>
  );
}
