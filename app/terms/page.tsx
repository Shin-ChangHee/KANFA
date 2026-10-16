import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";

export const metadata: Metadata = { title: "이용약관" };

export default function TermsPage() {
  return (
    <LegalDoc
      title="이용약관"
      sections={[
        { heading: "목적", body: "이 약관은 KANFA 대회 참가 신청과 이용에 필요한 사항을 정해요. (자리표시)" },
        { heading: "참가 자격", body: "대회일 기준 만 19세 이상이면 참가할 수 있어요. 만 65세 이상은 어르신 코스로 참가해요. (자리표시)" },
        { heading: "취소와 환불", body: "대회 7일 전까지 취소하면 참가비를 전액 환불해요. 그 이후에는 환불하지 않아요. (자리표시)" },
        { heading: "안전", body: "참가자는 건강 문진에 사실대로 답하고, 대회 중 안전요원과 의료진의 안내를 따라야 해요. (자리표시)" },
        { heading: "기록 공개", body: "기록·순위에는 이름의 가운데 글자를 가려 공개해요. (자리표시)" },
      ]}
    />
  );
}
