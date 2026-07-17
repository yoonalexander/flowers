import './Background.css';

/**
 * Full-screen pastel backdrop: soft pink base, pastel-yellow polka dots, and a
 * subtle CSS grain. Purely decorative — `aria-hidden` keeps it out of the a11y
 * tree and tab order. Darkens slightly during the final reveal via the
 * `dimmed` prop.
 */
export function Background({ dimmed }: { dimmed: boolean }) {
  return (
    <div
      className={`bg${dimmed ? ' bg--dimmed' : ''}`}
      aria-hidden="true"
    >
      <div className="bg__dots" />
      {/* Repeating radial gradient creates a faint paper grain. */}
      <div className="bg__grain" />
      <div className="bg__vignette" />
    </div>
  );
}
