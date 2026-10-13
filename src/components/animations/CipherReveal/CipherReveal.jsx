'use client';
import { forwardRef, useEffect, useState } from 'react';
import { useInterval } from '../../../hooks/state/use-interval.js';
import { useAnimation, bounded, characters } from '../animationRuntime.js';
import { cn } from '../../../utilities/cn';
export const CipherReveal = forwardRef(function CipherReveal({ text = 'Ideas into interfaces', duration = 1200, direction = 'start', trigger = 'view', characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', paused = false, className, onPointerEnter, onFocus, ...props }, forwardedRef) {
  const { ref, active } = useAnimation(paused, forwardedRef);
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(1);
  const [tick, setTick] = useState(0);
  const [start, setStart] = useState(null);
  const running = active && !(trigger === 'hover' && !run);
  useEffect(() => {
    setStart(running ? performance.now() : null);
    setProgress(running ? 0 : 1);
  }, [running, text, duration, run]);
  useInterval(() => {
    setProgress(Math.min(1, (performance.now() - start) / bounded(duration, 1200, 100, 10000)));
    setTick(i => i + 1);
  }, running && start !== null && progress < 1 ? 50 : null);
  const glyphs = characters(text);
  const alphabet = characters(characterSet || '01');
  const replay = () => { if (active) setRun(i => i + 1); };
  return <span {...props} ref={ref} className={cn('gaudi-cipher-reveal', className)} data-slot="cipher-reveal" data-animated={active && progress < 1} onPointerEnter={event => { onPointerEnter?.(event); replay(); }} onFocus={event => { onFocus?.(event); replay(); }}>
    <span className="sr-only">{text}</span><span aria-hidden="true">{glyphs.map((letter, i) => {
      const rank = direction === 'end' ? glyphs.length - i - 1 : direction === 'center' ? Math.abs(i - (glyphs.length - 1) / 2) * 2 : i;
      const revealed = progress >= 1 || rank < progress * glyphs.length || /\s/.test(letter);
      return <span key={i} className={revealed ? undefined : 'gaudi-cipher-reveal__cipher'}>{revealed ? letter : alphabet[(i * 7 + tick * 13) % alphabet.length]}</span>;
    })}</span>
  </span>;
});
export default CipherReveal;
