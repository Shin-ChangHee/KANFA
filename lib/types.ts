// 계획서 5.1 데이터 모델

export type CourseType = "adult" | "senior";
export type DivisionType = "solo" | "pair" | "relay4";
export type EventStatus = "upcoming" | "open" | "closed" | "finished";
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;
export type Gender = "M" | "F";

export interface Station {
  order: number;
  element: string; // 체력요소 (예: 심폐지구력)
  sourceTest: string; // 원래 측정항목
  raceRule: string; // 레이스 규칙
  description: string;
  tip: string;
}

export interface Course {
  type: CourseType;
  name: string;
  ageRange: string;
  durationMin: string;
  transferDistance: string;
  stations: Station[];
}

export interface Division {
  type: DivisionType;
  name: string;
  fee: number;
  teamSize: number;
  /** 개인 부문은 성인·어르신 코스에 따라 참가비가 달라 코스를 함께 적는다. */
  course?: CourseType;
}

export interface KanfaEvent {
  id: string;
  name: string;
  date: string; // ISO
  venue: string;
  region: string;
  applyStart: string;
  applyEnd: string;
  capacity: number;
  applied: number;
  status: EventStatus;
  divisions: Division[];
  heatsPreview: { time: string; label: string }[];
}

export interface Participant {
  name: string;
  birth: string;
  gender: Gender;
  phone: string;
  email?: string;
  emergencyPhone: string;
  shirtSize: string;
  grade?: Grade;
  gradeMeasuredAt?: string;
  onsiteMeasure: boolean;
  course: CourseType;
}

export interface Application {
  id: string; // KANFA-2027-0001
  eventId: string;
  division: DivisionType;
  teamName?: string;
  participants: Participant[];
  preferredSlot: "am" | "pm";
  consents: Record<string, boolean>;
  amount: number;
  status: "paid" | "cancelled";
  createdAt: string;
}

export interface Result {
  eventId: string;
  bib: string;
  maskedName: string;
  course: CourseType;
  gender: Gender;
  ageGroup: string;
  grade: Grade;
  totalSec: number;
  splits: number[];
  improvementSec?: number;
}

export interface Place {
  id: string;
  name: string;
  kind: "center" | "partner";
  region: string;
  address: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  body: string;
}
