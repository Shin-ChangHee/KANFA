import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { notices } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "공지사항" };

export default function NoticePage() {
  const list = [...notices].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageIntro title="공지사항" lead="KANFA 운영 소식을 알려 드려요." />
      <div className="container-page py-10">
        <ul className="divide-y divide-mist border-y-2 border-ink">
          {list.map((n) => (
            <li key={n.id} className="relative py-5">
              <p className="text-sm text-slate">{formatDate(n.date)}</p>
              <h2 className="mt-1 text-lg font-bold md:text-xl">
                <Link href={`/notice/${n.id}`} className="after:absolute after:inset-0 hover:text-track hover:underline">
                  {n.title}
                </Link>
              </h2>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
