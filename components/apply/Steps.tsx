"use client";

import { useId, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { COURSE_NAME } from "@/lib/age";
import { useApplications } from "@/lib/useApplications";
import { seatsLeft } from "@/lib/event";
import { formatDate, formatPhone, formatWon } from "@/lib/format";
import { lookupGrade } from "@/lib/gradeLookup";
import type { Grade, KanfaEvent } from "@/lib/types";
import { CheckboxField, ErrorText, fieldId, RadioCards, SelectField, TextField, useFieldError } from "../form/Fields";
import LaneBadge from "../LaneBadge";
import {
  amountFor,
  type ApplyForm,
  CONSENTS,
  courseInfo,
  digits,
  DIVISION_LABEL,
  emptyParticipant,
  HEALTH_QUESTIONS,
  PHONE_RE,
  SHIRT_SIZES,
  STEPS,
  TEAM_SIZE,
} from "./schema";

const Box = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-mist bg-white p-5 md:p-6 ${className}`}>{children}</div>
);

const participantTitle = (i: number, size: number) => (size === 1 ? "참가자" : i === 0 ? "참가자 1 (대표)" : `참가자 ${i + 1}`);

/* 1. 부문 선택 */
export function StepDivision({ event }: { event: KanfaEvent }) {
  const { getValues, setValue } = useFormContext<ApplyForm>();
  const apps = useApplications();
  const left = seatsLeft(event, apps);
  const types = [...new Set(event.divisions.map((d) => d.type))];
  const fee = (t: string) => {
    if (t === "solo") {
      const a = event.divisions.find((d) => d.type === "solo" && d.course === "adult");
      const s = event.divisions.find((d) => d.type === "solo" && d.course === "senior");
      return `성인 코스 ${formatWon(a?.fee ?? 0)} · 어르신 코스 ${formatWon(s?.fee ?? 0)}`;
    }
    return formatWon(event.divisions.find((d) => d.type === t)?.fee ?? 0);
  };

  // 부문을 바꾸면 참가자 칸 수를 맞춘다. 이미 입력한 참가자는 그대로 둔다.
  const onPick = (value: string) => {
    const size = TEAM_SIZE[value as keyof typeof TEAM_SIZE] ?? 1;
    const current = getValues("participants");
    setValue(
      "participants",
      Array.from({ length: size }, (_, i) => current[i] ?? emptyParticipant()),
    );
  };

  return (
    <div className="space-y-6">
      <RadioCards
        name="division"
        legend="어떤 부문으로 참가할까요?"
        hint={`남은 자리 ${left.toLocaleString("ko-KR")}명`}
        columns={3}
        onPick={onPick}
        options={types.map((t) => ({
          value: t,
          label: DIVISION_LABEL[t],
          description: (
            <>
              {TEAM_SIZE[t]}명 · {fee(t)}
            </>
          ),
        }))}
      />
      <p className="measure text-slate">
        개인 부문은 다음 단계에서 입력한 생년월일로 성인 코스(만 19~64세)와 어르신 코스(만 65세 이상)를 자동으로 정해요. 2인·4인 부문은 팀원마다 자기 나이에 맞는 코스를
        달려요.
      </p>
    </div>
  );
}

function CourseResult({ event }: { event: KanfaEvent }) {
  const participants = useWatch<ApplyForm, "participants">({ name: "participants" });
  return (
    <ul className="space-y-2" aria-live="polite">
      {participants.map((p, i) => {
        const info = courseInfo(p.birth, event);
        return (
          <li key={i} className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-semibold">{p.name.trim() || participantTitle(i, participants.length)}</span>
            {!info ? (
              <span className="text-slate">생년월일을 입력하면 코스를 알려 드려요.</span>
            ) : info.course ? (
              <span>
                대회일 기준 만 {info.age}세 · <strong>{COURSE_NAME[info.course]}</strong>
              </span>
            ) : (
              <span className="font-semibold text-danger">만 {info.age}세 · 만 19세 미만은 신청할 수 없어요</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* 2. 참가자 정보 */
export function StepParticipants({ event }: { event: KanfaEvent }) {
  const division = useWatch<ApplyForm, "division">({ name: "division" });
  const size = division ? TEAM_SIZE[division] : 1;
  const participants = Array.from({ length: size }, (_, i) => i);

  return (
    <div className="space-y-6">
      {size > 1 && (
        <Box>
          <TextField name="teamName" label="팀 이름" hint="2~20자. 기록·순위에 이 이름이 나와요." maxLength={20} />
        </Box>
      )}

      {participants.map((i) => {
        const base = `participants.${i}`;
        return (
          <fieldset key={i} className="rounded-xl border border-mist bg-white p-5 md:p-6">
            <legend className="px-1 text-lg font-extrabold">{participantTitle(i, size)}</legend>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField name={`${base}.name`} label="이름" autoComplete={i === 0 ? "name" : "off"} maxLength={20} />
              <TextField name={`${base}.birth`} label="생년월일" hint="8자리 숫자. 예: 19900315" inputMode="numeric" maxLength={10} autoComplete={i === 0 ? "bday" : "off"} />
              <RadioCards
                name={`${base}.gender`}
                legend="성별"
                options={[
                  { value: "M", label: "남성" },
                  { value: "F", label: "여성" },
                ]}
              />
              <TextField name={`${base}.phone`} label="휴대폰 번호" hint="숫자만 입력해도 돼요. 예: 01012345678" type="tel" inputMode="tel" maxLength={13} autoComplete={i === 0 ? "tel" : "off"} />
              <TextField name={`${base}.email`} label="이메일" optional type="email" inputMode="email" autoComplete={i === 0 ? "email" : "off"} />
              <TextField name={`${base}.emergencyPhone`} label="비상연락처" hint="본인이 아닌 가족·동료의 번호" type="tel" inputMode="tel" maxLength={13} />
              <SelectField name={`${base}.shirtSize`} label="기념품(티셔츠) 사이즈" options={SHIRT_SIZES.map((s) => ({ value: s, label: s }))} />
            </div>
          </fieldset>
        );
      })}

      <Box className="border-2 border-track">
        <h3 className="text-lg font-extrabold">참가할 코스</h3>
        <div className="mt-3">
          <CourseResult event={event} />
        </div>
        <div className="mt-4">
          <CheckboxField name="courseConfirmed" label="위 코스로 참가할게요" description="코스는 대회일 기준 만 나이로 정해지고, 바꿀 수 없어요." />
        </div>
      </Box>
    </div>
  );
}

/* 3. 국민체력100 등급 확인 */
function GradeCard({ index, size, event }: { index: number; size: number; event: KanfaEvent }) {
  const { register, setValue, clearErrors } = useFormContext<ApplyForm>();
  const p = useWatch<ApplyForm, `participants.${number}`>({ name: `participants.${index}` });
  const base = `participants.${index}` as const;
  const errorName = `${base}.gradeStatus` as const;
  const error = useFieldError(errorName);
  const [notice, setNotice] = useState("");
  const phone = digits(p.phone);
  const fresh = p.lookedUpPhone === phone && p.gradeStatus !== "idle";
  const onsiteId = fieldId(`${base}.onsiteMeasure`);

  const lookup = () => {
    if (!PHONE_RE.test(phone)) {
      setNotice("먼저 2단계에서 휴대폰 번호를 바르게 입력해 주세요.");
      return;
    }
    setNotice("");
    const r = lookupGrade(phone, event.date);
    setValue(`${base}.gradeStatus`, r.status);
    setValue(`${base}.grade`, r.status === "none" ? null : r.grade);
    setValue(`${base}.gradeMeasuredAt`, r.status === "none" ? "" : r.measuredAt);
    setValue(`${base}.lookedUpPhone`, phone);
    clearErrors(errorName);
  };

  return (
    <fieldset className="rounded-xl border border-mist bg-white p-5 md:p-6" aria-describedby={error ? `${fieldId(errorName)}-err` : undefined}>
      <legend className="px-1 text-lg font-extrabold">
        {participantTitle(index, size)}
        {p.name.trim() && <span className="ml-2 font-semibold text-slate">{p.name.trim()}</span>}
      </legend>
      <input type="hidden" {...register(`${base}.gradeStatus`)} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          id={fieldId(errorName)}
          type="button"
          onClick={lookup}
          className="inline-flex min-h-11 items-center rounded-lg border-2 border-track bg-white px-5 font-bold text-track hover:bg-track-soft"
        >
          등급 불러오기(시연)
        </button>
        {PHONE_RE.test(phone) && <span className="text-slate">{formatPhone(phone)} 기준</span>}
      </div>

      <div aria-live="polite" className="mt-4">
        {notice && <p className="font-semibold text-danger">{notice}</p>}
        {fresh && p.gradeStatus === "found" && p.grade && (
          <div className="flex items-center gap-4 rounded-lg bg-field-soft p-4">
            <LaneBadge grade={p.grade as Grade} size="lg" />
            <div>
              <p className="text-lg font-extrabold">국민체력100 {p.grade}등급</p>
              <p className="text-slate">측정일 {formatDate(p.gradeMeasuredAt)} · 대회일까지 유효해요</p>
            </div>
          </div>
        )}
        {fresh && p.gradeStatus === "none" && (
          <p className="rounded-lg bg-amber-soft p-4 font-semibold">국민체력100 측정 이력이 없어요. 아래에서 &lsquo;대회장 측정 존에서 측정하기&rsquo;를 골라 주세요.</p>
        )}
        {fresh && p.gradeStatus === "expired" && (
          <p className="rounded-lg bg-amber-soft p-4 font-semibold">
            마지막 측정일이 {formatDate(p.gradeMeasuredAt)}이에요. 대회일 기준 1년이 지나 이 등급은 쓸 수 없어요. 아래에서 &lsquo;대회장 측정 존에서 측정하기&rsquo;를 골라
            주세요.
          </p>
        )}
        {!fresh && p.gradeStatus !== "idle" && <p className="font-semibold">휴대폰 번호가 바뀌었어요. 등급을 다시 불러와 주세요.</p>}
      </div>

      <label htmlFor={onsiteId} className="mt-4 flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border-2 border-mist p-4 has-[:checked]:border-track has-[:checked]:bg-track-soft">
        <input id={onsiteId} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-track" {...register(`${base}.onsiteMeasure`, { onChange: () => clearErrors(errorName) })} />
        <span>
          <span className="block font-bold">대회장 측정 존에서 측정하기</span>
          <span className="mt-0.5 block text-slate">대회 당일 먼저 측정하고, 나온 등급에 맞는 출발조를 그 자리에서 배정받아요.</span>
        </span>
      </label>
      <ErrorText id={`${fieldId(errorName)}-err`} message={error} />
    </fieldset>
  );
}

export function StepGrade({ event }: { event: KanfaEvent }) {
  const division = useWatch<ApplyForm, "division">({ name: "division" });
  const size = division ? TEAM_SIZE[division] : 1;
  return (
    <div className="space-y-6">
      <p className="measure">국민체력100 등급으로 출발조를 나눠요. 등급이 없거나 측정한 지 1년이 지났다면 대회 당일 측정 존에서 측정하면 돼요.</p>
      <p className="measure rounded-lg border border-dashed border-slate/40 bg-white p-4 text-sm text-slate">
        시연 안내: 휴대폰 번호 끝자리가 0~5면 1~6등급, 6~7이면 측정 이력 없음, 8~9면 측정한 지 1년 지남으로 나와요. 실제 국민체력100과 연결하지 않아요.
      </p>
      {Array.from({ length: size }, (_, i) => (
        <GradeCard key={i} index={i} size={size} event={event} />
      ))}
    </div>
  );
}

/* 4. 건강 문진 */
export function StepHealth() {
  const health = useWatch<ApplyForm, "health">({ name: "health" });
  const division = useWatch<ApplyForm, "division">({ name: "division" });
  const anyYes = Object.values(health).some((a) => a === "yes");
  return (
    <div className="space-y-6">
      <p className="measure">
        안전한 레이스를 위해 지금 건강 상태를 물어요. 답변은 안전 관리에만 써요.
        {division && division !== "solo" && " 팀원 중 한 명이라도 해당하면 '예'를 골라 주세요."}
      </p>
      <ol className="space-y-4">
        {HEALTH_QUESTIONS.map((q, i) => (
          <li key={q.key} className="rounded-xl border border-mist bg-white p-5">
            <RadioCards
              name={`health.${q.key}`}
              legend={
                <>
                  <span className="mr-2 font-num text-xl text-track">{i + 1}</span>
                  {q.text}
                </>
              }
              options={[
                { value: "yes", label: "예" },
                { value: "no", label: "아니오" },
              ]}
            />
          </li>
        ))}
      </ol>

      <div aria-live="polite">
        {anyYes && (
          <div className="space-y-4 rounded-xl border-2 border-amber bg-amber-soft p-5">
            <p className="text-lg font-extrabold">참가 전에 의사와 상담해 주세요.</p>
            <p className="measure">&lsquo;예&rsquo;라고 답한 문항이 있어요. 운동해도 괜찮은지 의사에게 확인한 뒤 참가해 주세요. 대회 당일 의료진에게도 꼭 알려 주세요.</p>
            <CheckboxField name="doctorAck" label="의사와 상담했거나, 참가 전에 상담하겠습니다" />
          </div>
        )}
      </div>

      <CheckboxField
        name="safetyPledge"
        label="안전 수칙을 지키겠습니다"
        description="안전요원과 의료진의 안내를 따르고, 몸에 이상을 느끼면 바로 멈추겠습니다."
      />
    </div>
  );
}

/* 5. 출발 희망 시간대 */
export function StepSlot() {
  return (
    <div className="space-y-6">
      <RadioCards
        name="preferredSlot"
        legend="언제 출발하고 싶나요?"
        options={[
          { value: "am", label: "오전", description: "9시~12시 사이 출발" },
          { value: "pm", label: "오후", description: "13시~16시 사이 출발" },
        ]}
      />
      <p className="measure rounded-lg bg-track-soft p-4">
        희망 시간대예요. 확정이 아니에요. 출발조 인원에 따라 다른 시간대로 배정될 수 있고, 확정된 출발조와 시간은 대회 7일 전에 문자로 알려 드려요.
      </p>
    </div>
  );
}

/* 6. 동의 */
function ConsentRow({ c }: { c: (typeof CONSENTS)[number] }) {
  const [open, setOpen] = useState(false);
  const { register } = useFormContext<ApplyForm>();
  const name = `consents.${c.key}`;
  const error = useFieldError(name);
  const id = fieldId(name);
  const panelId = useId();
  return (
    <li className={`rounded-xl border-2 bg-white p-4 ${error ? "border-danger" : "border-mist"}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3">
          <input id={id} type="checkbox" className="h-5 w-5 shrink-0 accent-track" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...register(`consents.${c.key}`)} />
          <span className="font-bold">
            <span className={c.required ? "text-track" : "text-slate"}>[{c.required ? "필수" : "선택"}]</span> {c.label}
          </span>
        </label>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)} className="min-h-11 rounded-lg px-3 font-semibold text-track underline underline-offset-4">
          {open ? "내용 닫기" : "내용 보기"}
        </button>
      </div>
      <div id={panelId} hidden={!open} className="measure mt-2 rounded-lg bg-lane p-4 text-sm text-slate">
        {c.body}
      </div>
      <ErrorText id={`${id}-err`} message={error} />
    </li>
  );
}

