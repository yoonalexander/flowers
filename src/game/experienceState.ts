export type ExperiencePhase = 'field' | 'transition' | 'bouquet' | 'proposal';

export function restoredPhase(foundCount: number, total: number): ExperiencePhase {
  return foundCount >= total ? 'bouquet' : 'field';
}

export function phaseAfterCardClose(
  current: ExperiencePhase,
  allFound: boolean,
): ExperiencePhase {
  return current === 'field' && allFound ? 'transition' : current;
}
