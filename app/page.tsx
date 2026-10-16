import ButtonLink from "@/components/ButtonLink";
import CoursePreview from "@/components/CoursePreview";
import FaqList from "@/components/FaqList";
import GradeLanes from "@/components/GradeLanes";
import SectionHeading from "@/components/SectionHeading";
import StepFlow from "@/components/StepFlow";
import TrackHero from "@/components/TrackHero";
import UpcomingEvents from "@/components/UpcomingEvents";
import { courses, faqs } from "@/lib/data";
import { APPLY_HREF } from "@/lib/site";

const HOME_FAQ_IDS = ["no-grade", "weak", "grade-change"];

// 히어로 아래 전광판 줄: 숫자는 모두 계획서 1장의 실제 값
const FACTS = [
  { value: "1–6", unit: "레인", label: "국민체력100 등급이 곧 출발 레인" },
  { value: "6", unit: "구간", label: "국민체력100 공식 측정 동작" },
  { value: "30", unit: "명", label: "한 출발조, 10분 간격 출발" },
  { value: "15–20", unit: "분", label: "성인 코스 · 어르신 코스는 약 10분" },
];

export default function HomePage() {
  const homeFaqs = HOME_FAQ_IDS.map((id) => faqs.find((f) => f.id === id)!);

  return (
    <>
      {/* 1. 히어로 */}
      <section aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-track text-white">
        <div aria-hidden="true" className="lanes absolute inset-0" />
        <div className="container-page relative grid items-center gap-10 pt-12 pb-10 md:pt-16 lg:grid-cols-[1fr_1.15fr] lg:gap-14 lg:pt-20 lg:pb-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 font-semibold text-on-track ring-1 ring-white/25">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-amber" />
              국민체육진흥공단 참가형 체력 경기 · 시즌 1
            </p>
            <h1 id="hero-title" className="mt-5 text-[2.5rem] leading-[1.15] font-extrabold tracking-[-0.03em] md:text-[3.5rem] lg:text-[4rem]">
              내 체력 등급이 곧
              <br />
              나의 출발 레인
            </h1>
            <p className="measure mt-6 text-lg text-on-track md:text-xl">
              국민체력100에서 받은 등급으로 출발조를 나눠, 비슷한 체력끼리 겨뤄요. 성인 코스 약 15~20분, 어르신 코스 약 10분.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={APPLY_HREF} variant="inverse" className="px-7 text-lg">
                참가 신청하기
              </ButtonLink>
              <ButtonLink href="/how-to#measure" variant="outlineInverse" className="px-7 text-lg">
                내 등급 확인 방법
              </ButtonLink>
            </div>
          </div>
          <TrackHero />
        </div>

        <div className="relative border-t border-white/20 bg-track-night/55">
          <dl className="container-page grid grid-cols-2 gap-x-6 gap-y-5 py-6 md:grid-cols-4">
            {FACTS.map((f) => (
              <div key={f.label} className="flex flex-col-reverse justify-end gap-1">
                <dt className="text-sm text-on-track">{f.label}</dt>
                <dd className="font-num leading-none font-bold">
                  <span className="text-[2.25rem] md:text-[2.75rem]">{f.value}</span>
                  <span className="ml-1 font-sans text-base font-bold">{f.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 2. 다가오는 대회 */}
      <section aria-labelledby="events-title" className="container-page py-20">
        <SectionHeading id="events-title" title="다가오는 대회" lead="가장 가까운 대회부터 보여 드려요." />
        <UpcomingEvents />
      </section>

      {/* 3. 이렇게 참여해요 */}
      <section aria-labelledby="steps-title" className="bg-white">
        <div className="container-page py-20">
          <SectionHeading id="steps-title" title="이렇게 참여해요" lead="측정부터 재도전까지, 다섯 단계면 돼요.">
            <ButtonLink href="/how-to" variant="secondary">
              참여 방법 자세히
            </ButtonLink>
          </SectionHeading>
          <StepFlow />
        </div>
      </section>

      {/* 4. 코스 미리보기 */}
      <section aria-labelledby="course-title" className="container-page py-20">
        <SectionHeading id="course-title" title="코스 미리보기" lead="국민체력100에서 해 본 측정 동작 6개를 차례로 돌아요." />
        <CoursePreview courses={courses} />
      </section>

      {/* 5. 같은 등급끼리 출발해요 */}
      <section aria-labelledby="lanes-title" className="bg-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[1fr_1.25fr] lg:items-center">
          <div>
            <span aria-hidden="true" className="lane-mark mb-4" />
            <h2 id="lanes-title" className="text-[1.875rem] font-extrabold md:text-[2.375rem]">
              같은 등급끼리 출발해요
            </h2>
            <p className="measure mt-4 text-lg">
              국민체력100 1~6등급이 그대로 출발 레인이 돼요. 체력이 비슷한 사람끼리 30명씩 한 출발조로 묶여 함께 달려요.
            </p>
            <p className="mt-8 border-l-4 border-amber pl-5 text-[1.5rem] leading-snug font-extrabold md:text-[1.75rem]">6등급도 같은 6등급끼리 겨뤄요.</p>
            <p className="measure mt-3 pl-6 text-slate">등급별로 따로 순위를 매기고 시상해요. 처음 도전하는 사람도 부담 없이 나올 수 있어요.</p>
          </div>
          <GradeLanes />
        </div>
      </section>

      {/* 6. 자주 묻는 질문 */}
      <section aria-labelledby="faq-title" className="container-page py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <SectionHeading id="faq-title" title="자주 묻는 질문" lead="처음 도전하는 분들이 가장 많이 물어요.">
            <ButtonLink href="/faq" variant="secondary">
              질문 전체 보기
            </ButtonLink>
          </SectionHeading>
          <FaqList items={homeFaqs} />
        </div>
      </section>

      {/* 7. 마무리 */}
      <section aria-labelledby="cta-title" className="on-dark relative overflow-hidden bg-track text-white">
        <div aria-hidden="true" className="lanes absolute inset-0" />
        <div aria-hidden="true" className="absolute inset-y-0 left-[8%] w-1.5 bg-white/30" />
        <div className="container-page relative flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <h2 id="cta-title" className="max-w-2xl text-[1.75rem] leading-snug font-extrabold md:text-[2.25rem]">
            가까운 체력인증센터에서 무료로 측정하고 첫 레이스에 도전하세요
          </h2>
          <div className="flex shrink-0 flex-wrap gap-3">
            <ButtonLink href={APPLY_HREF} variant="inverse" className="px-7 text-lg">
              참가 신청하기
            </ButtonLink>
            <ButtonLink href="/places" variant="outlineInverse" className="px-7 text-lg">
              체력인증센터 찾기
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
