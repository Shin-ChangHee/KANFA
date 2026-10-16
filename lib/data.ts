// 목업 데이터 읽기. 화면은 JSON을 직접 import하지 않고 이 파일을 거친다.
import coursesJson from "@/data/courses.json";
import eventsJson from "@/data/events.json";
import faqJson from "@/data/faq.json";
import noticesJson from "@/data/notices.json";
import placesJson from "@/data/places.json";
import resultsJson from "@/data/results.json";
import type { Course, CourseType, FaqItem, KanfaEvent, Notice, Place, Result } from "./types";

export const courses = coursesJson as Course[];
export const events = eventsJson as KanfaEvent[];
export const faqs = faqJson as FaqItem[];
export const notices = noticesJson as Notice[];
export const places = placesJson as Place[];
export const results = resultsJson as Result[];

export function getCourse(type: CourseType): Course {
  return courses.find((c) => c.type === type)!;
}

export function getEvent(id: string): KanfaEvent | undefined {
  return events.find((e) => e.id === id);
}

/** 날짜순 정렬된 대회 */
export function sortedEvents(): KanfaEvent[] {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
}

export function getResults(eventId: string): Result[] {
  return results.filter((r) => r.eventId === eventId);
}
