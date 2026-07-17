export type Point = { x: number; y: number };
export type Direction = 'up' | 'down' | 'left' | 'right';

export const FIELD_SIZE = { width: 1920, height: 960 } as const;
export const BUNNY_START: Point = { x: 960, y: 840 };
export const BUNNY_SPEED = 230;
export const FIELD_MARGIN = 40;
export const PICKUP_RADIUS = 56;

export function directionVector(directions: ReadonlySet<Direction>): Point {
  const x = Number(directions.has('right')) - Number(directions.has('left'));
  const y = Number(directions.has('down')) - Number(directions.has('up'));
  if (x === 0 && y === 0) return { x: 0, y: 0 };
  const magnitude = Math.hypot(x, y);
  return { x: x / magnitude, y: y / magnitude };
}

export function stepPosition(
  position: Point,
  directions: ReadonlySet<Direction>,
  elapsedSeconds: number,
): Point {
  const vector = directionVector(directions);
  const elapsed = Math.min(Math.max(elapsedSeconds, 0), 0.05);
  return {
    x: clamp(
      position.x + vector.x * BUNNY_SPEED * elapsed,
      FIELD_MARGIN,
      FIELD_SIZE.width - FIELD_MARGIN,
    ),
    y: clamp(
      position.y + vector.y * BUNNY_SPEED * elapsed,
      FIELD_MARGIN,
      FIELD_SIZE.height - FIELD_MARGIN,
    ),
  };
}

export function isWithinPickupRange(a: Point, b: Point): boolean {
  return Math.hypot(a.x - b.x, a.y - b.y) <= PICKUP_RADIUS;
}

export function cameraOffset(
  target: Point,
  viewport: { width: number; height: number },
): Point {
  const maxX = Math.max(0, FIELD_SIZE.width - viewport.width);
  const maxY = Math.max(0, FIELD_SIZE.height - viewport.height);
  return {
    x: clamp(target.x - viewport.width / 2, 0, maxX),
    y: clamp(target.y - viewport.height / 2, 0, maxY),
  };
}

export function keyToDirection(key: string): Direction | null {
  switch (key.toLowerCase()) {
    case 'w':
    case 'arrowup':
      return 'up';
    case 's':
    case 'arrowdown':
      return 'down';
    case 'a':
    case 'arrowleft':
      return 'left';
    case 'd':
    case 'arrowright':
      return 'right';
    default:
      return null;
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
