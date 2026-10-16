import { CYCLE } from "@/lib/content";

const C = 200;
const R = 140;
const NODE = 46;
const GAP = 24; // 노드와 화살표 사이 각도(도)

const rad = (deg: number) => (deg * Math.PI) / 180;
const at = (deg: number, r = R) => ({ x: C + r * Math.cos(rad(deg)), y: C + r * Math.sin(rad(deg)) });

/** 참여 순환: 측정 → 인증 → 레이스 → 등급 상승 → 재도전 → 다시 측정 */
export default function CycleDiagram() {
  const step = 360 / CYCLE.length;
  const angle = (i: number) => -90 + step * i;

  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={`참여 순환 그림: ${CYCLE.map((c) => c.title).join(" → ")} → 다시 측정으로 이어지는 원형 흐름`}
      className="mx-auto h-auto w-full max-w-md"
    >
      <defs>
        <marker id="cycle-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#1E4FA0" />
        </marker>
      </defs>

      {CYCLE.map((_, i) => {
        const from = at(angle(i) + GAP);
        const to = at(angle(i + 1) - GAP);
        return (
          <path
            key={`arc-${i}`}
            d={`M ${from.x} ${from.y} A ${R} ${R} 0 0 1 ${to.x} ${to.y}`}
            fill="none"
            stroke="#1E4FA0"
            strokeWidth={3}
            markerEnd="url(#cycle-arrow)"
          />
        );
      })}

      {CYCLE.map((c, i) => {
        const p = at(angle(i));
        const lines = c.title.split(" ");
        const highlight = c.title === "레이스";
        return (
          <g key={c.title}>
            <circle cx={p.x} cy={p.y} r={NODE} fill={highlight ? "#1E4FA0" : "#FFFFFF"} stroke="#1E4FA0" strokeWidth={3} />
            <text
              x={p.x}
              y={p.y - 14 - (lines.length - 1) * 9}
              textAnchor="middle"
              fontFamily="'Barlow Condensed', sans-serif"
              fontWeight={700}
              fontSize={16}
              fill={highlight ? "#FFFFFF" : "#1E4FA0"}
            >
              {i + 1}
            </text>
            {lines.map((line, li) => (
              <text
                key={line}
                x={p.x}
                y={p.y + 8 + li * 18 - (lines.length - 1) * 9}
                textAnchor="middle"
                fontSize={16}
                fontWeight={700}
                fill={highlight ? "#FFFFFF" : "#14213D"}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      <text x={C} y={C - 4} textAnchor="middle" fontSize={15} fontWeight={600} fill="#4A5772">
        한 번으로 끝나지 않고
      </text>
      <text x={C} y={C + 18} textAnchor="middle" fontSize={15} fontWeight={600} fill="#4A5772">
        계속 이어져요
      </text>
    </svg>
  );
}
