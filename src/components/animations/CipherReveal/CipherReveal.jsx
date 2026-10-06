'use client';
import { forwardRef, useEffect, useState } from 'react';
import { useAnimation, bounded, characters } from '../animationRuntime.js';
export const CipherReveal = forwardRef(function CipherReveal({ text = 'Ideas into interfaces', duration = 1200, direction = 'start', trigger = 'view', characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', paused = false, className = '', onPointerEnter, onFocus, ...props }, forwardedRef) {
  const { ref, active } = useAnimation(paused, forwardedRef);
  const [run, setRun] = useState(0);
  const [progress, setProgress] = useState(1);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active || (trigger === 'hover' && !run)) { setProgress(1); return undefined; }
    const start = performance.now();
    setProgress(0);
    const timer = setInterval(() => {
      const next = Math.min(1, (performance.now() - start) / bounded(duration, 1200, 100, 10000));
      setProgress(next); setTick(i => i + 1);
      if (next === 1) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [active, text, duration, run, trigger]);
  const glyphs = characters(text);
  const alphabet = characters(characterSet || '01');
  const replay = () => { if (active) setRun(i => i + 1); };
  return <span {...props} ref={ref} className={`gaudi-cipher-reveal ${className}`} data-slot="cipher-reveal" data-animated={active && progress < 1} onPointerEnter={event => { onPointerEnter?.(event); replay(); }} onFocus={event => { onFocus?.(event); replay(); }}>
    <span className="sr-only">{text}</span><span aria-hidden="true">{glyphs.map((letter, i) => {
      const rank = direction === 'end' ? glyphs.length - i - 1 : direction === 'center' ? Math.abs(i - (glyphs.length - 1) / 2) * 2 : i;
      const revealed = progress >= 1 || rank < progress * glyphs.length || /\s/.test(letter);
      return <span key={i} className={revealed ? undefined : 'gaudi-cipher-reveal__cipher'}>{revealed ? letter : alphabet[(i * 7 + tick * 13) % alphabet.length]}</span>;
    })}</span>
  </span>;
});
export default CipherReveal;
