/** 동작 그림 자리표시. 실제 그림이 준비되면 이 컴포넌트만 바꾼다. */
export default function StationIllustration({ order, name }: { order: number; name: string }) {
  return (
    <svg viewBox="0 0 240 160" role="img" aria-label={`${name} 동작 그림 자리(그림 준비 중)`} className="h-auto w-full rounded-lg bg-track-soft">
      <rect x="1" y="1" width="238" height="158" rx="8" fill="none" stroke="#1E4FA0" strokeOpacity="0.35" strokeDasharray="6 6" strokeWidth="2" />
      <circle cx="120" cy="58" r="22" fill="#1E4FA0" />
      <text x="120" y="66" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif" fontWeight="700" fontSize="24" fill="#F7F9FC">
        {order}
      </text>
      <text x="120" y="112" textAnchor="middle" fontSize="15" fontWeight="600" fill="#14213D">
        {name}
      </text>
      <text x="120" y="134" textAnchor="middle" fontSize="12" fill="#4A5772">
        동작 그림 준비 중
      </text>
    </svg>
  );
}
