"use client";

import { useSearchParams } from "next/navigation";
import { type FormEvent, useId, useRef, useState } from "react";
import { useApplications, useHydrated } from "@/lib/useApplications";
import { getEvent } from "@/lib/data";
import { formatShortDate } from "@/lib/format";
import { buttonClass } from "../ButtonLink";
import { ErrorText, inputClass } from "../form/Fields";
import ApplicationDetail from "./ApplicationDetail";

const ID_RE = /^KANFA-\d{4}-\d{4}$/;

export default function MyLookup() {
  const params = useSearchParams();
  const apps = useApplications();
  const hydrated = useHydrated();
  const [appId, setAppId] = useState(() => (params.get("id") ?? "").toUpperCase());
  const [last4, setLast4] = useState("");
  const [errors, setErrors] = useState<{ appId?: string; last4?: string; notFound?: string }>({});
  const [foundId, setFoundId] = useState<string | null>(null);
  const idRef = useRef<HTMLInputElement>(null);
  const last4Ref = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const ids = { appId: useId(), last4: useId() };

  const found = foundId ? apps.find((a) => a.id === foundId) : undefined;
  const event = found ? getEvent(found.eventId) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const id = appId.trim().toUpperCase();
    const next: typeof errors = {};
    if (!ID_RE.test(id)) next.appId = "접수번호는 KANFA-2027-0001 형식으로 입력해 주세요.";
    if (!/^\d{4}$/.test(last4)) next.last4 = "휴대폰 번호 뒤 4자리를 숫자로 입력해 주세요.";
    if (!next.appId && !next.last4) {
      const app = apps.find((a) => a.id === id && a.participants.some((p) => p.phone.endsWith(last4)));
      if (!app) next.notFound = "일치하는 신청 내역이 없어요. 접수번호와 휴대폰 번호 뒤 4자리를 다시 확인해 주세요. 이 시안은 신청한 브라우저에서만 조회돼요.";
      else {
        setFoundId(app.id);
        setErrors({});
        setTimeout(() => resultRef.current?.focus(), 0);
        return;
      }
    }
    setErrors(next);
    setFoundId(null);
    if (next.appId) idRef.current?.focus();
    else if (next.last4) last4Ref.current?.focus();
  };

  const mine = hydrated ? [...apps].reverse() : [];

  return (
    <div className="space-y-10">
      <form onSubmit={submit} noValidate aria-labelledby="lookup-title" className="rounded-xl border border-mist bg-white p-5 md:p-6">
        <h2 id="lookup-title" className="text-xl font-extrabold">
          신청 내역 조회
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-[1.4fr_1fr_auto] md:items-start">
          <div>
            <label htmlFor={ids.appId} className="block font-bold">
              접수번호
            </label>
            <input
              ref={idRef}
              id={ids.appId}
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="KANFA-2027-0001"
              autoComplete="off"
              aria-invalid={errors.appId ? true : undefined}
              aria-describedby={errors.appId ? `${ids.appId}-err` : undefined}
              className={inputClass(errors.appId)}
            />
            <ErrorText id={`${ids.appId}-err`} message={errors.appId} />
          </div>
          <div>
            <label htmlFor={ids.last4} className="block font-bold">
              휴대폰 번호 뒤 4자리
            </label>
            <input
              ref={last4Ref}
              id={ids.last4}
              value={last4}
              onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              aria-invalid={errors.last4 ? true : undefined}
              aria-describedby={errors.last4 ? `${ids.last4}-err` : undefined}
              className={inputClass(errors.last4)}
            />
            <ErrorText id={`${ids.last4}-err`} message={errors.last4} />
          </div>
          <button type="submit" className={buttonClass("primary", "md:mt-9")}>
            조회하기
          </button>
        </div>
        <div role="alert">{errors.notFound && <p className="mt-4 font-semibold text-danger">{errors.notFound}</p>}</div>
      </form>

      <div ref={resultRef} tabIndex={-1} className="focus:outline-none">
        {found && event && <ApplicationDetail app={found} event={event} />}
      </div>

      {mine.length > 0 && !found && (
        <section aria-labelledby="mine-title">
          <h2 id="mine-title" className="text-lg font-extrabold">
            이 브라우저에서 신청한 내역
          </h2>
          <p className="mt-1 text-sm text-slate">시연 편의를 위한 목록이에요. 접수번호를 채운 뒤 휴대폰 번호 뒤 4자리를 입력해 조회하세요.</p>
          <ul className="mt-3 divide-y divide-mist rounded-xl border border-mist bg-white">
            {mine.map((a) => {
              const ev = getEvent(a.eventId);
              return (
                <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <span>
                    <span className="font-num text-lg font-bold">{a.id}</span>
                    <span className="ml-2 text-slate">
                      {ev?.name} · {ev && formatShortDate(ev.date)}
                      {a.status === "cancelled" && " · 취소됨"}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppId(a.id);
                      setErrors({});
                      last4Ref.current?.focus();
                    }}
                    className="min-h-11 font-semibold text-track underline underline-offset-4"
                  >
                    접수번호 채우기<span className="sr-only"> ({a.id})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
