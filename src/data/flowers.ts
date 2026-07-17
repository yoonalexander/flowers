/**
 * ───────────────────────────────────────────────────────────────────────────
 *  EDIT EVERYTHING HERE
 * ───────────────────────────────────────────────────────────────────────────
 *  All wording, colours, and bouquet layout live in this file. You can change
 *  the experience without touching any component.
 *
 *  To add or remove a flower: add/remove an entry in `FLOWERS`. Keep `id`
 *  unique and stable (it's the sessionStorage key). Adjust `position` so the
 *  flower sits nicely in the bouquet — coordinates are in viewBox units (0–100),
 *  where x grows right and y grows down.
 *
 *  NOTE ON THE LANGUAGES CARD: wording is intentionally soft ("can speak … in
 *  some way"). Revise the exact phrasing/fluency framing here as needed.
 * ───────────────────────────────────────────────────────────────────────────
 */

import type { FlowerMessage, SiteCopy } from './types';

/**
 * Seven interactive lilies arranged as a loose dome over the wrapping cone.
 * Coordinates are in the 0–100 viewBox of <Bouquet/>. y≈24 is near the top of
 * the dome; the wrapping cone begins around y≈58.
 */
export const FLOWERS: FlowerMessage[] = [
  {
    id: 'chocolate-xiaolongbao',
    flowerType: 'Lily',
    title: 'A very important food plan',
    message:
      'I want to eat far too many chocolate xiaolongbao with you, and one day I want us to try making them together — even if the first batch turns out completely wrong.',
    colors: { primary: '#f4a6c0', secondary: '#f7d97a' },
    position: { x: 50, y: 24, rotation: 0, scale: 1.05, layer: 5 },
    fieldPosition: { x: 230, y: 500, scale: 1.05 },
    swayDuration: 6.5,
    swayDelay: 0,
  },
  {
    id: 'anime-watchlist',
    flowerType: 'Lily',
    title: 'Our watchlist',
    message:
      'I love watching anime with you. I want to keep finding new shows, arguing about our favourite characters, and filling an impossibly long watchlist together.',
    colors: { primary: '#b9a4e8', secondary: '#f7d97a' },
    position: { x: 31, y: 30, rotation: -12, scale: 0.95, layer: 4 },
    fieldPosition: { x: 520, y: 610, scale: 0.96 },
    swayDuration: 7.2,
    swayDelay: 0.4,
  },
  {
    id: 'roblox-player-two',
    flowerType: 'Lily',
    title: 'Player two',
    message:
      'I love playing Roblox with you, even when the game is completely ridiculous. Everything is more fun when I get to play it with you.',
    colors: { primary: '#8fd1c5', secondary: '#f7d97a' },
    position: { x: 69, y: 30, rotation: 12, scale: 0.95, layer: 4 },
    fieldPosition: { x: 790, y: 480, scale: 1.02 },
    swayDuration: 6.8,
    swayDelay: 0.8,
  },
  {
    id: 'football-real-madrid',
    flowerType: 'Lily',
    title: 'Every match',
    message:
      'I love watching football with you, and I want to watch many more Real Madrid matches together in the future.',
    colors: { primary: '#f4b878', secondary: '#f7d97a' },
    position: { x: 22, y: 42, rotation: -22, scale: 0.85, layer: 3 },
    fieldPosition: { x: 1120, y: 600, scale: 0.92 },
    swayDuration: 7.6,
    swayDelay: 1.1,
  },
  {
    id: 'languages-amaze-me',
    flowerType: 'Lily',
    title: 'You amaze me',
    message:
      'I love how intelligent and curious you are. That you can speak German, Japanese, English, Chinese, Spanish, and Filipino in some way genuinely amazes me.',
    colors: { primary: '#e08ab0', secondary: '#f7d97a' },
    position: { x: 78, y: 42, rotation: 22, scale: 0.85, layer: 3 },
    fieldPosition: { x: 1420, y: 500, scale: 0.98 },
    swayDuration: 6.2,
    swayDelay: 0.6,
  },
  {
    id: 'placeholder-comfort',
    flowerType: 'Lily',
    title: 'Completely myself',
    message:
      'I have never felt as comfortable and happy around anyone as I do around you. You make it easy to just be myself.',
    colors: { primary: '#f3c969', secondary: '#f4a6c0' },
    position: { x: 38, y: 50, rotation: -6, scale: 0.8, layer: 2 },
    fieldPosition: { x: 1580, y: 740, scale: 1.04 },
    swayDuration: 7.0,
    swayDelay: 1.4,
  },
  {
    id: 'placeholder-little-moments',
    flowerType: 'Lily',
    title: 'The little things',
    message:
      'I love the little moments we share — the quiet ones, the silly ones, and all the ordinary ones in between.',
    colors: { primary: '#9dc3e6', secondary: '#f7d97a' },
    position: { x: 62, y: 50, rotation: 6, scale: 0.8, layer: 2 },
    fieldPosition: { x: 420, y: 790, scale: 0.94 },
    swayDuration: 6.6,
    swayDelay: 0.2,
  },
];

/** Editable copy used across the experience. */
export const COPY: SiteCopy = {
  field: {
    heading: 'A little meadow is waiting for you.',
    keyboardInstruction: 'Use WASD or the arrow keys to help the bunny explore.',
    touchInstruction: 'Use the controls to help the bunny find every flower.',
    progressTemplate: '{n} of {total} flowers found',
    completed: 'Every flower has been gathered.',
    transitionAnnouncement: 'Every flower is found. Your bouquet is ready.',
  },
  intro: {
    heading: 'Every flower was picked just for you.',
    instruction: 'Together, they say what I\u2019ve been trying to tell you.',
  },
  progress: {
    template: '{n} of {total} flowers discovered',
    completed: 'Every flower has bloomed.',
  },
  card: {
    closeLabel: 'Close',
    openedAnnouncement: 'Message opened: {title}.',
  },
  proposal: {
    leadIn: 'I think I’ve been trying to say this for a while…',
    question: 'Will you be my girlfriend?',
    subline: 'I’d really love to keep making memories like these with you.',
    yesLabel: 'Yes ♡',
    talkLabel: 'Let’s talk',
  },
  response: {
    yes: 'You just made me very, very happy ♡',
    talk: 'Of course. I care about you, and we can talk about it whenever you’re ready.',
  },
};
