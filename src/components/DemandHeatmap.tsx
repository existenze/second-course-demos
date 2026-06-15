import { DEMAND_GRID, DEMAND_LOCATIONS, DEMAND_TIMES } from "../data";

export function DemandHeatmap() {
  const max = Math.max(...DEMAND_GRID.flat());
  const cellW = 52;
  const cellH = 28;
  const labelW = 88;
  const labelH = 22;
  const width = labelW + DEMAND_TIMES.length * cellW + 16;
  const height = labelH + DEMAND_LOCATIONS.length * cellH + 32;

  return (
    <>
      <svg width={width} height={height} className="block">
        {DEMAND_TIMES.map((time, index) => (
          <text
            key={time}
            x={labelW + index * cellW + cellW / 2}
            y={14}
            textAnchor="middle"
            fill="#6b7280"
            fontSize={11}
            fontFamily="LotaGrotesqueAlt3SemiBold, sans-serif"
          >
            {time}
          </text>
        ))}
        {DEMAND_LOCATIONS.map((location, row) => (
          <g key={location}>
            <text
              x={labelW - 8}
              y={labelH + row * cellH + cellH / 2 + 4}
              textAnchor="end"
              fill="#18181b"
              fontSize={11}
              fontFamily="LotaGrotesqueAlt3SemiBold, sans-serif"
            >
              {location}
            </text>
            {DEMAND_GRID[row].map((value, col) => {
              const intensity = value / max;
              return (
                <rect
                  key={`${row}-${col}`}
                  x={labelW + col * cellW + 2}
                  y={labelH + row * cellH + 2}
                  width={cellW - 4}
                  height={cellH - 4}
                  rx={3}
                  fill="#6EC100"
                  opacity={0.12 + intensity * 0.78}
                  stroke="#18181b"
                  strokeWidth={0.5}
                />
              );
            })}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-xs text-black/60 font-sans">
        <span>Darker cells = higher claim rate</span>
        <span>Peak: Alumni Ctr, 11a–1p</span>
      </div>
    </>
  );
}
