import type { FlowerColors } from '../data/types';

/**
 * A stylised SVG lily, drawn around the origin (0,0). The <Flower/> wrapper
 * positions, rotates, and scales it. Lily = 6 elongated petals in two rings
 * (3 outer + 3 inner offset by 60°), six stamens, and a central pistil.
 *
 * `colors` only applies when `bloomed` is true; otherwise everything renders in
 * the desaturated dim palette so the bouquet reads as waiting to be opened.
 *
 * To swap flower type later, replace this component and keep the same prop
 * surface (colors, bloomed, revealProgress).
 */
export function Lily({
  colors,
  bloomed,
  /** 0→1 bloom progress used to ease petal openness (1 = fully open). */
  revealProgress = 1,
}: {
  colors: FlowerColors;
  bloomed: boolean;
  revealProgress?: number;
}) {
  const petal = bloomed ? colors.primary : 'var(--c-dim)';
  const petalDeep = bloomed ? colors.primary : 'var(--c-dim-deep)';
  const center = bloomed ? colors.secondary : 'var(--c-dim-deep)';
  const stamen = bloomed ? '#e9b34a' : '#b3aeb8';
  const anther = bloomed ? '#a8722a' : '#9a95a0';

  // Petals open outwards as the flower blooms. 0.86 = closed bud, 1.0 = open.
  const openness = 0.86 + 0.14 * revealProgress;

  return (
    <g className="lily">
      {/* Outer ring of 3 petals */}
      <g className="lily__petals lily__petals--outer">
        {[0, 120, 240].map((deg) => (
          <Petal
            key={deg}
            rotation={deg}
            fill={petal}
            stroke={petalDeep}
            openness={openness}
          />
        ))}
      </g>
      {/* Inner ring of 3 petals, offset 60° */}
      <g className="lily__petals lily__petals--inner">
        {[60, 180, 300].map((deg) => (
          <Petal
            key={deg}
            rotation={deg}
            fill={petal}
            stroke={petalDeep}
            openness={openness * 0.82}
          />
        ))}
      </g>

      {/* Stamens — thin filaments radiating from the centre */}
      <g className="lily__stamens" stroke={stamen} strokeWidth={0.6}>
        {[15, 75, 135, 195, 255, 315].map((deg) => (
          <line
            key={deg}
            x1={0}
            y1={0}
            x2={Math.cos((deg * Math.PI) / 180) * 8}
            y2={Math.sin((deg * Math.PI) / 180) * 8}
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* Anthers — small capped tips on the stamens */}
      <g className="lily__anthers" fill={anther}>
        {[15, 75, 135, 195, 255, 315].map((deg) => (
          <circle
            key={deg}
            cx={Math.cos((deg * Math.PI) / 180) * 8}
            cy={Math.sin((deg * Math.PI) / 180) * 8}
            r={1.1}
          />
        ))}
      </g>
      {/* Pistil — central style */}
      <circle className="lily__pistil" r={2.4} fill={center} />
      <circle r={1.1} fill={petalDeep} opacity={0.6} />
    </g>
  );
}

/** One elongated petal drawn pointing up from the origin, then rotated. */
function Petal({
  rotation,
  fill,
  stroke,
  openness,
}: {
  rotation: number;
  fill: string;
  stroke: string;
  openness: number;
}) {
  // Petal points "up": a tapered leaf shape from origin to ~(0,-24).
  // `openness` widens the petal base slightly as the flower blooms.
  const w = 5 * openness;
  return (
    <path
      d={`M0 0
          C ${-w} -6, ${-w * 0.7} -16, 0 -24
          C ${w * 0.7} -16, ${w} -6, 0 0 Z`}
      transform={`rotate(${rotation})`}
      fill={fill}
      stroke={stroke}
      strokeWidth={0.5}
      strokeLinejoin="round"
      opacity={0.92}
    />
  );
}
