import { getCourse } from "@/lib/data";
import TrackRunner from "./TrackRunner";

// 위에서 내려다본 타원형 트랙. 안쪽이 1레인, 바깥쪽이 6레인.
const CX = 330;
const CY = 200;
const STRAIGHT = 260; // 직선 구간 길이
const HALF = STRAIGHT / 2;
const INNER = 80; // 1레인 안쪽 반지름
const LANE = 18;
const OUTER = INNER + LANE * 6;
const START_X = CX - 40; // 출발·결승선 (아래쪽 직선)
const RUNNER_LANE = 4;

function stadium(r: number) {
  return `M ${CX - HALF} ${CY - r} H ${CX + HALF} A ${r} ${r} 0 0 1 ${CX + HALF} ${CY + r} H ${CX - HALF} A ${r} ${r} 0 0 1 ${CX - HALF} ${CY - r} Z`;
}

/** 출발선에서 시작해 시계 반대 방향(육상 트랙 방향)으로 한 바퀴 */
function lap(r: number) {
  return `M ${START_X} ${CY + r} H ${CX + HALF} A ${r} ${r} 0 0 0 ${CX + HALF} ${CY - r} H ${CX - HALF} A ${r} ${r} 0 0 0 ${CX - HALF} ${CY + r} H ${START_X}`;
}

const laneCenter = (lane: number) => INNER + LANE * (lane - 0.5);

// 구간 표시: 트랙 안쪽 잔디에 진행 순서대로 배치
const M = INNER - 26;
const STATION_POS = [
  { x: CX + 70, y: CY + M, lx: CX + 70, ly: CY + M - 22, anchor: "middle" },
  { x: CX + HALF + M, y: CY, lx: CX + HALF + M - 22, ly: CY + 5, anchor: "end" },
  { x: CX + 70, y: CY - M, lx: CX + 70, ly: CY - M + 30, anchor: "middle" },
  { x: CX - 70, y: CY - M, lx: CX - 70, ly: CY - M + 30, anchor: "middle" },
  { x: CX - HALF - M, y: CY, lx: CX - HALF - M + 22, ly: CY + 5, anchor: "start" },
  { x: CX - 110, y: CY + M, lx: CX - 110, ly: CY + M - 22, anchor: "middle" },
] as const;

export default function TrackHero() {
  const stations = getCourse("adult").stations;
  const runnerR = laneCenter(RUNNER_LANE);
  const description =
    "위에서 내려다본 육상 트랙 그림. 안쪽부터 1레인에서 6레인까지 국민체력100 1~6등급 번호가 적혀 있고, 트랙 안쪽에 " +
    stations.map((s) => `${s.order}구간 ${s.element}`).join(", ") +
    " 표시가 있어요. 점 하나가 4레인을 따라 한 바퀴 돌아요.";

  return (
    <figure>
    <svg viewBox="0 0 660 400" role="img" aria-labelledby="track-title track-desc" className="h-auto w-full">
      <title id="track-title">트랙 위의 여섯 레인</title>
      <desc id="track-desc">{description}</desc>

      {/* 트랙 바탕과 잔디 */}
      {/* 트랙 블루 띠 위에 놓이므로 트랙 면은 한 단계 진하게 */}
      <path d={stadium(OUTER)} fill="#163D7D" />
      <path d={stadium(INNER)} fill="#E4F4EC" />

      {/* 레인 경계선 */}
      {[1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={stadium(INNER + LANE * i)} fill="none" stroke="#F7F9FC" strokeOpacity={0.55} strokeWidth={1.5} />
      ))}
      <path d={stadium(OUTER)} fill="none" stroke="#F7F9FC" strokeWidth={2} />
      <path d={stadium(INNER)} fill="none" stroke="#F7F9FC" strokeWidth={2} />

      {/* 출발·결승선 */}
      <line x1={START_X} y1={CY + INNER} x2={START_X} y2={CY + OUTER} stroke="#F7F9FC" strokeWidth={4} />

      {/* 레인 번호 = 등급 */}
      {[1, 2, 3, 4, 5, 6].map((lane) => (
        <text
          key={lane}
          x={START_X - 20}
          y={CY + laneCenter(lane) + 5.5}
          textAnchor="middle"
          fontFamily="'Barlow Condensed', sans-serif"
          fontWeight={700}
          fontSize={16}
          fill="#F7F9FC"
        >
          {lane}
        </text>
      ))}

      {/* 구간 표시 */}
      {stations.map((s, i) => {
        const p = STATION_POS[i];
        return (
          <g key={s.order}>
            <circle cx={p.x} cy={p.y} r={13} fill="#F2A93B" />
            <text x={p.x} y={p.y + 5.5} textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight={700} fontSize={16} fill="#14213D">
              {s.order}
            </text>
            <text x={p.lx} y={p.ly} textAnchor={p.anchor} fontSize={15} fontWeight={700} fill="#14213D" className="hidden sm:inline">
              {s.element}
            </text>
          </g>
        );
      })}

      <text x={CX} y={CY + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="#1F7A50" className="hidden sm:inline">
        6개 구간 한 바퀴
      </text>

      <TrackRunner d={lap(runnerR)} start={{ x: START_X, y: CY + runnerR }} />
    </svg>
      {/* 좁은 화면에서는 트랙 안 글자가 너무 작아 구간 이름을 아래에 따로 보여준다 */}
      <ol aria-hidden="true" className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm font-semibold sm:hidden">
        {stations.map((s) => (
          <li key={s.order} className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber font-num text-ink">{s.order}</span>
            {s.element}
          </li>
        ))}
      </ol>
      <figcaption className="mt-4 text-center text-on-track">
        4등급이라면 <strong className="text-white">4번 레인</strong>에서 출발해요. 안쪽부터 1~6레인이 1~6등급이에요.
      </figcaption>
    </figure>
  );
}
