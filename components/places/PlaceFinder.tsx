"use client";

import { useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import type { Place } from "@/lib/types";

type Kind = "" | Place["kind"];

const KIND_INFO: Record<Place["kind"], { label: string; badge: string; body: string }> = {
  center: {
    label: "체력인증센터",
    badge: "bg-track-soft text-track",
    body: "국민체력100 무료 측정·등급 인증, 체력증진교실",
  },
  partner: {
    label: "훈련 파트너",
    badge: "bg-amber-soft text-ink",
    body: "KANFA 코스 동작 훈련 프로그램(민간 피트니스센터)",
  },
};

const selectClass = "mt-1 block min-h-11 w-full rounded-lg border-2 border-mist bg-white px-3 font-semibold focus:border-track";

export default function PlaceFinder({ places }: { places: Place[] }) {
  const params = useSearchParams();
  const initialKind = params.get("kind");
  const [region, setRegion] = useState("");
  const [kind, setKind] = useState<Kind>(initialKind === "center" || initialKind === "partner" ? initialKind : "");
  const ids = { region: useId(), kind: useId() };
  const regions = [...new Set(places.map((p) => p.region))];
  const list = places.filter((p) => (!region || p.region === region) && (!kind || p.kind === kind));

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="min-w-0">
        <form role="search" aria-label="훈련 장소 찾기" onSubmit={(e) => e.preventDefault()} className="grid gap-4 rounded-xl border border-mist bg-white p-5 sm:grid-cols-2">
          <div>
            <label htmlFor={ids.region} className="text-sm font-bold">
              지역
            </label>
            <select id={ids.region} value={region} onChange={(e) => setRegion(e.target.value)} className={selectClass}>
              <option value="">전체 지역</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={ids.kind} className="text-sm font-bold">
              장소 유형
            </label>
            <select id={ids.kind} value={kind} onChange={(e) => setKind(e.target.value as Kind)} className={selectClass}>
              <option value="">전체 유형</option>
              <option value="center">체력인증센터</option>
              <option value="partner">훈련 파트너</option>
            </select>
          </div>
        </form>

        <p aria-live="polite" className="mt-5 text-slate">
          {list.length}곳
        </p>
        {list.length === 0 ? (
          <div className="mt-3 rounded-xl border-2 border-dashed border-mist bg-white p-8">
            <p className="font-bold">조건에 맞는 장소가 없어요.</p>
            <p className="mt-1 text-slate">지역이나 장소 유형을 바꿔 보세요.</p>
          </div>
        ) : (
          <ul className="mt-3 divide-y divide-mist rounded-xl border border-mist bg-white">
            {list.map((p) => {
              const info = KIND_INFO[p.kind];
              return (
                <li key={p.id} className="p-5">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-0.5 text-sm font-bold ${info.badge}`}>{info.label}</span>
                    <span className="text-sm text-slate">{p.region}</span>
                  </p>
                  <h2 className="mt-2 text-lg font-extrabold">{p.name}</h2>
                  <p className="text-slate">{p.address}</p>
                  <p className="mt-1 text-sm">{info.body}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <aside aria-labelledby="map-title" className="min-w-0">
        <h2 id="map-title" className="text-lg font-extrabold">
          지도
        </h2>
        <div
          role="img"
          aria-label="훈련 장소 지도 자리(지도 준비 중). 장소 목록은 왼쪽에 있어요."
          className="mt-3 flex aspect-square w-full max-w-full items-center justify-center rounded-xl border-2 border-dashed border-track/40 bg-track-soft lg:sticky lg:top-24"
        >
          <span aria-hidden="true" className="text-center font-semibold text-track">
            지도 준비 중
            <br />
            <span className="text-sm font-normal text-slate">실제 지도 연동은 이번 시안 범위가 아니에요</span>
          </span>
        </div>
      </aside>
    </div>
  );
}
