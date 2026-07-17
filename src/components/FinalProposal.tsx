import { useEffect, useRef } from 'react';
import { COPY } from '../data/flowers';
import './FinalProposal.css';

export type ProposalResponse = 'yes' | 'talk' | null;

/**
 * The final proposal card, revealed after the whole bouquet has bloomed. Shows
 * a gentle lead-in, the question, a subline, and two equally valid response
 * buttons. No "No" button that runs away — both options are honest and kind.
 */
export function FinalProposal({
  response,
  onRespond,
}: {
  response: ProposalResponse;
  onRespond: (r: 'yes' | 'talk') => void;
}) {
  const questionRef = useRef<HTMLHeadingElement>(null);
  const responseRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    questionRef.current?.focus();
  }, []);

  useEffect(() => {
    if (response) responseRef.current?.focus();
  }, [response]);

  return (
    <div
      className={`fp${response ? ' fp--answered' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="fp-question"
    >
      <p className="fp__leadin">{COPY.proposal.leadIn}</p>
      <h2
        id="fp-question"
        className="fp__question"
        ref={questionRef}
        tabIndex={-1}
      >
        {COPY.proposal.question}
      </h2>
      <p className="fp__subline">{COPY.proposal.subline}</p>

      {response === null ? (
        <div className="fp__actions">
          <button
            type="button"
            className="fp__btn fp__btn--yes"
            onClick={() => onRespond('yes')}
          >
            {COPY.proposal.yesLabel}
          </button>
          <button
            type="button"
            className="fp__btn fp__btn--talk"
            onClick={() => onRespond('talk')}
          >
            {COPY.proposal.talkLabel}
          </button>
        </div>
      ) : (
        <p
          className="fp__response"
          key={response}
          ref={responseRef}
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          {response === 'yes' ? COPY.response.yes : COPY.response.talk}
        </p>
      )}
    </div>
  );
}
