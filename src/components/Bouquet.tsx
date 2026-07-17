import type { FlowerMessage } from '../data/types';
import { Flower } from './Flower';
import './Bouquet.css';

/**
 * The illustrated bouquet: wrapping paper cone, ribbon, stems, leaves, and
 * small filler flowers as static decoration, with the interactive message
 * flowers layered on top. Overall brightness/warmth rises as more flowers bloom
 * (`progress`) and reaches a celebratory glow when `completed`.
 *
 * SVG viewBox is 0 0 100 130 — wide enough for the flower dome, tall enough
 * for the wrapping. The container scales responsively via CSS.
 */
export function Bouquet({
  flowers,
  discovered,
  completed,
  interactive = true,
  reducedMotion,
  onSelect,
}: {
  flowers: FlowerMessage[];
  discovered: Set<string>;
  completed: boolean;
  interactive?: boolean;
  reducedMotion: boolean;
  onSelect?: (id: string) => void;
}) {
  // Layer flowers by their `position.layer` so overlaps read correctly.
  const ordered = [...flowers].sort((a, b) => a.position.layer - b.position.layer);

  return (
    <div
      className={`bouquet${completed ? ' bouquet--completed' : ''}`}
    >
      <svg
        className="bouquet__svg"
        viewBox="0 0 100 130"
        preserveAspectRatio="xMidYMax meet"
        role={interactive ? 'group' : 'img'}
        aria-label={interactive ? 'Interactive bouquet of lilies' : 'Completed bouquet of seven lilies'}
      >
        <defs>
          {/* Wrapping paper gradient — warm cream to soft pink. */}
          <linearGradient id="wrapOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff3e6" />
            <stop offset="100%" stopColor="#f6cdd8" />
          </linearGradient>
          <linearGradient id="wrapInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fdeede" />
            <stop offset="100%" stopColor="#f1b9c8" />
          </linearGradient>
          <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a7cfa2" />
            <stop offset="100%" stopColor="#7fae7a" />
          </linearGradient>
        </defs>

        {/* ---- Wrapping paper cone (back) --------------------------------- */}
        <path
          className="bouquet__wrap bouquet__wrap--outer"
          aria-hidden="true"
          d="M30 70 L70 70 L62 126 Q50 131 38 126 Z"
          fill="url(#wrapOuter)"
          stroke="#e9c1cf"
          strokeWidth="0.6"
        />
        {/* Inner wrap showing through, slightly inset. */}
        <path
          className="bouquet__wrap bouquet__wrap--inner"
          aria-hidden="true"
          d="M35 70 L65 70 L58 122 Q50 126 42 122 Z"
          fill="url(#wrapInner)"
          opacity="0.9"
        />

        {/* ---- Stems converging into the cone ----------------------------- */}
        <g
          className="bouquet__stems"
          aria-hidden="true"
          stroke="url(#stemGrad)"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M50 72 C 50 60, 50 52, 50 48" />
          <path d="M50 74 C 44 66, 38 56, 34 50" />
          <path d="M50 74 C 56 66, 62 56, 66 50" />
          <path d="M50 74 C 41 70, 30 64, 26 60" />
          <path d="M50 74 C 59 70, 70 64, 74 60" />
          <path d="M50 74 C 47 68, 45 64, 44 62" />
          <path d="M50 74 C 53 68, 55 64, 56 62" />
        </g>

        {/* ---- Leaves ----------------------------------------------------- */}
        <g className="bouquet__leaves" aria-hidden="true">
          <Leaf x={26} y={62} rot={-32} />
          <Leaf x={74} y={62} rot={32} />
          <Leaf x={38} y={68} rot={-18} scale={0.8} />
          <Leaf x={62} y={68} rot={18} scale={0.8} />
          <Leaf x={50} y={70} rot={0} scale={0.7} />
        </g>

        {/* ---- Filler (non-interactive) baby's-breath dots ---------------- */}
        <g className="bouquet__filler" aria-hidden="true">
          {FILLER.map(([fx, fy], i) => (
            <g key={i} transform={`translate(${fx}, ${fy})`}>
              <circle r="1.6" fill="#fff" opacity="0.85" />
              <circle r="0.6" fill="#f3c969" />
            </g>
          ))}
        </g>

        {/* ---- Interactive flowers, layered ------------------------------- */}
        {ordered.map((flower) => {
          const realIndex = flowers.indexOf(flower) + 1;
          return (
            <Flower
              key={flower.id}
              flower={flower}
              index={realIndex}
              bloomed={discovered.has(flower.id)}
              completed={completed}
              interactive={interactive}
              reducedMotion={reducedMotion}
              onSelect={onSelect ?? (() => undefined)}
            />
          );
        })}

        {/* ---- Ribbon tied around the cone -------------------------------- */}
        <g className="bouquet__ribbon" aria-hidden="true">
          <path
            className="bouquet__ribbon-band"
            d="M33 86 Q50 92 67 86 L67 94 Q50 100 33 94 Z"
            fill="#d96a8d"
          />
          <path
            d="M33 86 Q50 92 67 86"
            fill="none"
            stroke="#fff"
            strokeWidth="0.6"
            opacity="0.4"
          />
          {/* Bow loops */}
          <g className="bouquet__bow">
            <path
              d="M50 90 C 38 82, 30 84, 30 90 C 30 96, 38 98, 50 90 Z"
              fill="#e88aa0"
            />
            <path
              d="M50 90 C 62 82, 70 84, 70 90 C 70 96, 62 98, 50 90 Z"
              fill="#e88aa0"
            />
            <circle cx="50" cy="90" r="2.2" fill="#d96a8d" />
            {/* Tails */}
            <path
              d="M47 92 C 44 100, 40 106, 36 112"
              stroke="#d96a8d"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M53 92 C 56 100, 60 106, 64 112"
              stroke="#d96a8d"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

/** A single leaf shape drawn at the given position. */
function Leaf({
  x,
  y,
  rot,
  scale = 1,
}: {
  x: number;
  y: number;
  rot: number;
  scale?: number;
}) {
  return (
    <path
      className="bouquet__leaf"
      d="M0 0 C 8 -4, 14 2, 16 8 C 8 8, 2 6, 0 0 Z"
      transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}
      fill="#a7cfa2"
      stroke="#86b57f"
      strokeWidth="0.4"
    />
  );
}

// Coordinates of filler baby's-breath clusters scattered among the flowers.
const FILLER: [number, number][] = [
  [42, 28],
  [58, 27],
  [50, 36],
  [30, 38],
  [70, 38],
  [44, 46],
  [56, 46],
  [50, 55],
  [28, 52],
  [72, 52],
];
