import { useMemo } from 'react';
import './PetalEffect.css';

/**
 * A layer of drifting petals/hearts over the whole viewport for ambient motion
 * and celebration bursts. Purely decorative — `aria-hidden`.
 *
 * `mode`:
 *  - 'ambient' — a few slow petals always drifting (set during normal viewing)
 *  - 'burst'   — a denser celebratory shower (final reveal / "Yes")
 */
export function PetalEffect({
  mode,
  reducedMotion,
}: {
  mode: 'ambient' | 'burst';
  reducedMotion: boolean;
}) {
  const count = mode === 'burst' ? 36 : 8;

  // Stable randomised petal configs per mount.
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const isHeart = mode === 'burst' && i % 4 === 0;
        return {
          left: Math.random() * 100,
          delay: Math.random() * (mode === 'burst' ? 2.5 : 9),
          duration: 7 + Math.random() * (mode === 'burst' ? 6 : 10),
          size: 8 + Math.random() * 12,
          hue: PETAL_HUES[i % PETAL_HUES.length],
          isHeart,
        };
      }),
    [count, mode],
  );

  // Reduced-motion users still get the experience, just without the drifting.
  if (reducedMotion) return null;

  return (
    <div className="petals" aria-hidden="true" data-mode={mode}>
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petals__p${p.isHeart ? ' petals__p--heart' : ''}`}
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.isHeart ? 'transparent' : p.hue,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

const PETAL_HUES = ['#f4a6c0', '#f7d97a', '#f4b878', '#e08ab0', '#fff0c2'];
