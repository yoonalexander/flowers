import { useEffect, useRef, useState } from 'react';
import type { FlowerMessage } from '../data/types';
import { Lily } from './Lily';
import './Flower.css';

/**
 * One interactive flower in the bouquet.
 *
 * Implemented as a focusable `<g role="button">` with a transparent SVG hit
 * circle (works identically for mouse, touch, and keyboard). This avoids the
 * cross-browser quirks of foreignObject while keeping the touch target large.
 *
 * Responsibilities:
 *  - render the lily desaturated (unbloomed) or full-colour (bloomed)
 *  - idle sway + shimmer hint when undiscovered; hover glow on desktop
 *  - one-shot sparkle burst + bloom animation on first discovery
 *  - keyboard activation (Enter / Space) and aria-pressed state
 */
export function Flower({
  flower,
  index,
  bloomed,
  completed,
  interactive = true,
  reducedMotion,
  onSelect,
}: {
  flower: FlowerMessage;
  /** 1-based number shown to the visitor. */
  index: number;
  bloomed: boolean;
  /** Whole bouquet completed — tucks the flower into the celebration. */
  completed: boolean;
  interactive?: boolean;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
}) {
  const { position, swayDuration, swayDelay } = flower;
  const [justBloomed, setJustBloomed] = useState(false);
  const prevBloomed = useRef(bloomed);

  // Fire the one-shot sparkle only on the actual discovery transition.
  useEffect(() => {
    if (bloomed && !prevBloomed.current) {
      setJustBloomed(true);
      const t = window.setTimeout(() => setJustBloomed(false), 1300);
      prevBloomed.current = true;
      return () => window.clearTimeout(t);
    }
    prevBloomed.current = bloomed;
    return undefined;
  }, [bloomed]);

  const accessibilityLabel = bloomed
    ? `${flower.flowerType} ${index}: ${flower.title}. Activate to read the message again.`
    : `${flower.flowerType} ${index}: undiscovered flower. Activate to reveal a message.`;

  const handleKey = (e: React.KeyboardEvent) => {
    // Buttons activate on Enter; SVG role=button needs both keys explicitly.
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(flower.id);
    }
  };

  return (
    <g
      id={`flower-${flower.id}`}
      className={`flower${bloomed ? ' flower--bloomed' : ''}${
        justBloomed ? ' flower--just' : ''
      }`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? accessibilityLabel : undefined}
      aria-pressed={interactive ? bloomed : undefined}
      aria-hidden={interactive ? undefined : true}
      transform={`translate(${position.x}, ${position.y})`}
      onClick={interactive ? () => onSelect(flower.id) : undefined}
      onKeyDown={interactive ? handleKey : undefined}
      style={
        {
          ['--frot']: `${position.rotation}deg`,
          ['--fscale']: position.scale,
          ['--sway-dur']: `${swayDuration}s`,
          ['--sway-delay']: `${swayDelay}s`,
        } as React.CSSProperties
      }
    >
      {/* Swinging wrapper carries the sway + bloom transition. */}
      <g className="flower__swing">
        <g className="flower__bloom">
          <Lily colors={flower.colors} bloomed={bloomed} revealProgress={1} />
        </g>
        {/* Discovery cue used while the bouquet is still interactive. */}
        {!completed && <circle className="flower__glow" cx={0} cy={0} r={20} />}
      </g>

      {/* Large transparent hit circle — keeps the touch target generous. */}
      <circle
        className="flower__hit"
        cx={0}
        cy={-6}
        r={13}
        aria-hidden="true"
      />
      {/* Focus ring shown only for keyboard users. */}
      <circle className="flower__focus" cx={0} cy={-6} r={15} aria-hidden="true" />

      {/* Sparkle burst on first discovery. */}
      {justBloomed && !reducedMotion && (
        <g className="flower__sparkles" aria-hidden="true">
          {SPARKLE_OFFSETS.map(([dx, dy, delay], i) => (
            <path
              key={i}
              className="flower__sparkle"
              d="M0 -3 L0.7 -0.7 L3 0 L0.7 0.7 L0 3 L-0.7 0.7 L-3 0 L-0.7 -0.7 Z"
              fill="#fff3b0"
              style={
                {
                  transform: `translate(${dx}px, ${dy}px)`,
                  animationDelay: `${delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>
      )}

      {/* Number badge helps identify discovered flowers before completion. */}
      {bloomed && !completed && (
        <g
          className="flower__badge"
          transform={`translate(9, -14)`}
          aria-hidden="true"
        >
          <circle r={4.2} className="flower__badge-bg" />
          <text
            textAnchor="middle"
            dy="1.6"
            className={`flower__badge-text${
              completed ? ' flower__badge-text--done' : ''
            }`}
          >
            {index}
          </text>
        </g>
      )}

    </g>
  );
}

// Sparkle offsets relative to the flower centre, in viewBox units.
const SPARKLE_OFFSETS: [number, number, number][] = [
  [-10, -12, 0],
  [11, -10, 0.05],
  [-13, 2, 0.1],
  [12, 4, 0.08],
  [0, 15, 0.12],
  [-7, -3, 0.16],
  [7, -2, 0.2],
];
