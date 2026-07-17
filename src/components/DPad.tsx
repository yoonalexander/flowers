import type { Direction } from '../game/fieldMath';

const CONTROLS: Array<{ direction: Direction; symbol: string; label: string }> = [
  { direction: 'up', symbol: '↑', label: 'Move up' },
  { direction: 'left', symbol: '←', label: 'Move left' },
  { direction: 'right', symbol: '→', label: 'Move right' },
  { direction: 'down', symbol: '↓', label: 'Move down' },
];

export function DPad({
  visible,
  disabled,
  onDirection,
}: {
  visible: boolean;
  disabled: boolean;
  onDirection: (direction: Direction, active: boolean) => void;
}) {
  if (!visible) return null;

  return (
    <div className="field-dpad" aria-label="Bunny movement controls">
      {CONTROLS.map(({ direction, symbol, label }) => (
        <button
          key={direction}
          type="button"
          className={`field-dpad__button field-dpad__button--${direction}`}
          aria-label={label}
          disabled={disabled}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            onDirection(direction, true);
          }}
          onPointerUp={(event) => {
            onDirection(direction, false);
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={() => onDirection(direction, false)}
          onLostPointerCapture={() => onDirection(direction, false)}
        >
          <span aria-hidden="true">{symbol}</span>
        </button>
      ))}
      <span className="field-dpad__center" aria-hidden="true">♡</span>
    </div>
  );
}
