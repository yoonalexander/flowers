import { COPY } from '../data/flowers';
import './Intro.css';

/** Heading + instruction shown above the bouquet on first load. */
export function Intro({ hidden }: { hidden: boolean }) {
  return (
    <header
      className={`intro${hidden ? ' intro--hidden' : ''}`}
      aria-hidden={hidden}
    >
      <h1 className="intro__heading">{COPY.intro.heading}</h1>
      <p className="intro__instruction">{COPY.intro.instruction}</p>
    </header>
  );
}
