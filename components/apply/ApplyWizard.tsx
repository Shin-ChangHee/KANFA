"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, get, type Resolver, useForm } from "react-hook-form";
import { parseBirth } from "@/lib/age";
import { addApplication, getApplications, nextApplicationId } from "@/lib/applications";
import { useApplications, useHydrated } from "@/lib/useApplications";
import { applyBlockedReason } from "@/lib/event";
import { formatDate, kstYmd } from "@/lib/format";
import type { Application, Grade, KanfaEvent, Participant } from "@/lib/types";
import { buttonClass } from "../ButtonLink";
import { fieldId } from "../form/Fields";
import { amountFor, type ApplyForm, courseInfo, defaultValues, digits, makeSchema, STEPS, stepFields, TEAM_SIZE } from "./schema";
import StepIndicator from "./StepIndicator";
import { StepConsent, StepDivision, StepGrade, StepHealth, StepParticipants, StepPayment, StepSlot } from "./Steps";

const STEP_LEAD = [
  "부문을 고르면 필요한 참가자 수만큼 입력 칸이 생겨요.",
  "참가하는 사람의 정보를 입력해 주세요.",
  "참가자마다 등급을 불러오거나 대회장 측정 존을 골라 주세요.",
  "예/아니오로 답해 주세요.",
  "출발하고 싶은 시간대를 골라 주세요.",
  "필수 항목에 동의해야 신청할 수 있어요.",
  "신청 내용을 확인하고 결제해 주세요.",
];

function toApplication(form: ApplyForm, event: KanfaEvent): Application {
  const size = form.division ? TEAM_SIZE[form.division] : 1;
  const participants: Participant[] = form.participants.slice(0, size).map((p) => {
    const info = courseInfo(p.birth, event)!;
    const useGrade = !p.onsiteMeasure && p.gradeStatus === "found" && p.grade;
    return {
      name: p.name.trim(),
      birth: parseBirth(p.birth)!,
      gender: p.gender as "M" | "F",
      phone: digits(p.phone),
      email: p.email.trim() || undefined,
      emergencyPhone: digits(p.emergencyPhone),
      shirtSize: p.shirtSize,
      grade: useGrade ? (p.grade as Grade) : undefined,
      gradeMeasuredAt: useGrade ? p.gradeMeasuredAt : undefined,
      onsiteMeasure: !useGrade,
      course: info.course!,
    };
  });
  return {
    id: nextApplicationId(kstYmd(event.date).year),
    eventId: event.id,
    division: form.division as Application["division"],
    teamName: size > 1 ? form.teamName.trim() : undefined,
    participants,
    preferredSlot: form.preferredSlot as "am" | "pm",
    consents: { ...form.consents },
    amount: amountFor(form, event)!,
    status: "paid",
    createdAt: new Date().toISOString(),
  };
}

