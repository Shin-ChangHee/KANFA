# KANFA 국민체력 레이스 홈페이지 (시연용 프로토타입)

국민체력100 등급으로 출발조를 나눠 비슷한 체력끼리 겨루는 KANFA를 소개하고, 참가 신청까지 해 볼 수 있는 **시안 사이트**예요.
실제 결제·본인인증·서버 저장은 하지 않고, 신청 내역은 브라우저 `localStorage`에만 저장해요.

## 실행 방법

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 파일이 out/ 폴더에 생성됨
npx serve out      # 빌드 결과 미리보기
npm run lint
```

Node.js 20 이상이 필요해요.

## 배포 (GitHub Pages)

- 주소: https://shin-changhee.github.io/KANFA/
- `claude/tender-mendel-azwsl6` 브랜치에 푸시하면 `.github/workflows/deploy.yml`이 자동으로 빌드·배포해요.
- 저장소 Settings → Pages → Source는 **GitHub Actions**로 둬야 해요.
- Pages는 사이트를 `/KANFA/` 아래에 열어서 `KANFA_BASE_PATH=/KANFA`로 빌드해요. 로컬에서 같은 결과를 보려면 `KANFA_BASE_PATH=/KANFA npm run build`.

## 진행 현황

| Phase | 내용 | 상태 |
|---|---|---|
| 1. 기반 | 프로젝트, 디자인 토큰, 글꼴, 공통 레이아웃, 목업 데이터 | 완료 |
| 2. 안내 페이지 | 홈, 소개, 코스, 참여 방법, 자주 묻는 질문 | 완료 |
| 3. 신청 흐름 | 대회 목록·상세, 7단계 신청서, 완료, 조회·취소 | 예정 |
| 4. 결과·확장 | 기록·순위, 성장상, 리포트, 훈련 장소 | 예정 |
| 5. 점검 | 접근성·반응형, 시연 시나리오, 빌드 | 예정 |

## 폴더 구조

```
app/          페이지(App Router). 동적 경로는 generateStaticParams로 미리 생성
components/   Header, Footer, DemoBanner, TextSizeToggle, MobileApplyBar, LaneBadge ...
data/         목업 JSON (events, courses, results, places, faq, notices)
lib/          types.ts, format.ts, storage.ts, clock.ts(시연 기준 날짜), site.ts(메뉴), data.ts
docs/         assumptions.md (가정 사항)
```

## 화면 목록

`/`, `/about`, `/course`, `/how-to`, `/events`, `/events/[id]`, `/apply/[eventId]`, `/apply/complete`, `/my`, `/faq`,
`/results`, `/results/[eventId]`, `/places`, `/notice`, `/privacy`, `/terms`

## 시연 시나리오

Phase 5에서 작성해요.
