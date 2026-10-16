"use client";

import { useSyncExternalStore } from "react";
import { readTextSize, writeTextSize, type TextSize } from "@/lib/storage";

// 글자 크기는 <html data-text-size>에 두고, 여러 토글(헤더·모바일 메뉴)이 같은 값을 보도록 구독한다.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): TextSize {
  return document.documentElement.dataset.textSize === "large" ? "large" : "normal";
}

function getServerSnapshot(): TextSize {
  return "normal";
}

function setTextSize(size: TextSize) {
  if (size === "large") document.documentElement.dataset.textSize = "large";
  else delete document.documentElement.dataset.textSize;
  writeTextSize(size);
  listeners.forEach((l) => l());
}

export default function TextSizeToggle({ className = "" }: { className?: string }) {
  const size = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const large = size === "large";

  return (
    <button
      type="button"
      aria-pressed={large}
      onClick={() => setTextSize(large ? "normal" : "large")}
      className={`inline-flex min-h-11 items-center gap-2 rounded-lg border-2 px-3 text-base font-semibold transition-colors ${
        large ? "border-track bg-track-soft text-track" : "border-mist bg-white text-ink hover:border-slate"
      } ${className}`}
    >
      <span aria-hidden="true" className="font-bold">
        가<span className="text-lg">가</span>
      </span>
      글자 크게
    </button>
  );
}

// 다른 탭에서 바꾼 설정도 반영한다.
if (typeof window !== "undefined") {
  window.addEventListener("storage", () => {
    const size = readTextSize();
    if (size === "large") document.documentElement.dataset.textSize = "large";
    else delete document.documentElement.dataset.textSize;
    listeners.forEach((l) => l());
  });
}
