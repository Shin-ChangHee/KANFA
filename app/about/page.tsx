import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import CycleDiagram from "@/components/CycleDiagram";
import PageIntro from "@/components/PageIntro";
import { CYCLE, PRINCIPLES } from "@/lib/content";
import { APPLY_HREF } from "@/lib/site";

export const metadata: Metadata = { title: "KANFA 소개" };

export default function AboutPage() {
  return (
    <>
      <PageIntro
        title="KANFA 소개"
        lead="KANFA는 국민체력100 측정항목으로 겨루는 국민체육진흥공단 주관 참가형 체력 경기이자 시즌 리그예요."
      />

      <div className="container-page space-y-20 py-14">
        <section aria-labelledby="what-title" className="measure">
          <h2 id="what-title" className="section-title">
            KANFA란?
          </h2>
          <p className="mt-4">
            KANFA는 국민체력100 측정항목으로 겨루는 국민체육진흥공단 주관 참가형 체력 경기이자 시즌 리그예요. 체력인증센터에서 무료로 측정해 받은 1~6등급으로 출발조를
            나누고, 같은 등급끼리 같은 출발조에서 달려요.
          </p>
          <p className="mt-3">
            레이스가 끝나면 체력 분석 리포트와 운동처방을 받아요. 운동한 뒤 다시 측정해 등급이 오르면, 다음 대회에서는 한 단계 위 출발조로 올라가요.
          </p>
        </section>

        <section aria-labelledby="name-title" className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 id="name-title" className="section-title">
              이름의 뜻
            </h2>
            <p className="measure mt-4">
              KANFA는{" "}
              <span lang="en" className="font-semibold">
                KSPO Arena for National Fitness Award
              </span>
              의 줄임말이에요.
            </p>
            <p className="measure mt-3">
              국민체력100에 &lsquo;겨루는 무대&rsquo;를 더한다는 뜻이에요. 체력을 재고 등급을 받는 데서 그치지 않고, 같은 등급의 사람들과 함께 달리며 내 체력을 확인하는
              자리예요.
            </p>
          </div>
          <dl className="rounded-xl border border-mist bg-white p-6">
            {[
              ["K", "KSPO", "국민체육진흥공단"],
              ["A", "Arena", "겨루는 무대"],
              ["N", "for National", "모든 국민을 위한"],
              ["F", "Fitness", "체력"],
              ["A", "Award", "인증과 시상"],
            ].map(([letter, en, ko], i) => (
              <div key={i} className="flex items-baseline gap-4 border-b border-mist py-2 last:border-b-0">
                <dt className="w-8 font-num text-3xl font-bold text-track">{letter}</dt>
                <dd>
                  <span lang="en" className="font-semibold">
                    {en}
                  </span>
                  <span className="ml-2 text-slate">{ko}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="cycle-title" className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="cycle-title" className="section-title">
              측정에서 재도전까지 이어지는 순환
            </h2>
            <p className="measure mt-4 text-slate">한 번 나가고 끝나는 대회가 아니에요. 측정하고, 겨루고, 운동하고, 다시 측정하는 흐름이 계속 이어져요.</p>
            <ol className="mt-6 space-y-3">
              {CYCLE.map((c, i) => (
                <li key={c.title} className="flex gap-4">
                  <span className="font-num text-2xl leading-tight font-bold text-track">{i + 1}</span>
                  <p>
                    <strong>{c.title}</strong> <span className="text-slate">{c.body}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <CycleDiagram />
        </section>

        <section aria-labelledby="principles-title">
          <h2 id="principles-title" className="section-title">
            세 가지 원칙
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <li key={p.title} className="border-t-4 border-track pt-4">
                <h3 className="text-xl font-bold">{p.title}</h3>
                <p className="mt-2 text-slate">{p.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="history-title" className="measure">
          <h2 id="history-title" className="section-title">
            체력왕 선발대회에서 이어진 이야기
          </h2>
          <p className="mt-4">
            국민체육진흥공단은 국민체력100 측정 결과가 뛰어난 사람을 뽑는 &lsquo;체력왕 선발대회&rsquo;를 운영해 왔어요. 체력이 좋은 몇 사람만 주인공이 되는 자리였죠.
          </p>
          <p className="mt-3">
            KANFA는 이 대회를 누구나 참가할 수 있는 상설 레이스와 시즌 리그로 넓힌 거예요. 등급별로 출발하고 시상하기 때문에, 1등급이든 6등급이든 내 자리에서 겨루고
            성장을 확인할 수 있어요.
          </p>
        </section>

        <section aria-labelledby="relation-title">
          <h2 id="relation-title" className="section-title">
            국민체력100과의 관계
          </h2>
          <dl className="mt-6 divide-y divide-mist rounded-xl border border-mist bg-white">
            {[
              ["등급 측정", "지금처럼 무료예요. 가까운 체력인증센터에서 측정하고 등급을 받아요."],
              ["레이스 참가", "참가비가 있어요. 부문에 따라 30,000원~180,000원이에요(시안 금액)."],
              ["레이스 기록과 등급", "레이스 기록이 국민체력100 등급을 바꾸지는 않아요. 등급은 체력인증센터 측정으로만 정해져요."],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="font-bold">{k}</dt>
                <dd className="text-slate">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href={APPLY_HREF}>참가 신청하기</ButtonLink>
          <ButtonLink href="/course" variant="secondary">
            코스 보기
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
