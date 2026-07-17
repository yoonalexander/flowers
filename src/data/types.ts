/**
 * Shared types for the Flowers experience.
 *
 * All wording, colours, and layout live in `flowers.ts`. Components only render
 * what the data describes, so you can change the experience without editing JSX.
 */

/** A two-tone pastel palette used to colour a bloomed flower. */
export type FlowerColors = {
  /** Petal / outer colour. */
  primary: string;
  /** Accent / centre colour. */
  secondary: string;
};

/**
 * Position of a flower inside the SVG bouquet, in viewBox units (0–100).
 * `layer` controls paint order — higher layers draw on top.
 */
export type FlowerPosition = {
  x: number;
  y: number;
  /** Base rotation in degrees. */
  rotation: number;
  /** Scale multiplier (1 = default lily size). */
  scale: number;
  /** Paint order within the bouquet. Higher = drawn later (on top). */
  layer: number;
};

/** Position of a collectible flower in the meadow's virtual world. */
export type FieldPosition = {
  x: number;
  y: number;
  scale?: number;
};

/**
 * One interactive message flower in the bouquet.
 *
 * `id` must be unique and stable — it is used as the sessionStorage key and the
 * accessible label anchor, so do not change ids after launch.
 */
export type FlowerMessage = {
  id: string;
  /** Display label for the flower type, e.g. "Lily". Keep it generic. */
  flowerType: string;
  title: string;
  message: string;
  colors: FlowerColors;
  position: FlowerPosition;
  fieldPosition: FieldPosition;
  /** Sway animation duration in seconds. Slightly varied so the bouquet feels alive. */
  swayDuration: number;
  /** Sway animation delay in seconds, to de-synchronise flowers. */
  swayDelay: number;
};

/** Copy shown around and after the bouquet. Edit freely. */
export type SiteCopy = {
  field: {
    heading: string;
    keyboardInstruction: string;
    touchInstruction: string;
    progressTemplate: string;
    completed: string;
    transitionAnnouncement: string;
  };
  intro: {
    heading: string;
    instruction: string;
  };
  progress: {
    /** `{n}` and `{total}` are replaced at render time. */
    template: string;
    completed: string;
  };
  card: {
    closeLabel: string;
    /** `aria-live` announcement when a card opens. `{title}` is replaced. */
    openedAnnouncement: string;
  };
  proposal: {
    leadIn: string;
    question: string;
    subline: string;
    yesLabel: string;
    talkLabel: string;
  };
  response: {
    yes: string;
    talk: string;
  };
};
