import { STATUS_LABEL } from "@/lib/event";
import type { EventStatus } from "@/lib/types";

const STYLES: Record<EventStatus, string> = {
  open: "bg-amber text-ink",
  upcoming: "bg-track-soft text-track",
  closed: "bg-mist text-ink",
  finished: "bg-mist text-slate",
};

export default function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-sm font-bold ${STYLES[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