export default function ApplyWizard({ event }: { event: KanfaEvent }) {
  const router = useRouter();
  const apps = useApplications();
  const hydrated = useHydrated();
  // 검증 규칙은 이 브라우저에 저장된 신청 내역(중복·정원)에 따라 달라진다.
  const resolver = useMemo(() => zodResolver(makeSchema(event, apps)) as unknown as Resolver<ApplyForm>, [event, apps]);
  const methods = useForm<ApplyForm>({ resolver, defaultValues: defaultValues(), mode: "onSubmit", reValidateMode: "onChange" });
  const { trigger, getValues, handleSubmit } = methods;

  const [step, setStep] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  // 단계가 바뀌면 단계 제목으로 초점을 옮겨 화면 낭독기가 새 단계를 읽게 한다.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "start" });
  }, [step]);

  const focusFirstError = (names: string[]) => {
    const errors = methods.formState.errors;
    const failed = names.filter((n) => get(errors, n));
    setErrorCount(failed.length);
    if (failed[0]) {
      const el = document.getElementById(fieldId(failed[0]));
      el?.focus();
      el?.scrollIntoView({ block: "center" });
    }
  };

  const goTo = (next: number) => {
    setErrorCount(0);
    setStep(next);
  };

  const next = async () => {
    const names = stepFields(step, getValues());
    const ok = await trigger(names as Parameters<typeof trigger>[0]);
    if (!ok) {
      focusFirstError(names);
      return;
    }
    goTo(step + 1);
  };

  const onValid = (form: ApplyForm) => {
    if (submitting) return;
    // 결제 직전에 정원·접수 상태를 한 번 더 확인한다.
    const latest = getApplications();
    const blocked = applyBlockedReason(event, latest);
    if (blocked) {
      setErrorCount(1);
      return;
    }
    setSubmitting(true);
    const app = toApplication(form, event);
    addApplication(app);
    router.push(`/apply/complete?id=${encodeURIComponent(app.id)}`);
  };

  // 앞 단계에 고칠 곳이 남아 있으면 그 단계로 돌려보낸다.
  const onInvalid = () => {
    for (let s = 0; s < STEPS.length - 1; s++) {
      const names = stepFields(s, getValues());
      if (names.some((n) => get(methods.formState.errors, n))) {
        setStep(s);
        setTimeout(() => focusFirstError(names), 50);
        return;
      }
    }
  };

  const blocked = applyBlockedReason(event, apps);
  // 정적 HTML에서는 신청 내역을 모르므로, 저장소를 읽은 뒤에만 마감 여부로 막는다.
  if (hydrated && blocked && !submitting) {
    return (
      <div className="rounded-xl border-2 border-mist bg-white p-6">
        <p className="text-lg font-bold">{blocked}</p>
        <Link href={`/events/${event.id}`} className={buttonClass("secondary", "mt-4")}>
          대회 정보 보기
        </Link>
      </div>
    );
  }

  const isLast = step === STEPS.length - 1;

  return (
    <FormProvider {...methods}>
      <StepIndicator current={step} onGo={goTo} />

      <form
        noValidate
        className="mt-8"
        aria-labelledby="step-title"
        onSubmit={(e) => {
          e.preventDefault();
          if (isLast) handleSubmit(onValid, onInvalid)(e);
          else next();
        }}
      >
        <h2 id="step-title" ref={headingRef} tabIndex={-1} className="scroll-mt-28 text-[1.625rem] font-extrabold focus:outline-none">
          <span className="sr-only">
            {STEPS.length}단계 중 {step + 1}단계:{" "}
          </span>
          {STEPS[step]}
        </h2>
        <p className="mt-1 text-slate">{STEP_LEAD[step]}</p>

        {errorCount > 0 && (
          <div role="alert" className="mt-5 rounded-xl border-2 border-danger bg-white p-4 font-semibold text-danger">
            {blocked ?? `고칠 곳이 ${errorCount}개 있어요. 빨간 안내를 보고 고쳐 주세요.`}
          </div>
        )}

        <div className="mt-6">
          {step === 0 && <StepDivision event={event} />}
          {step === 1 && <StepParticipants event={event} />}
          {step === 2 && <StepGrade event={event} />}
          {step === 3 && <StepHealth />}
          {step === 4 && <StepSlot />}
          {step === 5 && <StepConsent />}
          {step === 6 && <StepPayment event={event} goTo={goTo} />}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-mist pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => goTo(step - 1)} className={buttonClass("secondary")}>
              이전 단계
            </button>
          ) : (
            <Link href={`/events/${event.id}`} className={buttonClass("ghost")}>
              대회 정보로 돌아가기
            </Link>
          )}
          <button type="submit" disabled={submitting} className={buttonClass("primary", "min-w-40 disabled:opacity-60")}>
            {isLast ? (submitting ? "결제하는 중" : "결제하기(시연)") : "다음 단계"}
          </button>
        </div>
      </form>
      <p className="mt-6 text-sm text-slate">대회일: {formatDate(event.date)} · 입력한 내용은 이전 단계로 돌아가도 그대로 남아요.</p>
    </FormProvider>
  );
}
