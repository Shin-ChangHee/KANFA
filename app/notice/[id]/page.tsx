import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ButtonLink";
import PageIntro from "@/components/PageIntro";
import { notices } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return notices.map((n) => ({ id: n.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const n = notices.find((x) => x.id === id);
  return { title: n?.title ?? "공지사항" };
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const n = notices.find((x) => x.id === id);
  if (!n) notFound();
  return (
    <>
      <PageIntro eyebrow={`공지사항 · ${formatDate(n.date)}`} title={n.title} />
      <div className="container-page py-10">
        <p className="measure text-lg">{n.body}</p>
        <Link href="/notice" className={buttonClass("secondary", "mt-10")}>
          공지 목록으로
        </Link>
      </div>
    </>
  );
}
