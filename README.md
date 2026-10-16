# KANFA 국민체력 레이스 홈페이지 (시연용 프로토타입)

국민체력100 등급으로 출발조를 나눠 비슷한 체력끼리 겨루는 KANFA를 소개하고, 참가 신청부터 기록 확인까지 해 볼 수 있는 **시안 사이트**예요.
실제 결제·본인인증·서버 저장은 하지 않고, 신청 내역은 브라우저 `localStorage`(`kanfa.applications`)에만 저장해요.

- 배포 주소: https://shin-changhee.github.io/KANFA/
- 시연 기준일: **2027년 4월 20일(화)** (`lib/clock.ts`). 모든 '오늘' 계산은 이 날짜로 해요.

## 실행 방법

Node.js 20 이상이 필요해요.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 정적 파일이 out/ 폴더에 생성됨
npx serve out      # 빌드 결과 미리보기
npm run lint
```

`npm run dev`·`npm run build` 전에 `scripts/build-font-css.mjs`가 사이트에 쓰인 글자에 필요한 Pretendard 글꼴 조각만 골라 `app/fonts.generated.css`를 만들어요.

## 배포 (GitHub Pages)

- `claude/tender-mendel-azwsl6` 브랜치에 푸시하면 `.github/workflows/nextjs.yml`이 자동으로 빌드·배포해요.
- 저장소 Settings → Pages → Source는 **GitHub Actions**로 둬야 해요.
- Pages는 사이트를 `/KANFA/` 아래에 열어서 `KANFA_BASE_PATH=/KANFA`로 빌드해요.

## 화면 목록

| 메뉴 | 경로 |
|---|---|
| 홈 | `/` |
| KANFA 소개 | `/about` |
| 코스 안내 | `/course`, `/course?tab=senior` |
| 참여 방법 | `/how-to` |
| 대회 일정·상세 | `/events`, `/events/season1-opening`, `/events/season1-round2`, `/events/pilot` |
| 참가 신청·완료 | `/apply/season1-opening`, `/apply/complete?id=…` |
| 신청 조회 | `/my` |
| 기록·순위 | `/results`, `/results/pilot` |
| 훈련 장소 찾기 | `/places` |
| 자주 묻는 질문 | `/faq` |
| 공지사항 | `/notice`, `/notice/n1` 등 |
| 개인정보처리방침·이용약관 | `/privacy`, `/terms` |

## 시연 시나리오

### 1. 4등급 직장인이 개막전에 개인 성인 부문으로 신청 → 완료 → 조회 → 취소
1. 홈 → [참가 신청하기] → **KANFA 시즌 1 개막전** → [참가 신청하기]
2. 부문: **개인**
3. 참가자 정보: 이름 아무거나, 생년월일 `19920815`, 성별, 휴대폰 `01012345673`, 비상연락처 `01099998888`, 사이즈 → "만 34세 · 성인 코스" 확인 체크
4. [등급 불러오기(시연)] → **4등급**
5. 건강 문진 5개 '아니오', 안전 수칙 체크 → 출발 시간대 → [아래 내용에 모두 동의해요] → **50,000원** [결제하기(시연)]
6. 완료 화면에서 접수번호(예: `KANFA-2027-0001`), 입장용 QR 자리, [대회 일정 캘린더에 추가](.ics) 확인
7. [신청 조회하기] → 휴대폰 뒤 4자리 `5673` → "대회 7일 전(5월 8일) 배정 예정" → [신청 취소하기] → [취소 확정하기]

### 2. 검증 규칙 보기
- 휴대폰을 `011…`로 입력 → "010으로 시작하는 11자리" 오류
- 생년월일 `20100101` → "만 19세 이상만 신청할 수 있어요. … 만 17세예요"
- 같은 번호로 다시 신청 → 기존 접수번호를 알려 주며 막음
- 건강 문진에 '예' → "참가 전에 의사와 상담해 주세요" 안내와 확인 체크

### 3. 자녀가 대신 신청하는 등급 없는 어르신
- 생년월일 `19580312`, 휴대폰 끝자리 `7`(예: `01055556667`) → 어르신 코스·30,000원, "측정 이력이 없어요" → **대회장 측정 존에서 측정하기**
- 상단 [글자 크게]로 본문 20px 확인

### 4. 기업 복지 담당자의 4인 릴레이
- 부문 **4인 릴레이** → 팀 이름과 팀원 4명 입력. 팀원끼리 같은 번호는 막아요. 끝자리 `8`·`9`는 측정 1년 경과로 나와요.

### 5. 지난 대회 참가자의 기록·리포트
- 신청 조회 → 접수번호 `KANFA-2027-0901`, 뒤 4자리 `0901` → 최종 기록 18:14, 같은 출발조 6명 중 2위, 구간별 같은 등급 평균 비교 그래프, 운동처방(근지구력) → [가까운 체력증진교실 찾기] / [다음 대회 신청하기]
- 어르신 예시: `KANFA-2027-0902` / `0902`
- 기록·순위 → KANFA 시범 대회 → 성별·연령대·등급 필터, [성장상] 탭

**등급 조회 목업**: 휴대폰 끝자리 0~5 → 1~6등급, 6~7 → 측정 이력 없음, 8~9 → 측정 1년 경과.

## 품질 점검 결과 (Phase 5)

| 항목 | 결과 |
|---|---|
| axe-core 자동 검사(WCAG 2.2 AA + 모범 사례) | 전 페이지·신청서 오류 상태·리포트·모바일 메뉴에서 위반 0건 |
| Lighthouse 접근성(모바일) | 검사한 15개 페이지 모두 100점 |
| Lighthouse 성능(모바일, 로컬 3회 중앙값) | 86~99점. 같은 페이지도 실행마다 ±10점 흔들려, 배포 주소에서 PageSpeed Insights로 다시 확인 권장 |
| 키보드 | 본문 바로가기, 모든 포커스 표시, 라디오·탭 화살표 이동, 단계 이동 시 제목으로 초점, 모바일 메뉴 Enter/Esc |
| 반응형 | 360px·큰 글씨(20px)에서 모든 페이지 가로 넘침 없음, 버튼 터치 영역 44px 이상 |
| 기능 테스트(Playwright) | 신청 흐름·검증 규칙 49개, 기록·리포트·장소 29개 항목 통과 |

## 폴더 구조

```
app/          페이지(App Router). 동적 경로는 generateStaticParams로 미리 생성
components/   Header, Footer, DemoBanner, TrackHero, LaneBadge, apply/(신청서), my/(조회·리포트), results/, places/ …
data/         목업 JSON (events, courses, results, places, faq, notices, demoApplications)
lib/          types, format, age, gradeLookup, ics, applications(저장소), event, results, clock, site, data
scripts/      build-font-css.mjs (글꼴 CSS 줄이기)
docs/         assumptions.md (가정 사항)
```