export function StepConsent() {
  const { setValue } = useFormContext<ApplyForm>();
  const consents = useWatch<ApplyForm, "consents">({ name: "consents" });
  const all = CONSENTS.every((c) => consents[c.key]);
  const allId = useId();
  return (
    <div className="space-y-4">
      <label htmlFor={allId} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 border-track bg-track-soft p-4">
        <input
          id={allId}
          type="checkbox"
          checked={all}
          onChange={(e) => CONSENTS.forEach((c) => setValue(`consents.${c.key}`, e.target.checked, { shouldValidate: e.target.checked }))}
          className="h-5 w-5 shrink-0 accent-track"
        />
        <span className="text-lg font-extrabold">아래 내용에 모두 동의해요</span>
      </label>
      <ul className="space-y-3">
        {CONSENTS.map((c) => (
          <ConsentRow key={c.key} c={c} />
        ))}
      </ul>
    </div>
  );
}

function SummaryRow({ label, step, goTo, children }: { label: string; step: number; goTo: (step: number) => void; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr_auto] sm:items-start sm:gap-4">
      <dt className="font-bold text-slate">{label}</dt>
      <dd>{children}</dd>
      <dd>
        <button type="button" onClick={() => goTo(step)} className="min-h-11 font-semibold text-track underline underline-offset-4">
          {STEPS[step]} 고치기<span className="sr-only"> ({label})</span>
        </button>
      </dd>
    </div>
  );
}

