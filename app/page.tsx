import ButtonLink from "@/components/ButtonLink";
import LaneBadge from "@/components/LaneBadge";
import type { Grade } from "@/lib/types";

const GRADES: Grade[] = [1, 2, 3, 4, 5, 6];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-mist bg-white">
        <div className="container-page py-14 md:py-20">
          <h1 className="text-[2.25rem] leading-tight font-extrabold md:text-[3rem]">
            내 체력 등급이 곧
            <br />
            나의 출발 레인
          </h1>
          <p className="measure mt-4 text-lg text-slate">
            국민체력100에서 받은 등급으로 출발조를 나눠, 비슷한 체력끼리 겨뤄요. 성인 코스 약 15~20분, 어르신 코스 약 10분.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/events">참가 신청하기</ButtonLink>
            <ButtonLink href="/how-to" variant="secondary">
              내 등급 확인 방법
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-3" aria-label="국민체력100 등급 1~6">
            {GRADES.map((g) => (
              <li key={g}>
                <LaneBadge grade={g} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="container-page py-10">
        <p className="measure rounded-xl border-2 border-dashed border-mist bg-white p-6 text-slate">
          홈 화면(트랙 히어로, 다가오는 대회, 참여 흐름, 코스 미리보기, 등급 레인, 자주 묻는 질문)은 Phase 2에서 채워요.
        </p>
      </div>
    </>
  );
}
