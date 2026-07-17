import type { Point } from '../game/fieldMath';

export function Bunny({
  position,
  moving,
  facing,
  reducedMotion,
}: {
  position: Point;
  moving: boolean;
  facing: 'left' | 'right';
  reducedMotion: boolean;
}) {
  return (
    <div
      className={`field-bunny${moving ? ' field-bunny--moving' : ''}${
        facing === 'left' ? ' field-bunny--left' : ''
      }${reducedMotion ? ' field-bunny--reduced' : ''}`}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      aria-label="Your bunny explorer"
      role="img"
    >
      <svg viewBox="0 0 92 94" aria-hidden="true">
        <ellipse className="bunny__shadow" cx="46" cy="84" rx="31" ry="7" />
        <g className="bunny__hop">
          <ellipse className="bunny__tail" cx="18" cy="60" rx="12" ry="13" />
          <ellipse className="bunny__body" cx="47" cy="61" rx="29" ry="25" />
          <ellipse className="bunny__foot" cx="29" cy="79" rx="15" ry="7" />
          <ellipse className="bunny__foot" cx="65" cy="79" rx="15" ry="7" />
          <g className="bunny__ears">
            <ellipse className="bunny__ear" cx="42" cy="21" rx="9" ry="24" transform="rotate(-8 42 21)" />
            <ellipse className="bunny__ear" cx="61" cy="22" rx="9" ry="24" transform="rotate(10 61 22)" />
            <ellipse className="bunny__ear-inner" cx="42" cy="21" rx="3.8" ry="17" transform="rotate(-8 42 21)" />
            <ellipse className="bunny__ear-inner" cx="61" cy="22" rx="3.8" ry="17" transform="rotate(10 61 22)" />
          </g>
          <circle className="bunny__head" cx="53" cy="48" r="24" />
          <circle className="bunny__eye" cx="62" cy="44" r="2.7" />
          <circle className="bunny__eye-glint" cx="63" cy="43" r="0.8" />
          <path className="bunny__nose" d="M72 50 l5 2.5 -5 3 z" />
          <path className="bunny__smile" d="M72 56 Q68 61 64 57" />
          <circle className="bunny__cheek" cx="64" cy="54" r="5" />
        </g>
      </svg>
    </div>
  );
}
