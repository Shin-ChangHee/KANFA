"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { COURSE_NAME } from "@/lib/age";
import { useApplications, useHydrated } from "@/lib/useApplications";
import { getEvent } from "@/lib/data";
import { formatDate, formatWon, maskPhone } from "@/lib/format";
import { buildIcs, downloadText } from "@/lib/ics";
import { buttonClass } from "../ButtonLink";
import QrPlaceholder from "../QrPlaceholder";
import { DIVISION_LABEL } from "./schema";

export default function CompleteView() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const apps = useApplications();
  const hydrated = useHydrated();
  const app = apps.find((a) => a.id === id);
  const event = app ? getEvent(app.eventId) : undefined;

  // 불러오는 동안에도 결과 상자만큼 자리를 잡아 화면이 밀리지 않게 한다.
  if (!hydrated) return <p className="min-h-[13rem] rounded-xl border-2 border-mist bg-white p-6 text-slate">신청 내역을 불러오고 있어요.</p>;

  if (!app || !event) {
    return (
      <div className="min-h-[13rem] rounded-xl border-2 border-mist bg-white p-6">
        <p className="text-lg font-bold">신청 내역을 찾을 수 없어요.</p>
        <p className="mt-1 text-slate">접수번호가 있다면 신청 조회에서 확인해 주세요. 이 시안은 신청한 브라우저에서만 내역을 볼 수 있어요.</p>
        <Link href="/my" className={buttonClass("primary", "mt-4")}>
          신청 조회하기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-8">
        <section aria-labelledby="done-title" className="rounded-2xl border-2 border-field bg-white p-6 md:p-8">
          <p className="inline-flex items-center gap-2 font-bold text-field-ink">
            <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22">
              <circle cx="11" cy="11" r="10" fill="#1F7A50" />
              <path d="M6.5 11.5l3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            신청이 접수됐어요
          </p>
          <h2 id="done-title" className="mt-4 text-slate">
            접수번호
          </h2>
          <p className="font-num text-[2.5rem] leading-tight font-bold tracking-wide text-track md:text-[3rem]">{app.id}</p>
          <p className="mt-2 text-slate">신청 조회와 취소에 필요해요. 꼭 적어 두세요.</p>
        </section>

        <section aria-labelledby="summary-title">
          <h2 id="summary-title" className="text-[1.5rem] font-extrabold">
            신청 요약
          </h2>
          <dl className="mt-4 divide-y divide-mist rounded-xl border border-mist bg-white">
            {[
              ["대회", `${event.name} · ${formatDate(event.date)}`],
              ["장소", event.venue],
              ["부문", `${DIVISION_LABEL[app.division]}${app.teamName ? ` · 팀 이름 ${app.teamName}` : ""}`],
              ["출발 희망", app.preferredSlot === "am" ? "오전" : "오후"],
              ["결제 금액", `${formatWon(app.amount)} (시연)`],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
                <dt className="font-bold text-slate">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div className="grid gap-1 px-5 py-4 sm:grid-cols-[8rem_1fr]">
              <dt className="font-bold text-slate">참가자</dt>
              <dd>
                <ul className="space-y-1">
                  {app.participants.map((p) => (
                    <li key={p.phone}>
                      <strong>{p.name}</strong> · {COURSE_NAME[p.course]} · {p.onsiteMeasure ? "대회장 측정 존에서 측정" : `${p.grade}등급`} · {maskPhone(p.phone)}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="next-title" className="rounded-xl bg-track-soft p-6">
          <h2 id="next-title" className="text-lg font-extrabold">
            다음에 할 일
          </h2>
          <ul className="measure mt-3 list-disc space-y-2 pl-5">
            <li>출발조·출발 시간은 대회 7일 전에 문자로 안내돼요.</li>
            {app.participants.some((p) => p.onsiteMeasure) && <li>대회장 측정 존에서 측정하는 참가자는 출발 1시간 전까지 측정 존에 와 주세요.</li>}
            <li>대회 당일 운동복, 실내 운동화, 신분증, 물을 챙겨 주세요.</li>
            <li>대회 7일 전까지는 신청 조회에서 취소하고 전액 환불받을 수 있어요.</li>
          </ul>
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href={`/my?id=${encodeURIComponent(app.id)}`} className={buttonClass("primary")}>
            신청 조회하기
          </Link>
          <button type="button" onClick={() => downloadText(`${app.id}.ics`, buildIcs(app, event), "text/calendar;charset=utf-8")} className={buttonClass("secondary")}>
            대회 일정 캘린더에 추가
          </button>
        </div>
      </div>

      <aside aria-labelledby="qr-title" className="h-fit rounded-xl border border-mist bg-white p-6">
        <h2 id="qr-title" className="text-lg font-extrabold">
          입장용 QR
        </h2>
        <div className="mt-4">
          <QrPlaceholder value={app.id} />
        </div>
        <p className="mt-3 text-sm text-slate">시안용 그림이라 실제로 스캔되지 않아요. 대회 당일 입장할 때 이 화면이나 문자로 받은 QR을 보여 주세요.</p>
      </aside>
    </div>
  );
}
