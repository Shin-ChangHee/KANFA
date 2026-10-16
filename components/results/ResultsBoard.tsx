"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { formatRecord } from "@/lib/format";
import { heatLabel } from "@/lib/results";
import type { CourseType, Result } from "@/lib/types";
import CourseTabList from "../CourseTabList";
import LaneBadge from "../LaneBadge";

type View = "rank" | "growth";
const VIEWS: { value: View; label: string }[] = [
  { value: "rank", label: "순위" },
  { value: "growth", label: "성장상" },
];

const selectClass = "mt-1 block min-h-11 w-full rounded-lg border-2 border-mist bg-white px-3 font-semibold focus:border-track";
const th = "px-4 py-3 font-semibold";

function ViewTabs({ value, onChange }: { value: View; onChange: (v: View) => void }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + VIEWS.length) % VIEWS.length;
    onChange(VIEWS[n].value);
    refs.current[n]?.focus();
  };
  return (
    <div role="tablist" aria-label="기록 보기 방식" className="flex gap-1 border-b-2 border-mist">
      {VIEWS.map((v, i) => {
        const selected = v.value === value;
        return (
          <button
            key={v.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`view-tab-${v.value}`}
            aria-selected={selected}
            aria-controls="view-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(v.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={`-mb-0.5 min-h-12 border-b-4 px-5 text-lg font-bold ${selected ? "border-track text-track" : "border-transparent text-slate hover:text-ink"}`}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ResultsBoard({ results }: { results: Result[] }) {
  const [view, setView] = useState<View>("rank");
  const [course, setCourse] = useState<CourseType>("adult");
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [grade, setGrade] = useState("");
  const ids = { gender: useId(), age: useId(), grade: useId() };

  const inCourse = results.filter((r) => r.course === course);
  const ageGroups = [...new Set(inCourse.map((r) => r.ageGroup))].sort();
  const filtered = inCourse.filter(
    (r) => (!gender || r.gender === gender) && (!ageGroup || r.ageGroup === ageGroup) && (!grade || r.grade === Number(grade)),
  );
  const rows =
    view === "rank"
      ? [...filtered].sort((a, b) => a.totalSec - b.totalSec)
      : filtered.filter((r) => r.improvementSec).sort((a, b) => (b.improvementSec ?? 0) - (a.improvementSec ?? 0));

  const reset = () => {
    setGender("");
    setAgeGroup("");
    setGrade("");
  };

  return (
    <div>
      <ViewTabs value={view} onChange={setView} />

      <div id="view-panel" role="tabpanel" aria-labelledby={`view-tab-${view}`} className="pt-6">
        <p className="measure text-slate">
          {view === "rank"
            ? "부문·등급별로 시상해요. 같은 등급끼리 비교하려면 등급을 골라 보세요."
            : "직전 기록보다 가장 많이 빨라진 사람에게 주는 상이에요. 빨라진 시간이 큰 순서예요."}
        </p>

        <div className="mt-5 grid gap-4 rounded-xl border border-mist bg-white p-5 lg:grid-cols-[auto_1fr_1fr_1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-bold">코스</p>
            <div className="mt-1">
              <CourseTabList
                idPrefix="results"
                value={course}
                onChange={(c) => {
                  setCourse(c);
                  setAgeGroup("");
                }}
                label="코스 고르기"
              />
            </div>
          </div>
          <div>
            <label htmlFor={ids.gender} className="text-sm font-bold">
              성별
            </label>
            <select id={ids.gender} value={gender} onChange={(e) => setGender(e.target.value)} className={selectClass}>
              <option value="">전체</option>
              <option value="M">남성</option>
              <option value="F">여성</option>
            </select>
          </div>
          <div>
            <label htmlFor={ids.age} className="text-sm font-bold">
              연령대
            </label>
            <select id={ids.age} value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} className={selectClass}>
              <option value="">전체</option>
              {ageGroups.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={ids.grade} className="text-sm font-bold">
              국민체력100 등급
            </label>
            <select id={ids.grade} value={grade} onChange={(e) => setGrade(e.target.value)} className={selectClass}>
              <option value="">전체</option>
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={g}>
                  {g}등급
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={reset} className="min-h-11 rounded-lg px-4 font-semibold text-track underline underline-offset-4">
            조건 지우기
          </button>
        </div>

        <div id="results-panel" role="tabpanel" aria-labelledby={`results-tab-${course}`}>
        <p aria-live="polite" className="mt-5 text-slate">
          {view === "rank" ? `${rows.length}명` : `성장상 대상 ${rows.length}명`}
        </p>

        {rows.length === 0 ? (
          <div className="mt-3 rounded-xl border-2 border-dashed border-mist bg-white p-8">
            <p className="font-bold">조건에 맞는 기록이 없어요.</p>
            <p className="mt-1 text-slate">조건을 바꾸거나 지워 보세요.</p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-mist bg-white">
            <table className="w-full min-w-[36rem] text-left">
              <caption className="sr-only">{view === "rank" ? "기록 순위표" : "성장상 순위표"}</caption>
              <thead className="bg-lane text-sm text-slate">
                <tr>
                  <th scope="col" className={`${th} w-16 text-center`}>
                    순위
                  </th>
                  <th scope="col" className={th}>
                    이름
                  </th>
                  <th scope="col" className={th}>
                    등급
                  </th>
                  <th scope="col" className={th}>
                    출발조
                  </th>
                  {view === "growth" && (
                    <th scope="col" className={`${th} text-right`}>
                      빨라진 시간
                    </th>
                  )}
                  <th scope="col" className={`${th} text-right`}>
                    기록(분:초)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {rows.map((r, i) => (
                  <tr key={r.bib}>
                    <td className="px-4 py-3 text-center font-num text-2xl font-bold">{i + 1}</td>
                    <th scope="row" className="px-4 py-3 font-bold">
                      {r.maskedName}
                      <span className="block text-sm font-normal text-slate">
                        {r.ageGroup} · {r.gender === "M" ? "남성" : "여성"} · 배번 {r.bib}
                      </span>
                    </th>
                    <td className="px-4 py-3">
                      <LaneBadge grade={r.grade} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-sm">{heatLabel(r)}</td>
                    {view === "growth" && (
                      <td className="px-4 py-3 text-right font-num text-xl font-bold text-field-ink">
                        <span aria-hidden="true">−</span>
                        {formatRecord(r.improvementSec ?? 0)}
                        <span className="sr-only">분:초 빨라짐</span>
                      </td>
                    )}
                    <td className="px-4 py-3 text-right font-num text-2xl font-bold">{formatRecord(r.totalSec)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
        <p className="mt-3 text-sm text-slate">이름은 가운데 글자를 가려서 보여줘요. 기록은 유연성 단축 시간을 반영한 최종 기록이에요.</p>
      </div>
    </div>
  );
}
