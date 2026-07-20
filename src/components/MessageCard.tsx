import { useEffect, useRef, useState } from 'react';
import type { FlowerMessage } from '../data/types';
import { Lily } from './Lily';
import { COPY } from '../data/flowers';
import './MessageCard.css';

/**
 * A message card for one flower. On large screens it appears beside the bouquet;
 * on small screens it appears as a bottom sheet overlay with a scrim.
 *
 * Accessibility:
 *  - rendered as a role="dialog" with aria-labelledby
 *  - focus moves to the close button on open and returns to the flower on close
 *  - Escape closes it
 *  - mobile Tab focus is constrained within the modal bottom sheet
 *  - the desktop side panel remains non-modal so flowers stay selectable
 *  - the open is announced via an aria-live region in App
 */
export function MessageCard({
  flower,
  index,
  total,
  onClose,
  presentation = 'responsive',
  inertSelectors = '.intro, .app__bouquet-col, .app__dev-reset',
}: {
  flower: FlowerMessage;
  index: number;
  total: number;
  onClose: () => void;
  presentation?: 'responsive' | 'overlay';
  inertSelectors?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [isMobileModal, setIsMobileModal] = useState(() =>
    window.matchMedia('(max-width: 899px)').matches,
  );
  const isModal = presentation === 'overlay' || isMobileModal;

  // The bottom sheet is modal on mobile. The desktop side panel remains
  // non-modal so another flower can be selected without closing it first.
  useEffect(() => {
    const query = window.matchMedia('(max-width: 899px)');
    const onChange = () => setIsMobileModal(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!isModal) return;

    const background = document.querySelectorAll<HTMLElement>(
      inertSelectors,
    );
    background.forEach((element) => element.setAttribute('inert', ''));

    return () => {
      background.forEach((element) => element.removeAttribute('inert'));
    };
  }, [inertSelectors, isModal]);

  // Focus the card on open for keyboard + screen-reader users.
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Escape to close.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isModal && e.key === 'Tab') {
      // The close button is the sheet's only interactive control.
      e.preventDefault();
      closeBtnRef.current?.focus();
    }
  };

  return (
    <div
      className={`mc-overlay${presentation === 'overlay' ? ' mc-overlay--always' : ''}`}
      onClick={onClose}
    >
      <div
        className="mc"
        role="dialog"
        aria-modal={isModal}
        aria-labelledby="mc-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
        style={
          {
            ['--mc-primary']: flower.colors.primary,
            ['--mc-secondary']: flower.colors.secondary,
          } as React.CSSProperties
        }
      >
        <div className="mc__icon" aria-hidden="true">
          <svg viewBox="-27 -27 54 54" width="76" height="76">
            <Lily colors={flower.colors} bloomed revealProgress={1} />
          </svg>
        </div>

        <div className="mc__number" aria-hidden="true">
          {index} / {total}
        </div>

        <h2 id="mc-title" className="mc__title">
          {flower.title}
        </h2>

        <p className="mc__body">{flower.message}</p>

        <button
          ref={closeBtnRef}
          type="button"
          className="mc__close"
          onClick={onClose}
          aria-label={COPY.card.closeLabel}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}
