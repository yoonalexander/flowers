import { useCallback, useEffect, useState } from 'react';
import { Background } from './components/Background';
import { Intro } from './components/Intro';
import { Bouquet } from './components/Bouquet';
import { MessageCard } from './components/MessageCard';
import { ProgressTag } from './components/ProgressTag';
import { PetalEffect } from './components/PetalEffect';
import { FinalProposal } from './components/FinalProposal';
import { FieldExperience } from './components/FieldExperience';
import type { ProposalResponse } from './components/FinalProposal';
import { FLOWERS, COPY } from './data/flowers';
import { useDiscoveredFlowers } from './hooks/useDiscoveredFlowers';
import { useReducedMotion } from './hooks/useReducedMotion';
import {
  phaseAfterCardClose,
  restoredPhase,
  type ExperiencePhase,
} from './game/experienceState';
import './App.css';

export default function App() {
  const reducedMotion = useReducedMotion();
  const { discovered, discover, reset, hydrated } = useDiscoveredFlowers();
  const [phase, setPhase] = useState<ExperiencePhase>('field');
  const [experienceReady, setExperienceReady] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [response, setResponse] = useState<ProposalResponse>(null);

  const validDiscovered = new Set(
    FLOWERS.filter((flower) => discovered.has(flower.id)).map((flower) => flower.id),
  );
  const total = FLOWERS.length;
  const discoveredCount = validDiscovered.size;
  const allFound = hydrated && discoveredCount >= total;

  useEffect(() => {
    if (!hydrated || experienceReady) return;
    setPhase(restoredPhase(discoveredCount, total));
    setExperienceReady(true);
  }, [discoveredCount, experienceReady, hydrated, total]);

  useEffect(() => {
    if (phase !== 'transition') return;
    const timer = window.setTimeout(
      () => setPhase('bouquet'),
      reducedMotion ? 0 : 900,
    );
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (phase !== 'bouquet') return;
    const timer = window.setTimeout(
      () => setPhase('proposal'),
      reducedMotion ? 0 : 1600,
    );
    return () => window.clearTimeout(timer);
  }, [phase, reducedMotion]);

  const resetExperience = useCallback(() => {
    reset();
    setOpenId(null);
    setResponse(null);
    setPhase('field');
    setExperienceReady(true);
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.field-viewport')?.focus();
    });
  }, [reset]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.shiftKey && event.altKey && event.key.toLowerCase() === 'r') {
        resetExperience();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [resetExperience]);

  const handleCollect = (id: string) => {
    discover(id);
    setOpenId(id);
  };

  const handleCloseCard = () => {
    setOpenId(null);
    const nextPhase = phaseAfterCardClose(phase, allFound);
    if (nextPhase !== phase) {
      setPhase(nextPhase);
      return;
    }
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>('.field-viewport')?.focus();
    });
  };

  const openFlower = openId
    ? FLOWERS.find((flower) => flower.id === openId) ?? null
    : null;
  const openIndex = openId
    ? FLOWERS.findIndex((flower) => flower.id === openId) + 1
    : 0;
  const announcement = openFlower
    ? COPY.card.openedAnnouncement.replace('{title}', openFlower.title)
    : phase === 'transition'
      ? COPY.field.transitionAnnouncement
      : '';

  if (!experienceReady) {
    return <div className="app-loading" aria-label="Preparing the meadow" />;
  }

  const fieldActive = phase === 'field' || phase === 'transition';
  const proposalShown = phase === 'proposal';

  return (
    <>
      {fieldActive ? (
        <>
          <FieldExperience
            flowers={FLOWERS}
            discovered={validDiscovered}
            paused={!!openFlower}
            transitioning={phase === 'transition'}
            reducedMotion={reducedMotion}
            onCollect={handleCollect}
          />
          {openFlower && phase === 'field' && (
            <MessageCard
              flower={openFlower}
              index={openIndex}
              total={total}
              onClose={handleCloseCard}
              presentation="overlay"
              inertSelectors=".field-shell"
            />
          )}
        </>
      ) : (
        <>
          <Background dimmed={proposalShown} />
          <PetalEffect
            mode={response === 'yes' ? 'burst' : 'ambient'}
            reducedMotion={reducedMotion}
          />
          <main className="app app--final">
            <Intro hidden={proposalShown} />
            <div className={`app__final-stage${proposalShown ? ' app__final-stage--proposal' : ''}`}>
              <div className="app__bouquet-col">
                <Bouquet
                  flowers={FLOWERS}
                  discovered={new Set(FLOWERS.map((flower) => flower.id))}
                  completed
                  interactive={false}
                  reducedMotion={reducedMotion}
                />
                <ProgressTag discovered={total} total={total} completed />
              </div>
              <div className="app__proposal-slot">
                {proposalShown && (
                  <FinalProposal response={response} onRespond={setResponse} />
                )}
              </div>
            </div>
          </main>
        </>
      )}

      {import.meta.env.DEV && (
        <button
          type="button"
          className="app__dev-reset"
          onClick={resetExperience}
          title="Reset the experience (dev only)"
          aria-label="Reset the experience"
        >
          ↺
        </button>
      )}

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>
    </>
  );
}
