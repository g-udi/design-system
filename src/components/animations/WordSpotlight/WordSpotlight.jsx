'use client';
import { forwardRef, useState } from 'react';
import { useInterval } from '../../../hooks/state/use-interval.js';
import { useAnimation, bounded } from '../animationRuntime.js';
import { cn } from '../../../utilities/cn';
export const WordSpotlight = forwardRef(function WordSpotlight({ text = 'Focus on what matters', interval = 1800, blur = 4, paused = false, className, style, ...props }, forwardedRef) {
  const { ref, active, reduced } = useAnimation(paused, forwardedRef);
  const words = String(text).split(/\s+/).filter(Boolean);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(null);
  useInterval(() => setIndex(i => (i + 1) % Math.max(1, words.length)), active && hovered === null ? bounded(interval, 1800, 400, 30000) : null);
  return <span {...props} ref={ref} className={cn('gaudi-word-spotlight', className)} data-slot="word-spotlight" data-animated={active} style={{ '--spotlight-blur': `${reduced ? 0 : bounded(blur, 4, 0, 10)}px`, ...style }}>
    <span className="sr-only">{text}</span><span aria-hidden="true" className="gaudi-word-spotlight__words">{words.map((word, i) => <span key={i} className="gaudi-word-spotlight__word" data-focused={reduced || (hovered ?? index) % words.length === i} onPointerEnter={() => setHovered(i)} onPointerLeave={() => setHovered(null)}>{word}<span className="gaudi-word-spotlight__brackets" /></span>)}</span>
  </span>;
});
export default WordSpotlight;
