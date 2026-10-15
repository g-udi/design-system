'use client';
import { forwardRef, useEffect, useState } from 'react';
import { useAnimation, bounded, characters } from '../animationRuntime.js';
import { cn } from '../../../utilities/cn';

const DIGITS = Array.from('0123456789');

/** One digit reel: a 0–9 strip translated to its digit. */
function Reel({ digit, order }) {
  return <span className="gaudi-reel-text__reel" aria-hidden="true">
    <span className="gaudi-reel-text__strip" style={{ '--reel-digit': digit, '--reel-order': order }}>
      {DIGITS.map(value => <span key={value}>{value}</span>)}
    </span>
  </span>;
}

/**
 * A formatted value whose digits spin into place on slot-machine reels, landing left to right.
 * Separators, signs and letters stay fixed; characters match from the end so 999 → 1,000 spins
 * only digits. The first paint rolls up from zero. Reduced motion, `paused`, hidden tabs and
 * offscreen containers swap the value without motion. The whole value is one accessible label.
 */
export const ReelText = forwardRef(function ReelText({ value = '', duration = 900, stagger = 70, paused = false, className, style, ...props }, forwardedRef) {
  const { ref, active } = useAnimation(paused, forwardedRef);
  const text = String(value ?? '');
  const glyphs = characters(text);
  // Reels start at zero for the first paint, then roll to the value.
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  let order = 0;
  return <span {...props} ref={ref} role="img" aria-label={text} data-slot="reel-text" data-animated={active}
    className={cn('gaudi-reel-text', className)}
    style={{ '--reel-duration': `${bounded(duration, 900, 0, 4000)}ms`, '--reel-stagger': `${bounded(stagger, 70, 0, 400)}ms`, ...style }}>
    {glyphs.map((glyph, index) => {
      const fromEnd = glyphs.length - index;
      return /\d/.test(glyph)
        ? <Reel key={`digit-${fromEnd}`} digit={settled || !active ? Number(glyph) : 0} order={order++} />
        : <span key={`glyph-${fromEnd}-${glyph}`} aria-hidden="true">{glyph}</span>;
    })}
  </span>;
});
export default ReelText;
