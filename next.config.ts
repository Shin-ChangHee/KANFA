import type { NextConfig } from "next";

// 미리보기 호스팅(claude.ai 아티팩트)용 빌드: KANFA_PREVIEW=1 npm run build
// 그 호스팅은 /about/ 같은 폴더 주소를 index.html로 열어 주지 않아 주소 끝 슬래시를 빼고,
// "_"로 시작하는 최상위 경로(/_next)를 쓸 수 없어 정적 파일을 /assets/_next 아래로 옮긴다.
const preview = process.env.KANFA_PREVIEW === "1";

const nextConfig: NextConfig = {
  // 정적 내보내기: `npm run build` 결과가 out/ 폴더에 생성된다.
  output: "export",
  // 정적 호스팅(Netlify 등)에서 /about → /about/index.html 로 열리도록 한다.
  trailingSlash: !preview,
  images: { unoptimized: true },
  ...(preview ? { assetPrefix: "/assets" } : {}),
};

export default nextConfig;
