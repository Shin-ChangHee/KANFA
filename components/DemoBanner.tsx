import { DEMO_TODAY } from "@/lib/clock";
import { formatDate } from "@/lib/format";

export default function DemoBanner() {
  return (
    <div role="region" aria-label="시안 안내" className="bg-amber text-ink">
      <p className="container-page flex flex-wrap gap-x-3 py-1.5 text-sm leading-snug">
        <strong className="font-bold">이 사이트는 KANFA 사업 기획을 위한 시안입니다. 실제 접수·결제는 이루어지지 않습니다.</strong>
        <span>시연 기준일은 {formatDate(DEMO_TODAY)}이에요.</span>
      </p>
    </div>
  );
}
