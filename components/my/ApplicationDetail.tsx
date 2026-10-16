"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { COURSE_NAME } from "@/lib/age";
import { cancelApplication } from "@/lib/applications";
import { cancelDeadline, canCancelNow } from "@/lib/event";
import { formatDate, formatDateTime, formatShortDate, formatWon, maskPhone } from "@/lib/format";
import type { Application, KanfaEvent } from "@/lib/types";
import { DIVISION_LABEL } from "../apply/schema";
import { buttonClass } from "../ButtonLink";
import LaneBadge from "../LaneBadge";

export default function ApplicationDetail({ app, event }: { app: Application; event: KanfaEvent }) {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const cancelled = app.status === "cancelled";
  const finished = event.status === "finished";
  const deadline = cancelDeadline(event);
  const canCancel = !cancelled && canCancelNow(event);

  const doCancel = () => {
    cancelApplication(app.id);
    setConfirming(false);
    setMessage(`신청을 취소했어요. 참가비 ${formatWon(app.amount)}은 전액 환불돼요(시연).`);
  };

  return (
    <article aria-labelledby="detail-title" className="space-y-8">
      <div className="rounded-2xl border-2 border-track bg-white p-6 md:p-8">
        <p className={`inline-flex rounded-full px-3 py-0.5 text-sm font-bold ${cancelled ? "bg-mist text-ink" : "bg-field-soft text-field-ink"}`}>
          {cancelled ? "취소됨" : finished ? "참가 완료" : "신청 완료"}
        </p>
        <h2 id="detail-title" className="mt-3 text-2xl font-extrabold">
          {event.name}
        </h2>
        <p className="mt-1">
          {formatDate(event.date)} · {event.venue}
        </p>
        <p className="mt-3 text-slate">
          접수번호 <span className="font-num text-xl font-bold text-ink">{app.id}</span> · 신청일 {formatDateTime(app.createdAt)}
        </p>
      </div>

      <section aria-labelledby="heat-title">
        <h3 id="heat-title" className="text-xl font-extrabold">
          출발조와 출발 시간
        </h3>
        <p className="mt-2 rounded-xl border border-mist bg-white p-5">
          {cancelled ? (
            "취소한 신청이라 출발조가 배정되지 않아요."
          ) : finished ? (
            "경기 기록은 기록·순위에서 볼 수 있어요."
          ) : (
            <>
              <strong>대회 7일 전({formatShortDate(deadline)}) 배정 예정</strong>
              <span className="mt-1 block text-slate">
                희망 시간대: {app.preferredSlot === "am" ? "오전" : "오후"} · 배정되면 문자로 알려 드려요.
              </span>
            </>
          )}
        </p>
      </section>

      <section aria-labelledby="people-title">
        <h3 id="people-title" className="text-xl font-extrabold">
          신청 내용
        </h3>
        <dl className="mt-3 divide-y divide-mist rounded-xl border border-mist bg-white">
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="font-bold text-slate">부문</dt>
            <dd>
              {DIVISION_LABEL[app.division]}
              {app.teamName && ` · 팀 이름 ${app.teamName}`}
            </dd>
          </div>
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="font-bold text-slate">참가자</dt>
            <dd>
              <ul className="space-y-3">
                {app.participants.map((p) => (
                  <li key={p.phone} className="flex items-center gap-3">
                    {p.grade && !p.onsiteMeasure ? (
                      <LaneBadge grade={p.grade} size="sm" />
                    ) : (
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border-2 border-dashed border-slate px-1 text-sm font-bold text-slate" aria-hidden="true">
                        ?
                      </span>
                    )}
                    <span>
                      <strong>{p.name}</strong> · {COURSE_NAME[p.course]} · {maskPhone(p.phone)}
                      <span className="block text-sm text-slate">
                        {p.onsiteMeasure ? "대회장 측정 존에서 측정 후 출발조 배정" : `국민체력100 ${p.grade}등급`} · 기념품 {p.shirtSize}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="font-bold text-slate">결제 금액</dt>
            <dd>
              {formatWon(app.amount)} (시연){cancelled && " · 전액 환불"}
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="cancel-title" className="rounded-xl border border-mist bg-white p-5 md:p-6">
        <h3 id="cancel-title" className="text-xl font-extrabold">
          신청 취소
        </h3>
        <div role="status" className="mt-2">
          {message && <p className="font-bold text-field-ink">{message}</p>}
        </div>
        {cancelled ? (
          !message && <p className="mt-2">{app.cancelledAt ? `${formatDateTime(app.cancelledAt)}에 ` : ""}취소한 신청이에요.</p>
        ) : canCancel ? (
          !confirming ? (
            <>
              <p className="mt-2 text-slate">{formatShortDate(deadline)}까지 취소하면 참가비를 전액 환불받아요.</p>
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setConfirming(true)}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg border-2 border-danger bg-white px-5 font-bold text-danger hover:bg-[#fdecea]"
              >
                신청 취소하기
              </button>
            </>
          ) : (
            <div className="mt-3 rounded-lg border-2 border-danger p-4" role="group" aria-labelledby="confirm-text">
              <p id="confirm-text" className="font-bold">
                정말 취소할까요? 취소하면 되돌릴 수 없고, 다시 참가하려면 새로 신청해야 해요.
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                <button type="button" onClick={doCancel} autoFocus className="inline-flex min-h-11 items-center rounded-lg bg-danger px-5 font-bold text-white">
                  취소 확정하기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    setTimeout(() => cancelRef.current?.focus(), 0);
                  }}
                  className={buttonClass("secondary")}
                >
                  신청 유지하기
                </button>
              </div>
            </div>
          )
        ) : (
          <p className="mt-2">
            {finished ? "이미 끝난 대회라 취소할 수 없어요." : `대회 7일 전(${formatShortDate(deadline)})이 지나 취소할 수 없어요. 대회에 나올 수 없다면 운영사무국으로 연락해 주세요.`}
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={`/events/${event.id}`} className={buttonClass("secondary")}>
          대회 정보 보기
        </Link>
        <Link href="/events" className={buttonClass("ghost")}>
          다른 대회 보기
        </Link>
      </div>
    </article>
  );
}
