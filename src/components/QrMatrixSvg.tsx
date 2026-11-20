import React, { useMemo } from 'react';
import { Navigation } from 'lucide-react';

interface QrMatrixSvgProps {
  value: string;
  size?: number;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const QrMatrixSvg: React.FC<QrMatrixSvgProps> = ({ value, size = 188 }) => {
  const gridSize = 21;

  const cells = useMemo(() => {
    let seed = hashSeed(value);
    const nextBit = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return (seed >>> 24) % 2 === 1;
    };

    const matrix: ('dark' | 'accent' | 'empty')[][] = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => 'empty')
    );

    const isFinder = (r: number, c: number) => {
      const topLeft = r < 7 && c < 7;
      const topRight = r < 7 && c >= gridSize - 7;
      const bottomLeft = r >= gridSize - 7 && c < 7;
      return topLeft || topRight || bottomLeft;
    };

    const isCenterLogo = (r: number, c: number) => {
      return r >= 8 && r <= 12 && c >= 8 && c <= 12;
    };

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (isFinder(r, c) || isCenterLogo(r, c)) continue;
        // Keep 1-cell quiet zone around finders
        const nearTL = r <= 7 && c <= 7;
        const nearTR = r <= 7 && c >= gridSize - 8;
        const nearBL = r >= gridSize - 8 && c <= 7;
        if (nearTL || nearTR || nearBL) continue;

        if (nextBit()) {
          matrix[r][c] = r === 7 && c === 10 ? 'accent' : 'dark';
        }
      }
    }

    // Add 1 warm amber accent dot near center just like the Stitch design
    matrix[7][9] = 'accent';
    return matrix;
  }, [value]);

  const cellPx = 8;
  const viewBoxSize = gridSize * cellPx;

  const renderFinder = (x: number, y: number) => (
    <g key={`finder-${x}-${y}`}>
      <rect
        x={x * cellPx}
        y={y * cellPx}
        width={7 * cellPx}
        height={7 * cellPx}
        rx={8}
        fill="none"
        stroke="#1C261B"
        strokeWidth={cellPx}
      />
      <rect
        x={(x + 2) * cellPx}
        y={(y + 2) * cellPx}
        width={3 * cellPx}
        height={3 * cellPx}
        rx={4}
        fill="#1C261B"
      />
    </g>
  );

  return (
    <div
      className="relative inline-flex items-center justify-center rounded-2xl bg-white p-3"
      style={{ width: size, height: size }}
      aria-label={`QR-код заказа ${value}`}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
        role="img"
      >
        {/* Subtle inner finder borders */}
        {renderFinder(0, 0)}
        {renderFinder(gridSize - 7, 0)}
        {renderFinder(0, gridSize - 7)}

        {/* Data modules */}
        {cells.map((row, r) =>
          row.map((cell, c) => {
            if (cell === 'empty') return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellPx + 0.8}
                y={r * cellPx + 0.8}
                width={cellPx - 1.6}
                height={cellPx - 1.6}
                rx={2}
                fill={cell === 'accent' ? '#92400E' : '#1C261B'}
              />
            );
          })
        )}
      </svg>

      {/* Center CampusBite circle mark matching Stitch design */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-9 h-9 rounded-full bg-[#4D6A42] border-[3px] border-white flex items-center justify-center shadow-sm">
          <Navigation className="w-4 h-4 text-white fill-white/20" />
        </div>
      </div>
    </div>
  );
};
