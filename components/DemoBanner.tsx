import { DEMO_TODAY } from "@/lib/clock";
import { formatDate } from "@/lib/format";

export default function DemoBanner() {
  return (
    <div className="bg-amber text-ink">
      <p className="container-page py-2 text-sm leading-snug font-semibold">
        이 사이트는 KANFA 사업 기획을 위한 시안입니다. 실제 접수·결제는 이루어지지 않습니다.{" "}
        <span className="font-normal">시연 기준일은 {formatDate(DEMO_TODAY)}이에요.</span>
      </p>
    </div>
  );
}
