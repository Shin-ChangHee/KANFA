// 참가 신청서 값·검증 규칙 (계획서 4.7)
import { z } from "zod";
import { ageOn, courseForAge, MIN_AGE, parseBirth } from "@/lib/age";
import { findByPhone } from "@/lib/applications";
import { seatsLeft } from "@/lib/event";
import { formatDate } from "@/lib/format";
import type { Application, CourseType, DivisionType, KanfaEvent } from "@/lib/types";

export type GradeStatus = "idle" | "found" | "none" | "expired";

export interface ParticipantForm {
  name: string;
  birth: string;
  gender: "" | "M" | "F";
  phone: string;
  email: string;
  emergencyPhone: string;
  shirtSize: string;
  gradeStatus: GradeStatus;
  grade: number | null;
  gradeMeasuredAt: string;
  /** 등급을 불러온 번호. 그 뒤 번호를 바꾸면 다시 불러와야 한다. */
  lookedUpPhone: string;
  onsiteMeasure: boolean;
}

export const HEALTH_QUESTIONS = [
  { key: "q1", text: "최근 의사에게 운동 제한을 들은 적이 있다." },
  { key: "q2", text: "운동 중 가슴 통증을 느낀 적이 있다." },
  { key: "q3", text: "최근 어지러움으로 쓰러진 적이 있다." },
  { key: "q4", text: "뼈·관절 문제로 치료 중이다." },
  { key: "q5", text: "혈압·심장 관련 약을 먹고 있다." },
] as const;
export type HealthKey = (typeof HEALTH_QUESTIONS)[number]["key"];

export const CONSENTS = [
  {
    key: "privacy",
    label: "개인정보 수집·이용 동의",
    required: true,
    body: "수집 항목: 이름, 생년월일, 성별, 휴대폰 번호, 이메일, 비상연락처, 기념품 사이즈. 이용 목적: 대회 접수, 출발조 배정, 안내 문자 발송, 기록 제공. 보관 기간: 대회 종료 후 1년. (시안용 자리표시 문구)",
  },
  {
    key: "sensitive",
    label: "민감정보(건강 문진) 처리 동의",
    required: true,
    body: "건강 문진 답변은 참가자 안전 관리와 의료진 대응에만 쓰고, 대회 종료 후 바로 파기해요. (시안용 자리표시 문구)",
  },
  {
    key: "gradeLookup",
    label: "국민체력100 등급 정보 조회 동의",
    required: true,
    body: "출발조 배정을 위해 국민체력100에서 최근 측정 등급과 측정일을 조회해요. 다른 측정 기록은 조회하지 않아요. (시안용 자리표시 문구)",
  },
  {
    key: "safety",
    label: "안전 서약",
    required: true,
    body: "건강 문진에 사실대로 답했고, 대회 중 안전요원과 의료진의 안내를 따르며, 몸에 이상을 느끼면 바로 멈추겠습니다. (시안용 자리표시 문구)",
  },
  {
    key: "marketing",
    label: "대회 소식 받기",
    required: false,
    body: "다음 대회 일정과 접수 소식을 문자와 이메일로 받아요. 동의하지 않아도 신청할 수 있어요. (시안용 자리표시 문구)",
  },
] as const;
export type ConsentKey = (typeof CONSENTS)[number]["key"];

export const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL"];

export interface ApplyForm {
  division: "" | DivisionType;
  teamName: string;
  participants: ParticipantForm[];
  courseConfirmed: boolean;
  health: Record<HealthKey, "" | "yes" | "no">;
  doctorAck: boolean;
  safetyPledge: boolean;
  preferredSlot: "" | "am" | "pm";
  consents: Record<ConsentKey, boolean>;
}

export const TEAM_SIZE: Record<DivisionType, number> = { solo: 1, pair: 2, relay4: 4 };

export const DIVISION_LABEL: Record<DivisionType, string> = {
  solo: "개인",
  pair: "2인(가족·동료)",
  relay4: "4인 릴레이(기업·동호회)",
};

export function emptyParticipant(): ParticipantForm {
  return {
    name: "",
    birth: "",
    gender: "",
    phone: "",
    email: "",
    emergencyPhone: "",
    shirtSize: "",
    gradeStatus: "idle",
    grade: null,
    gradeMeasuredAt: "",
    lookedUpPhone: "",
    onsiteMeasure: false,
  };
}

