'use client';
import { forwardRef, useState } from 'react';
import { useInterval } from '../../../hooks/state/use-interval.js';
import { useAnimation, bounded } from '../animationRuntime.js';
const defaults = ['thoughtfully', 'boldly', 'together'];
export const PhraseCycle = forwardRef(function PhraseCycle({ texts = defaults, interval = 2200, direction = 'up', paused = false, className = '', ...props }, forwardedRef) {
  const { ref, active, reduced } = useAnimation(paused, forwardedRef);
  const phrases = Array.isArray(texts) ? texts.map(String) : [String(texts ?? '')];
  const [index, setIndex] = useState(0);
  useInterval(() => setIndex(i => (i + 1) % Math.max(1, phrases.length)), active && phrases.length > 1 ? bounded(interval, 2200, 700, 30000) : null);
  const selected = reduced ? 0 : index % Math.max(1, phrases.length);
  return <span {...props} ref={ref} className={`gaudi-phrase-cycle ${className}`} data-slot="phrase-cycle" data-direction={direction} data-animated={active}>
    <span className="sr-only">{phrases.join(', ')}</span><span aria-hidden="true" className="gaudi-phrase-cycle__layout">{phrases.map((text, i) => <span key={i} className="gaudi-phrase-cycle__measure">{text}</span>)}<span className="gaudi-phrase-cycle__value" key={`${selected}-${phrases[selected]}`}>{phrases[selected]}</span></span>
  </span>;
});
export default PhraseCycle;
