'use client';
import { forwardRef, useEffect, useMemo, useState } from 'react';
import { useAnimation, bounded, characters } from '../animationRuntime.js';
const defaultTexts = ['Make something memorable.', 'Make it yours.'];
export const Typewriter = forwardRef(function Typewriter({ texts = defaultTexts, typeDelay = 80, eraseDelay = 40, holdDelay = 1600, repeat = true, caret = true, paused = false, className = '', ...props }, forwardedRef) {
  const { ref, active, reduced } = useAnimation(paused, forwardedRef);
  const phrases = Array.isArray(texts) ? texts.map(String) : [String(texts ?? '')];
  const key = JSON.stringify(phrases);
  const [state, setState] = useState({ key, index: 0, length: 0, deleting: false });
  const current = useMemo(() => state.key === key ? state : { key, index: 0, length: 0, deleting: false }, [state, key]);
  const [started, setStarted] = useState(false);
  const phrase = phrases[current.index % Math.max(1, phrases.length)] || '';
  const glyphs = characters(phrase);
  useEffect(() => {
    if (!active || !phrases.length || (!repeat && current.index === phrases.length - 1 && current.length >= glyphs.length)) return undefined;
    setStarted(true);
    const full = current.length >= glyphs.length;
    const delay = full && !current.deleting ? bounded(holdDelay, 1600, 100, 30000) : bounded(current.deleting ? eraseDelay : typeDelay, 80, 16, 3000);
    const timer = setTimeout(() => {
      if (full && !current.deleting) setState({ ...current, deleting: true });
      else if (current.deleting && current.length === 0) setState({ key, index: (current.index + 1) % phrases.length, length: 0, deleting: false });
      else setState({ ...current, length: Math.max(0, current.length + (current.deleting ? -1 : 1)) });
    }, delay);
    return () => clearTimeout(timer);
  }, [active, key, current, glyphs.length, typeDelay, eraseDelay, holdDelay, repeat, phrases.length]);
  return <span {...props} ref={ref} className={`gaudi-typewriter ${className}`} data-slot="typewriter" data-animated={active}>
    <span className="sr-only">{phrases.join(' ')}</span>
    <span className="gaudi-typewriter__layout" aria-hidden="true">{phrases.map((item, i) => <span className="gaudi-typewriter__measure" key={i}>{item}</span>)}<span className="gaudi-typewriter__value">{reduced || !started ? phrase : glyphs.slice(0, current.length).join('')}{caret && <span className="gaudi-typewriter__cursor">|</span>}</span></span>
  </span>;
});
export default Typewriter;
