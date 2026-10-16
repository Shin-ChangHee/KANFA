"use client";

// 이 브라우저의 신청 내역을 반영해 남은 자리·접수 상태를 보여주는 작은 조각들.
import Link from "next/link";
import { useApplications } from "@/lib/useApplications";
import { applyBlockedReason, seatsLeft, statusOf } from "@/lib/event";
import type { KanfaEvent } from "@/lib/types";
import { buttonClass } from "../ButtonLink";
import StatusBadge from "../StatusBadge";

export function SeatsLeft({ event }: { event: KanfaEvent }) {
  const apps = useApplications();
  return <>{seatsLeft(event, apps).toLocaleString("ko-KR")}</>;
}

export function LiveStatusBadge({ event }: { event: KanfaEvent }) {
  const apps = useApplications();
  return <StatusBadge status={statusOf(event, apps)} />;
}

/** [신청하기] 버튼. 접수 중이 아니면 버튼 대신 이유를 보여준다. */
export function ApplyAction({ event, label = "신청하기", className = "" }: { event: KanfaEvent; label?: string; className?: string }) {
  const apps = useApplications();
  const reason = applyBlockedReason(event, apps);
  if (reason) {
    return (
      <p className={`font-semibold ${className}`} role="note">
        {reason}
      </p>
    );
  }
  return (
    <Link href={`/apply/${event.id}`} className={buttonClass("primary", className)}>
      {label}
    </Link>
  );
}
