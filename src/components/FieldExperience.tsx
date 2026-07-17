import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FlowerMessage } from '../data/types';
import { COPY } from '../data/flowers';
import {
  BUNNY_START,
  FIELD_SIZE,
  cameraOffset,
  isWithinPickupRange,
  type Point,
} from '../game/fieldMath';
import { useMovementControls } from '../hooks/useMovementControls';
import { Bunny } from './Bunny';
import { DPad } from './DPad';
import { FieldFlower } from './FieldFlower';
import './FieldExperience.css';

export function FieldExperience({
  flowers,
  discovered,
  paused,
  transitioning,
  reducedMotion,
  onCollect,
}: {
  flowers: FlowerMessage[];
  discovered: Set<string>;
  paused: boolean;
  transitioning: boolean;
  reducedMotion: boolean;
  onCollect: (id: string) => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pickupTimerRef = useRef<number | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [collectingId, setCollectingId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<Point | null>(null);
  const [touchControls, setTouchControls] = useState(false);
  const movement = useMovementControls(paused || transitioning || !!collectingId);

  const startCollection = useCallback(
    (flower: FlowerMessage) => {
      if (paused || transitioning || collectingId || discovered.has(flower.id)) return;
      movement.clearDirections();
      setCollectingId(flower.id);
      const delay = reducedMotion ? 0 : 340;
      pickupTimerRef.current = window.setTimeout(() => {
        onCollect(flower.id);
        setCollectingId(null);
      }, delay);
    },
    [collectingId, discovered, movement, onCollect, paused, reducedMotion, transitioning],
  );

  useEffect(() => () => {
    if (pickupTimerRef.current !== null) window.clearTimeout(pickupTimerRef.current);
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const measure = () => setViewport({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const coarse = window.matchMedia('(any-pointer: coarse)');
    const narrow = window.matchMedia('(max-width: 700px)');
    const update = () => setTouchControls(
      coarse.matches || narrow.matches || navigator.maxTouchPoints > 0,
    );
    update();
    coarse.addEventListener('change', update);
    narrow.addEventListener('change', update);
    return () => {
      coarse.removeEventListener('change', update);
      narrow.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (paused || transitioning || collectingId) return;
    const nearby = flowers.find(
      (flower) =>
        !discovered.has(flower.id) &&
        isWithinPickupRange(movement.position, flower.fieldPosition),
    );
    if (nearby) startCollection(nearby);
  }, [collectingId, discovered, flowers, movement.position, paused, startCollection, transitioning]);

  const cameraTarget = focusTarget ?? {
    x: movement.position.x - (touchControls ? 90 : 0),
    y: movement.position.y,
  };
  const camera = cameraOffset(cameraTarget, viewport);
  const foundCount = discovered.size;
  const progress = foundCount === flowers.length
    ? COPY.field.completed
    : COPY.field.progressTemplate
        .replace('{n}', String(foundCount))
        .replace('{total}', String(flowers.length));

  const decorations = useMemo(() => DECORATIONS, []);

  return (
    <section
      className={`field-shell${transitioning ? ' field-shell--leaving' : ''}`}
      aria-labelledby="field-heading"
    >
      <div className="field-hud">
        <div className="field-hud__note">
          <h1 id="field-heading">{COPY.field.heading}</h1>
          <p>{touchControls ? COPY.field.touchInstruction : COPY.field.keyboardInstruction}</p>
        </div>
        <div className="field-progress" role="status" aria-live="polite">
          <span aria-hidden="true">{Array.from({ length: flowers.length }, (_, index) => (
            <i key={index} className={index < foundCount ? 'is-found' : ''}>✿</i>
          ))}</span>
          <strong>{progress}</strong>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="field-viewport"
        tabIndex={-1}
        aria-label="Grassy meadow exploration area"
      >
        <div
          className={`field-world${reducedMotion ? ' field-world--reduced' : ''}`}
          style={{
            width: FIELD_SIZE.width,
            height: FIELD_SIZE.height,
            transform: `translate3d(${-camera.x}px, ${-camera.y}px, 0)`,
          }}
        >
          <div className="field-world__sky" aria-hidden="true">
            <span className="field-cloud field-cloud--one" />
            <span className="field-cloud field-cloud--two" />
            <span className="field-sun" />
          </div>
          <div className="field-world__grass" aria-hidden="true" />
          <div className="field-world__path" aria-hidden="true" />
          <div className="field-decorations" aria-hidden="true">
            {decorations.map((item, index) => (
              <span
                key={index}
                className={`field-decoration field-decoration--${item.kind}`}
                style={{ left: item.x, top: item.y, transform: `rotate(${item.rotation}deg) scale(${item.scale})` }}
              />
            ))}
          </div>

          {flowers.map((flower, index) =>
            discovered.has(flower.id) ? null : (
              <FieldFlower
                key={flower.id}
                flower={flower}
                index={index + 1}
                collecting={collectingId === flower.id}
                onCollect={() => startCollection(flower)}
                onFocus={() => setFocusTarget(flower.fieldPosition)}
                onBlur={() => setFocusTarget(null)}
              />
            ),
          )}

          <Bunny
            position={movement.position}
            moving={movement.moving}
            facing={movement.facing}
            reducedMotion={reducedMotion}
          />
        </div>
      </div>

      <DPad
        visible={touchControls}
        disabled={paused || transitioning || !!collectingId}
        onDirection={movement.setDirection}
      />

      {transitioning && (
        <div className="field-transition" role="status" aria-live="assertive">
          <span aria-hidden="true">✿</span>
          <p>{COPY.field.transitionAnnouncement}</p>
        </div>
      )}
    </section>
  );
}

const DECORATIONS = [
  { x: 90, y: 530, rotation: -12, scale: 1.1, kind: 'tuft' },
  { x: 380, y: 470, rotation: 8, scale: 0.8, kind: 'tuft' },
  { x: 650, y: 520, rotation: -4, scale: 1.2, kind: 'tuft' },
  { x: 1030, y: 500, rotation: 10, scale: 0.9, kind: 'tuft' },
  { x: 1320, y: 570, rotation: -8, scale: 1.15, kind: 'tuft' },
  { x: 1690, y: 520, rotation: 7, scale: 0.9, kind: 'tuft' },
  { x: 170, y: 810, rotation: 12, scale: 0.8, kind: 'tuft' },
  { x: 520, y: 790, rotation: -10, scale: 1, kind: 'tuft' },
  { x: 980, y: 830, rotation: 5, scale: 0.85, kind: 'tuft' },
  { x: 1350, y: 850, rotation: -4, scale: 1.1, kind: 'tuft' },
  { x: 1790, y: 820, rotation: 9, scale: 1, kind: 'tuft' },
  { x: 420, y: 610, rotation: 0, scale: 0.8, kind: 'stone' },
  { x: 1090, y: 660, rotation: 0, scale: 1, kind: 'stone' },
  { x: 1710, y: 650, rotation: 0, scale: 0.75, kind: 'stone' },
];

export { BUNNY_START };
