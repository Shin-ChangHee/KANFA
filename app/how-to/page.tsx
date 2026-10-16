import type { Metadata } from "next";
import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import LaneBadge from "@/components/LaneBadge";
import PageIntro from "@/components/PageIntro";
import StepFlow from "@/components/StepFlow";
import { DIVISION_ROWS, PREPARE_ITEMS, SAFETY_ITEMS } from "@/lib/content";
import { formatWon } from "@/lib/format";
import { APPLY_HREF } from "@/lib/site";

export const metadata: Metadata = { title: "참여 방법" };

const H2 = "text-[1.625rem] font-extrabold";

export default function HowToPage() {
  return (
    <>
      <PageIntro title="참여 방법" lead="측정부터 결과까지 다섯 단계로 참여해요." />

      <div className="container-page space-y-16 py-14">
        <section aria-labelledby="flow-title">
          <h2 id="flow-title" className={H2}>
            다섯 단계 참여 흐름
          </h2>
          <div className="mt-8">
            <StepFlow variant="detailed" />
          </div>
        </section>

        <section id="measure" aria-labelledby="measure-title" className="scroll-mt-24 rounded-xl border-2 border-track bg-white p-6 md:p-8">
          <h2 id="measure-title" className={H2}>
            내 등급 확인 방법
          </h2>
          <ul className="measure mt-4 list-disc space-y-2 pl-5">
            <li>국민체력100 체력인증센터에서 무료로 측정하면 1~6등급을 받아요.</li>
            <li>참가 신청할 때 [등급 불러오기] 버튼으로 최근 등급과 측정일을 확인해요.</li>
            <li>측정한 적이 없거나 측정한 지 1년이 지났다면, 대회 당일 대회장 &lsquo;측정 존&rsquo;에서 먼저 측정하고 출발조를 배정받아요.</li>
          </ul>
          <Link href="/places" className="mt-4 inline-flex min-h-11 items-center font-semibold text-track underline underline-offset-4">
            가까운 체력인증센터 찾기
          </Link>
        </section>

        <section aria-labelledby="heat-title" className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="measure">
            <h2 id="heat-title" className={H2}>
              출발조는 이렇게 나눠요
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>성별, 연령대, 국민체력100 등급이 같은 사람끼리 묶어요.</li>
              <li>한 출발조는 30명이고, 10분 간격으로 출발해요.</li>
              <li>출발조와 출발 시간은 대회 7일 전에 문자로 알려 드려요.</li>
              <li>신청할 때 오전·오후 중 희망 시간대를 고를 수 있어요. 희망 시간대는 확정이 아니에요.</li>
              <li>등급이 없는 사람은 대회 당일 측정 존에서 측정한 뒤 출발조를 배정받아요.</li>
            </ul>
          </div>
          <aside className="rounded-xl border border-mist bg-white p-5" aria-label="출발조 예시">
            <p className="text-sm font-semibold text-slate">출발조 예시</p>
            <p className="mt-2 flex items-center gap-3 text-lg font-bold">
              <LaneBadge grade={4} /> 30대 · 여성 · 4등급
            </p>
            <p className="mt-2 font-num text-3xl font-bold text-track">10:20</p>
            <p className="text-sm text-slate">30명 함께 출발</p>
          </aside>
        </section>

        <section aria-labelledby="division-title">
          <h2 id="division-title" className={H2}>
            부문
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-mist bg-white">
            <table className="w-full min-w-[34rem] text-left">
              <caption className="sr-only">부문별 참가 인원, 코스, 참가비</caption>
              <thead className="bg-lane text-sm text-slate">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    부문
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    참가 인원
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    코스
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">
                    참가비(시안)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {DIVISION_ROWS.map((d) => (
                  <tr key={d.name}>
                    <th scope="row" className="px-5 py-4 font-bold">
                      {d.name}
                    </th>
                    <td className="px-5 py-4">{d.who}</td>
                    <td className="px-5 py-4">{d.course}</td>
                    <td className="px-5 py-4 text-right font-semibold">{formatWon(d.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate">대회 7일 전까지 취소하면 전액 환불돼요. 그 이후에는 환불되지 않아요(시안 기준).</p>
        </section>

        <section aria-labelledby="award-title" className="measure">
          <h2 id="award-title" className={H2}>
            시상
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <strong>부문·등급별 순위</strong>
              <span className="text-slate"> — 같은 부문, 같은 등급 안에서 순위를 매기고 시상해요. 6등급도 6등급끼리 시상해요.</span>
            </li>
            <li>
              <strong>성장상</strong>
              <span className="text-slate"> — 직전 대회보다 기록이 가장 많이 좋아진 사람에게 줘요.</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="prepare-title">
          <h2 id="prepare-title" className={H2}>
            준비물
          </h2>
          <ul className="mt-6 flex flex-wrap gap-3">
            {PREPARE_ITEMS.map((p) => (
              <li key={p} className="rounded-full border-2 border-mist bg-white px-5 py-2 font-semibold">
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="safety-title">
          <h2 id="safety-title" className={H2}>
            안전 안내
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {SAFETY_ITEMS.map((s) => (
              <li key={s.title} className="border-t-4 border-field pt-4">
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-slate">{s.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href={APPLY_HREF}>참가 신청하기</ButtonLink>
          <ButtonLink href="/faq" variant="secondary">
            자주 묻는 질문 보기
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
