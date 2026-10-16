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

export default function HomePage() {
  const homeFaqs = HOME_FAQ_IDS.map((id) => faqs.find((f) => f.id === id)!);

  return (
    <>
      {/* 1. 히어로 */}
      <section aria-labelledby="hero-title" className="border-b border-mist bg-white">
        <div className="container-page grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-semibold text-track">국민체력100 참가형 체력 경기</p>
            <h1 id="hero-title" className="mt-2 text-[2.25rem] leading-tight font-extrabold md:text-[3rem]">
              내 체력 등급이 곧
              <br />
              나의 출발 레인
            </h1>
            <p className="measure mt-5 text-lg">
              국민체력100에서 받은 등급으로 출발조를 나눠, 비슷한 체력끼리 겨뤄요. 성인 코스 약 15~20분, 어르신 코스 약 10분.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={APPLY_HREF}>참가 신청하기</ButtonLink>
              <ButtonLink href="/how-to#measure" variant="secondary">
                내 등급 확인 방법
              </ButtonLink>
            </div>
          </div>
          <TrackHero />
        </div>
      </section>

      {/* 2. 다가오는 대회 */}
      <section aria-labelledby="events-title" className="container-page py-16">
        <SectionHeading id="events-title" title="다가오는 대회" />
        <UpcomingEvents />
      </section>

      {/* 3. 이렇게 참여해요 */}
      <section aria-labelledby="steps-title" className="border-y border-mist bg-white">
        <div className="container-page py-16">
          <SectionHeading id="steps-title" title="이렇게 참여해요" lead="측정부터 재도전까지, 다섯 단계면 돼요." />
          <StepFlow />
          <ButtonLink href="/how-to" variant="secondary" className="mt-8">
            참여 방법 자세히
          </ButtonLink>
        </div>
      </section>

      {/* 4. 코스 미리보기 */}
      <section aria-labelledby="course-title" className="container-page py-16">
        <SectionHeading id="course-title" title="코스 미리보기" lead="국민체력100에서 해 본 측정 동작 6개를 차례로 돌아요." />
        <CoursePreview courses={courses} />
      </section>

      {/* 5. 같은 등급끼리 출발해요 */}
      <section aria-labelledby="lanes-title" className="border-y border-mist bg-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 id="lanes-title" className="text-[1.625rem] font-extrabold md:text-[2rem]">
              같은 등급끼리 출발해요
            </h2>
            <p className="measure mt-4">
              국민체력100 1~6등급이 그대로 출발 레인이 돼요. 체력이 비슷한 사람끼리 30명씩 한 출발조로 묶여 함께 달려요.
            </p>
            <p className="measure mt-6 rounded-xl bg-amber-soft px-5 py-4 text-xl font-extrabold">6등급도 같은 6등급끼리 겨뤄요.</p>
            <p className="measure mt-3 text-slate">등급별로 따로 순위를 매기고 시상해요. 처음 도전하는 사람도 부담 없이 나올 수 있어요.</p>
          </div>
          <GradeLanes />
        </div>
      </section>

      {/* 6. 자주 묻는 질문 */}
      <section aria-labelledby="faq-title" className="container-page py-16">
        <SectionHeading id="faq-title" title="자주 묻는 질문">
          <ButtonLink href="/faq" variant="secondary">
            전체 보기
          </ButtonLink>
        </SectionHeading>
        <FaqList items={homeFaqs} />
      </section>

      {/* 7. 마무리 */}
      <section aria-labelledby="cta-title" className="on-dark bg-track text-white">
        <div className="container-page flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <h2 id="cta-title" className="measure text-[1.5rem] leading-snug font-extrabold md:text-[1.75rem]">
            가까운 체력인증센터에서 무료로 측정하고 첫 레이스에 도전하세요
          </h2>
          <ButtonLink href={APPLY_HREF} variant="inverse" className="shrink-0">
            참가 신청하기
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
