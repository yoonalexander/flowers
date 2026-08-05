import bunnyImage from '../assets/bunny-removebg-preview.png';
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
      <span className="bunny__shadow" aria-hidden="true" />
      <span className="bunny__hop" aria-hidden="true">
        <img
          className="bunny__sprite"
          src={bunnyImage}
          alt=""
          draggable={false}
        />
      </span>
    </div>
  );
}
