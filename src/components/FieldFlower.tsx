import type { FlowerMessage } from '../data/types';
import { Lily } from './Lily';

export function FieldFlower({
  flower,
  index,
  collecting,
  onCollect,
  onFocus,
  onBlur,
}: {
  flower: FlowerMessage;
  index: number;
  collecting: boolean;
  onCollect: () => void;
  onFocus: () => void;
  onBlur: () => void;
}) {
  return (
    <button
      type="button"
      className={`field-flower${collecting ? ' field-flower--collecting' : ''}`}
      style={{
        left: flower.fieldPosition.x,
        top: flower.fieldPosition.y,
        ['--field-flower-scale' as string]: flower.fieldPosition.scale ?? 1,
      }}
      aria-label={`${flower.flowerType} ${index}: undiscovered flower. Collect it.`}
      onClick={onCollect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onCollect();
        }
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <span className="field-flower__sparkles" aria-hidden="true">✦ · ✦</span>
      <svg viewBox="-28 -30 56 76" aria-hidden="true">
        <path className="field-flower__stem" d="M0 8 C -2 22, 1 34, -1 47" />
        <path className="field-flower__leaf" d="M-1 31 C-15 22 -20 35 -2 39 Z" />
        <g transform="translate(0 5) scale(.8)">
          <Lily colors={flower.colors} bloomed revealProgress={1} />
        </g>
      </svg>
    </button>
  );
}
