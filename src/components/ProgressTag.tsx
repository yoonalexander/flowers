import { COPY } from '../data/flowers';
import './ProgressTag.css';

/**
 * A handwritten-note style progress tag shown beneath the bouquet. Not a
 * corporate progress bar — just gentle text with small petal dots that fill in
 * as flowers are discovered.
 */
export function ProgressTag({
  discovered,
  total,
  completed,
}: {
  discovered: number;
  total: number;
  completed: boolean;
}) {
  const text = completed
    ? COPY.progress.completed
    : COPY.progress.template
        .replace('{n}', String(discovered))
        .replace('{total}', String(total));

  return (
    <div className="tag" role="status" aria-live="polite">
      <div className="tag__dots" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`tag__dot${i < discovered ? ' tag__dot--on' : ''}`}
          />
        ))}
      </div>
      <p className="tag__text">{text}</p>
    </div>
  );
}