export function defaultValues(): ApplyForm {
  return {
    division: "",
    teamName: "",
    participants: [emptyParticipant()],
    courseConfirmed: false,
    health: { q1: "", q2: "", q3: "", q4: "", q5: "" },
    doctorAck: false,
    safetyPledge: false,
    preferredSlot: "",
    consents: { privacy: false, sensitive: false, gradeLookup: false, safety: false, marketing: false },
  };
}

export const digits = (s: string) => s.replace(/\D/g, "");
export const PHONE_RE = /^010\d{8}$/;

/** 생년월일로 대회일 기준 만 나이와 코스 */
export function courseInfo(birth: string, event: KanfaEvent): { age: number; course: CourseType | null } | null {
  const iso = parseBirth(birth);
  if (!iso) return null;
  const age = ageOn(iso, event.date);
  return { age, course: courseForAge(age) };
}

/** 참가비. 개인은 코스에 따라 달라 첫 참가자의 코스로 정한다. */
export function amountFor(form: ApplyForm, event: KanfaEvent): number | null {
  if (!form.division) return null;
  if (form.division === "solo") {
    const info = courseInfo(form.participants[0]?.birth ?? "", event);
    if (!info?.course) return null;
    return event.divisions.find((d) => d.type === "solo" && d.course === info.course)?.fee ?? null;
  }
  return event.divisions.find((d) => d.type === form.division)?.fee ?? null;
}

const participantShape = z.object({
  name: z.string(),
  birth: z.string(),
  gender: z.string(),
  phone: z.string(),
  email: z.string(),
  emergencyPhone: z.string(),
  shirtSize: z.string(),
  gradeStatus: z.string(),
  grade: z.number().nullable(),
  gradeMeasuredAt: z.string(),
  lookedUpPhone: z.string(),
  onsiteMeasure: z.boolean(),
});

