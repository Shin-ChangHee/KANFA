import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApplyWizard from "@/components/apply/ApplyWizard";
import { events, getEvent } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ eventId: e.id }));
}

type Props = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEvent((await params).eventId);
  return { title: event ? `참가 신청 - ${event.name}` : "참가 신청" };
}

export default async function ApplyPage({ params }: Props) {
  const event = getEvent((await params).eventId);
  if (!event) notFound();

  return (
    <>
      <div className="border-b border-mist bg-white">
        <div className="container-page py-8">
          <p className="font-semibold text-track">참가 신청</p>
          <h1 className="mt-1 text-[1.75rem] font-extrabold md:text-[2.25rem]">{event.name}</h1>
          <p className="mt-1 text-slate">
            {formatDate(event.date)} · {event.venue}
          </p>
        </div>
      </div>
      <div className="container-page max-w-4xl py-8">
        <ApplyWizard event={event} />
      </div>
    </>
  );
}
