import type { Application, KanfaEvent } from "./types";

function icsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** 대회 일정을 캘린더 파일(.ics) 내용으로 만든다. 출발 시간 확정 전이라 대회장 운영 시간(9~17시)으로 넣는다. */
export function buildIcs(app: Application, event: KanfaEvent): string {
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KANFA//Prototype//KO",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${app.id}@kanfa.example`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeText(event.name)}`,
    `LOCATION:${escapeText(event.venue)}`,
    `DESCRIPTION:${escapeText(`접수번호 ${app.id}\n출발조와 출발 시간은 대회 7일 전에 문자로 안내돼요.`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadText(filename: string, text: string, type: string): void {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
