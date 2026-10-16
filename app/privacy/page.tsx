import type { Metadata } from "next";
import LegalDoc from "@/components/LegalDoc";

export const metadata: Metadata = { title: "개인정보처리방침" };

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="개인정보처리방침"
      sections={[
        { heading: "수집하는 개인정보", body: "이름, 생년월일, 성별, 휴대폰 번호, 이메일(선택), 비상연락처, 기념품 사이즈, 국민체력100 등급과 측정일, 건강 문진 답변을 수집해요. (자리표시)" },
        { heading: "이용 목적", body: "대회 접수와 본인 확인, 출발조 배정, 안내 문자 발송, 기록과 체력 분석 리포트 제공, 안전 관리에 이용해요. (자리표시)" },
        { heading: "보관 기간", body: "대회 종료 후 1년 동안 보관하고 파기해요. 건강 문진 답변은 대회 종료 후 바로 파기해요. (자리표시)" },
        { heading: "제3자 제공", body: "법령에 따른 경우를 빼고는 동의 없이 다른 곳에 제공하지 않아요. (자리표시)" },
        { heading: "이용자의 권리", body: "언제든 내 개인정보를 열람하고 고치거나 삭제를 요청할 수 있어요. 운영사무국으로 연락해 주세요. (자리표시)" },
      ]}
    />
  );
}