/** 대회와 이미 저장된 신청 내역에 따라 검증 규칙이 달라져 대회마다 만든다. */
export function makeSchema(event: KanfaEvent, apps: Application[]) {
  const eventDay = formatDate(event.date);

  return z
    .object({
      division: z.string(),
      teamName: z.string(),
      participants: z.array(participantShape),
      courseConfirmed: z.boolean(),
      health: z.record(z.string(), z.string()),
      doctorAck: z.boolean(),
      safetyPledge: z.boolean(),
      preferredSlot: z.string(),
      consents: z.record(z.string(), z.boolean()),
    })
    .superRefine((v, ctx) => {
      const issue = (path: (string | number)[], message: string) => ctx.addIssue({ code: "custom", path, message });

      // 1. 부문
      const division = v.division as DivisionType | "";
      if (!division) issue(["division"], "부문을 골라 주세요.");
      const size = division ? TEAM_SIZE[division] : 1;
      const left = seatsLeft(event, apps);
      if (division && size > left) {
        issue(["division"], `남은 자리가 ${left}명이라 ${size}명 부문으로는 신청할 수 없어요. 인원이 적은 부문을 골라 주세요.`);
      }

      // 2. 참가자 정보
      if (size > 1) {
        const t = v.teamName.trim();
        if (t.length < 2 || t.length > 20) issue(["teamName"], "팀 이름을 2~20자로 입력해 주세요.");
      }
      const phones = v.participants.map((p) => digits(p.phone));
      v.participants.forEach((p, i) => {
        const at = (f: string) => ["participants", i, f];
        const name = p.name.trim();
        if (!/^[가-힣a-zA-Z ]{2,20}$/.test(name)) issue(at("name"), "이름은 한글 또는 영문 2~20자로 입력해 주세요.");

        const iso = parseBirth(p.birth);
        if (!iso) {
          issue(at("birth"), "생년월일은 8자리 숫자로 입력해 주세요. 예: 19900315");
        } else {
          const age = ageOn(iso, event.date);
          if (age < 0 || age > 110) issue(at("birth"), "생년월일을 다시 확인해 주세요.");
          else if (age < MIN_AGE)
            issue(at("birth"), `대회일(${eventDay}) 기준 만 ${MIN_AGE}세 이상만 신청할 수 있어요. 입력한 생년월일로는 만 ${age}세예요.`);
        }

        if (p.gender !== "M" && p.gender !== "F") issue(at("gender"), "성별을 골라 주세요.");

        const phone = phones[i];
        if (!PHONE_RE.test(phone)) {
          issue(at("phone"), "휴대폰 번호는 010으로 시작하는 11자리 숫자로 입력해 주세요.");
        } else if (phones.indexOf(phone) !== i) {
          issue(at("phone"), "팀원끼리 같은 휴대폰 번호를 쓸 수 없어요. 팀원 본인의 번호를 입력해 주세요.");
        } else {
          const dup = findByPhone(event.id, phone, apps);
          if (dup) issue(at("phone"), `이 번호로 이미 이 대회에 신청했어요(접수번호 ${dup.id}). 신청 조회에서 확인하거나 다른 번호를 입력해 주세요.`);
        }

        if (p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim())) {
          issue(at("email"), "이메일 주소 형식을 확인해 주세요. 예: name@example.com");
        }

        const emergency = digits(p.emergencyPhone);
        if (!/^0\d{8,10}$/.test(emergency)) issue(at("emergencyPhone"), "비상연락처는 0으로 시작하는 9~11자리 숫자로 입력해 주세요.");
        else if (emergency === phone) issue(at("emergencyPhone"), "비상연락처는 본인 휴대폰과 다른 번호로 입력해 주세요. 가족이나 동료의 번호를 적어 주세요.");

        if (!SHIRT_SIZES.includes(p.shirtSize)) issue(at("shirtSize"), "기념품 사이즈를 골라 주세요.");

        // 3. 국민체력100 등급
        if (!p.onsiteMeasure) {
          const fresh = p.lookedUpPhone === phone;
          if (p.gradeStatus === "idle" || !fresh) {
            issue(at("gradeStatus"), "[등급 불러오기]를 누르거나 '대회장 측정 존에서 측정하기'를 골라 주세요.");
          } else if (p.gradeStatus === "none") {
            issue(at("gradeStatus"), "측정 이력이 없어 등급을 쓸 수 없어요. '대회장 측정 존에서 측정하기'를 골라 주세요.");
          } else if (p.gradeStatus === "expired") {
            issue(at("gradeStatus"), "측정한 지 1년이 지나 등급을 쓸 수 없어요. '대회장 측정 존에서 측정하기'를 골라 주세요.");
          }
        }
      });
      if (!v.courseConfirmed) issue(["courseConfirmed"], "참가할 코스를 확인하고 체크해 주세요.");

      // 4. 건강 문진
      let anyYes = false;
      HEALTH_QUESTIONS.forEach((q) => {
        const a = v.health[q.key];
        if (a !== "yes" && a !== "no") issue(["health", q.key], "예 또는 아니오를 골라 주세요.");
        if (a === "yes") anyYes = true;
      });
      if (anyYes && !v.doctorAck) issue(["doctorAck"], "'예'라고 답한 문항이 있어요. 의사와 상담했거나 상담하겠다는 데 체크해야 계속할 수 있어요.");
      if (!v.safetyPledge) issue(["safetyPledge"], "안전 서약에 체크해 주세요.");

      // 5. 출발 희망 시간대
      if (v.preferredSlot !== "am" && v.preferredSlot !== "pm") issue(["preferredSlot"], "오전 또는 오후를 골라 주세요.");

      // 6. 동의
      CONSENTS.forEach((c) => {
        if (c.required && !v.consents[c.key]) issue(["consents", c.key], "필수 동의 항목이에요. 내용을 확인하고 체크해 주세요.");
      });
    });
}

export const STEPS = ["부문 선택", "참가자 정보", "등급 확인", "건강 문진", "출발 시간대", "동의", "결제"] as const;

const PARTICIPANT_FIELDS = ["name", "birth", "gender", "phone", "email", "emergencyPhone", "shirtSize"] as const;

/** 단계마다 검사할 필드 이름(화면 순서대로) */
export function stepFields(step: number, form: ApplyForm): string[] {
  const idx = form.participants.map((_, i) => i);
  switch (step) {
    case 0:
      return ["division"];
    case 1:
      return [
        ...(form.division && form.division !== "solo" ? ["teamName"] : []),
        ...idx.flatMap((i) => PARTICIPANT_FIELDS.map((f) => `participants.${i}.${f}`)),
        "courseConfirmed",
      ];
    case 2:
      return idx.map((i) => `participants.${i}.gradeStatus`);
    case 3:
      return [...HEALTH_QUESTIONS.map((q) => `health.${q.key}`), "doctorAck", "safetyPledge"];
    case 4:
      return ["preferredSlot"];
    case 5:
      return CONSENTS.filter((c) => c.required).map((c) => `consents.${c.key}`);
    default:
      return [];
  }
}
