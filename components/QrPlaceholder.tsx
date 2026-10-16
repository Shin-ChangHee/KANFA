/** 입장용 QR 자리표시. 접수번호로 무늬를 만들 뿐, 실제로 스캔되지 않는다. */
export default function QrPlaceholder({ value }: { value: string }) {
  const N = 21;
  let h = 2166136261;
  for (const ch of value) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const rnd = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return (h >>> 0) / 4294967296;
  };
  const finder = (x: number, y: number) => {
    const inBox = (ox: number, oy: number) => x >= ox && x < ox + 7 && y >= oy && y < oy + 7;
    for (const [ox, oy] of [
      [0, 0],
      [N - 7, 0],
      [0, N - 7],
    ]) {
      if (inBox(ox, oy)) {
        const dx = x - ox;
        const dy = y - oy;
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  const cells: [number, number][] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const f = finder(x, y);
      if (f === 1 || (f === -1 && rnd() > 0.52)) cells.push([x, y]);
    }
  }
  return (
    <svg viewBox={`-2 -2 ${N + 4} ${N + 4}`} role="img" aria-label={`입장용 QR 코드 자리(시안). 접수번호 ${value}`} className="h-auto w-full max-w-[12rem]">
      <rect x="-2" y="-2" width={N + 4} height={N + 4} fill="#FFFFFF" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1.02" height="1.02" fill="#14213D" />
      ))}
    </svg>
  );
}