/* 7. 결제(시연) */
export function StepPayment({ event, goTo }: { event: KanfaEvent; goTo: (step: number) => void }) {
  const form = useWatch<ApplyForm>() as ApplyForm;
  const amount = amountFor(form, event);
  const size = form.division ? TEAM_SIZE[form.division] : 1;

  return (
    <div className="space-y-6">
      <dl className="divide-y divide-mist rounded-xl border border-mist bg-white">
        <div className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr]">
          <dt className="font-bold text-slate">대회</dt>
          <dd>
            {event.name} · {formatDate(event.date)} · {event.venue}
          </dd>
        </div>
        <SummaryRow goTo={goTo} label="부문" step={0}>
          {form.division ? DIVISION_LABEL[form.division] : "-"}
          {size > 1 && form.teamName && ` · 팀 이름 ${form.teamName}`}
        </SummaryRow>
        <SummaryRow goTo={goTo} label="참가자" step={1}>
          <ul className="space-y-1">
            {form.participants.slice(0, size).map((p, i) => {
              const info = courseInfo(p.birth, event);
              return (
                <li key={i}>
                  <strong>{p.name}</strong> · {info?.course ? COURSE_NAME[info.course] : "-"} · {formatPhone(digits(p.phone))}
                </li>
              );
            })}
          </ul>
        </SummaryRow>
        <SummaryRow goTo={goTo} label="국민체력100 등급" step={2}>
          <ul className="space-y-1">
            {form.participants.slice(0, size).map((p, i) => (
              <li key={i}>
                {p.name}: {p.onsiteMeasure ? "대회장 측정 존에서 측정" : p.grade ? `${p.grade}등급` : "-"}
              </li>
            ))}
          </ul>
        </SummaryRow>
        <SummaryRow goTo={goTo} label="출발 희망" step={4}>
          {form.preferredSlot === "am" ? "오전" : form.preferredSlot === "pm" ? "오후" : "-"}
        </SummaryRow>
      </dl>

      <div className="rounded-xl border-2 border-track bg-white p-5 md:p-6">
        <p className="text-slate">결제 금액</p>
        <p className="mt-1">
          <span className="font-num text-[3rem] leading-none font-bold text-track">{amount ? amount.toLocaleString("ko-KR") : "-"}</span>
          <span className="ml-1 text-xl font-bold">원</span>
        </p>
        <p className="mt-3 text-sm text-slate">시연용 화면이에요. [결제하기(시연)]를 눌러도 실제 결제는 이루어지지 않아요.</p>
      </div>
    </div>
  );
}
