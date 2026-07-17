import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BUNNY_START,
  directionVector,
  keyToDirection,
  stepPosition,
  type Direction,
  type Point,
} from '../game/fieldMath';

export function useMovementControls(paused: boolean) {
  const [position, setPosition] = useState<Point>(BUNNY_START);
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const directionsRef = useRef<Set<Direction>>(new Set());

  const setDirection = useCallback(
    (direction: Direction, active: boolean) => {
      if (paused && active) return;
      if (active) directionsRef.current.add(direction);
      else directionsRef.current.delete(direction);
    },
    [paused],
  );

  const clearDirections = useCallback(() => {
    directionsRef.current.clear();
    setMoving(false);
  }, []);

  const resetPosition = useCallback(() => {
    clearDirections();
    setPosition(BUNNY_START);
    setFacing('right');
  }, [clearDirections]);

  useEffect(() => {
    if (paused) clearDirections();
  }, [clearDirections, paused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection(event.key);
      if (!direction || paused) return;
      event.preventDefault();
      directionsRef.current.add(direction);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      const direction = keyToDirection(event.key);
      if (!direction) return;
      event.preventDefault();
      directionsRef.current.delete(direction);
    };
    const onBlur = () => clearDirections();
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('keyup', onKeyUp, { passive: false });
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [clearDirections, paused]);

  useEffect(() => {
    let animationFrame = 0;
    let previousTime = performance.now();
    const tick = (time: number) => {
      const elapsed = (time - previousTime) / 1000;
      previousTime = time;
      const vector = directionVector(directionsRef.current);
      const isMoving = !paused && (vector.x !== 0 || vector.y !== 0);
      setMoving(isMoving);
      if (isMoving) {
        if (vector.x < 0) setFacing('left');
        if (vector.x > 0) setFacing('right');
        setPosition((current) => stepPosition(current, directionsRef.current, elapsed));
      }
      animationFrame = requestAnimationFrame(tick);
    };
    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [paused]);

  return {
    position,
    moving,
    facing,
    setDirection,
    clearDirections,
    resetPosition,
  };
}
