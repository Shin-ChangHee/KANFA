import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ApplyWizard from "@/components/apply/ApplyWizard";
import PageIntro from "@/components/PageIntro";
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
      <PageIntro eyebrow="참가 신청" title={event.name} lead={`${formatDate(event.date)} · ${event.venue}`} />
      <div className="container-page max-w-4xl py-10">
        <ApplyWizard event={event} />
      </div>
    </>
  );
}
