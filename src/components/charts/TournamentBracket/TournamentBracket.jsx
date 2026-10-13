'use client';

import { motion } from 'framer-motion';
import { cn } from '../../../utilities/cn/index.js';
import { useElementSize } from '../../../hooks/layout/use-element-size.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import Button from '../../core/Button/index.js';
import Icon from '../../core/Icon/index.js';
import EmptyState from '../../core/EmptyState/index.js';
import { motion as motionTokens } from '../../../tokens/index.js';
import { bracketError, bracketWindow } from './bracketModel.js';

// Framer Motion takes seconds and a bezier array; the motion tokens are CSS strings.
const bracketTransition = {
  duration: parseFloat(motionTokens.duration.overlay) / 1000,
  ease: motionTokens.ease.out.match(/[\d.]+/g).map(Number)
};

const defaultLabels = {
  previous: 'Previous round', next: 'Next round', empty: 'No matches to display',
  invalid: 'Bracket unavailable', invalidDescription: 'Each round needs unique IDs and half as many matches as the previous round, ending in one final.',
  tbd: 'To be decided', winner: 'Winner', completed: 'Completed', live: 'Live', upcoming: 'Upcoming',
  penalties: 'penalties', versus: 'versus'
};

function MatchSide({ side, winner, labels }) {
  return (
    <span className='ds-bracket-side' data-winner={winner || undefined}>
      {side?.seed != null && <span className='text-xs text-text-muted tabular-nums'>{side.seed}</span>}
      <span className='min-w-0 flex-1 wrap-anywhere'>{side?.name ?? labels.tbd}</span>
      {winner && <Icon name='Check' decorative className='size-3.5 text-ui-primary' />}
      {winner && <span className='sr-only'>{labels.winner}</span>}
      <span className='shrink-0 tabular-nums'>
        {side?.score ?? '—'}
        {side?.penalties != null && <><span className='sr-only'> {labels.penalties} </span><span className='ms-1 text-xs text-text-muted'>({side.penalties})</span></>}
      </span>
    </span>
  );
}

function MatchCard({ match, labels, onMatchClick, disabled }) {
  const content = <>
    <span className='ds-bracket-meta'>
      <span>{match.label}</span>
      <span data-live={match.status === 'live' || undefined}>{labels[match.status] ?? match.status}</span>
    </span>
    <MatchSide side={match.home} winner={match.winner === 'home'} labels={labels} />
    <MatchSide side={match.away} winner={match.winner === 'away'} labels={labels} />
  </>;
  return onMatchClick ? (
    <Button variant='ghost' className='ds-bracket-card' disabled={disabled} onClick={() => onMatchClick(match)}>
      {content}
    </Button>
  ) : <div className='ds-bracket-card'>{content}</div>;
}

/** A responsive knockout bracket. Match results and advancement remain application-owned. */
export function TournamentBracket({ rounds = [], label = 'Tournament bracket', round, defaultRound = 0, onRoundChange, onMatchClick, disabled = false, labels: suppliedLabels, className, ...props }) {
  const [ref, { width }] = useElementSize();
  const reducedMotion = usePrefersReducedMotion();
  const [requestedRound, setRound] = useControllableState({ value: round, defaultValue: defaultRound, onChange: onRoundChange });
  const labels = { ...defaultLabels, ...suppliedLabels };
  const invalid = bracketError(rounds);
  const { start, end, last } = bracketWindow(invalid ? 0 : rounds.length, width, requestedRound);
  const visible = invalid ? [] : rounds.slice(start, end);
  const firstCount = visible[0]?.matches.length || 1;
  const transition = reducedMotion ? { duration: 0 } : bracketTransition;

  return (
    <div {...props} ref={ref} className={cn('ds-bracket', className)} role='region' aria-label={label} data-slot='tournament-bracket'>
      {invalid || !rounds.length ? (
        <EmptyState compact title={invalid ? labels.invalid : labels.empty} description={invalid ? labels.invalidDescription : undefined} />
      ) : <>
        <div className='ds-bracket-nav'>
          <span className='min-w-0 text-sm font-medium wrap-anywhere' aria-live='polite' aria-atomic='true'>
            {visible.map((item) => item.name).join(' · ')}
          </span>
          <div className='flex shrink-0 gap-1'>
            <Button variant='outline' size='icon' aria-label={labels.previous} disabled={disabled || start === 0} onClick={() => setRound(start - 1)}><Icon name='ChevronLeft' decorative /></Button>
            <Button variant='outline' size='icon' aria-label={labels.next} disabled={disabled || start === last} onClick={() => setRound(start + 1)}><Icon name='ChevronRight' decorative /></Button>
          </div>
        </div>
        <div className='ds-bracket-grid' style={{ gridTemplateColumns: `repeat(${visible.length}, minmax(0, 1fr))`, gridTemplateRows: `auto repeat(${firstCount}, minmax(calc(var(--ds-space-scale, 1) * 9rem), 1fr))` }}>
          {visible.map((item, column) => [
            <div key={item.id} className='ds-bracket-heading' style={{ gridColumn: column + 1, gridRow: 1 }}>{item.name}</div>,
            ...item.matches.map((match, index) => {
              const span = 2 ** column;
              return (
                <motion.div key={match.id} layout transition={transition} className='ds-bracket-slot' data-slot='bracket-match' data-match-id={match.id} role='group' aria-label={`${item.name}: ${match.home?.name ?? labels.tbd} ${labels.versus} ${match.away?.name ?? labels.tbd}`} style={{ gridColumn: column + 1, gridRow: `${2 + index * span} / span ${span}` }}>
                  <MatchCard match={match} labels={labels} onMatchClick={onMatchClick} disabled={disabled} />
                  {column < visible.length - 1 && (
                    <svg className='ds-bracket-connector' viewBox='0 0 100 100' preserveAspectRatio='none' aria-hidden='true'>
                      <path d={`M 0 50 H 50 V ${index % 2 === 0 ? 100 : 0} H 100`} vectorEffect='non-scaling-stroke' />
                    </svg>
                  )}
                </motion.div>
              );
            })
          ])}
        </div>
      </>}
    </div>
  );
}
