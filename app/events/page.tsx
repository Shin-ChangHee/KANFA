import type { Metadata } from "next";
import EventList from "@/components/events/EventList";
import PageIntro from "@/components/PageIntro";
import { events } from "@/lib/data";

export const metadata: Metadata = { title: "대회 일정" };

export default function EventsPage() {
  return (
    <>
      <PageIntro title="대회 일정" lead="다가오는 KANFA 대회를 확인하고 신청하세요. 대회를 누르면 일시·장소·참가비·출발 시간표를 볼 수 있어요." />
      <div className="container-page py-10">
        <EventList events={events} />
      </div>
    </>
  );
}
