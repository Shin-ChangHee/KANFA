import ButtonLink from "@/components/ButtonLink";
import PageIntro from "@/components/PageIntro";

export default function NotFound() {
  return (
    <>
      <PageIntro title="페이지를 찾을 수 없어요" lead="주소가 바뀌었거나 없는 페이지예요. 홈에서 다시 찾아 주세요." />
      <div className="container-page py-10">
        <ButtonLink href="/">홈으로 가기</ButtonLink>
      </div>
    </>
  );
}
