import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 내보내기: `npm run build` 결과가 out/ 폴더에 생성된다.
  output: "export",
  // 정적 호스팅(Netlify 등)에서 /about → /about/index.html 로 열리도록 한다.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
