// Pretendard 동적 서브셋 CSS에서 이 사이트 글자에 필요한 @font-face만 남긴다.
// 원본 92개 → 약 20개로 줄여 첫 화면을 막는 CSS 크기를 줄인다(모바일 성능 점수 대응).
// 사이트에 없는 글자(예: 사용자가 입력한 드문 이름)는 시스템 글꼴로 보인다.
// `npm run dev`·`npm run build` 전에 자동으로 실행된다.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "node_modules/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
const OUT = "app/fonts.generated.css";
const FONT_DIR = "../node_modules/pretendard/dist/web/variable/woff2-dynamic-subset/";

let text = "";
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(f)) text += readFileSync(p, "utf8");
  }
};
["app", "components", "lib", "data"].forEach(walk);
// 기본 라틴 문자·숫자·문장부호는 항상 포함한다.
for (let c = 0x20; c < 0x7f; c++) text += String.fromCharCode(c);
const used = new Set([...text].map((c) => c.codePointAt(0)));

const css = readFileSync(SRC, "utf8");
const faces = [...css.matchAll(/@font-face\s*{[^}]*}/g)].map((m) => m[0]);
const parse = (r) =>
  r.split(",").map((x) => {
    const [a, b] = x.trim().replace(/^U\+/i, "").split("-");
    return [parseInt(a, 16), parseInt(b ?? a, 16)];
  });
const kept = faces.filter((f) => {
  const ranges = parse(/unicode-range:\s*([^;]+);/.exec(f)[1]);
  for (const c of used) if (ranges.some(([a, b]) => c >= a && c <= b)) return true;
  return false;
});

const out =
  "/* 자동 생성 파일: scripts/build-font-css.mjs. 직접 고치지 마세요. Pretendard (SIL OFL 1.1) */\n" +
  kept.map((f) => f.replace(/url\(\.\/woff2-dynamic-subset\//g, `url(${FONT_DIR}`)).join("\n") +
  "\n";
writeFileSync(OUT, out);
console.log(`Pretendard @font-face ${kept.length}/${faces.length}개 → ${OUT}`);
