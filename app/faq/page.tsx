import type { Metadata } from "next";
import ButtonLink from "@/components/ButtonLink";
import FaqList from "@/components/FaqList";
import PageIntro from "@/components/PageIntro";
import { faqs } from "@/lib/data";

export const metadata: Metadata = { title: "자주 묻는 질문" };

export default function FaqPage() {
  return (
    <>
      <PageIntro title="자주 묻는 질문" lead="참가 전에 많이 묻는 질문을 모았어요. 질문을 누르면 답이 펼쳐져요." />
      <div className="container-page py-10">
        <FaqList items={faqs} />
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <p className="w-full text-slate">찾는 답이 없나요? 바닥글의 문의처로 연락해 주세요.</p>
          <ButtonLink href="/how-to" variant="secondary">
            참여 방법 보기
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
