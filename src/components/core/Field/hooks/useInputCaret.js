'use client';

import { useRef, useState } from 'react';
import { useInputCaretMode } from '../../../../context/InputConfig.jsx';
import { usePrefersReducedMotion } from '../../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useIsomorphicLayoutEffect } from '../../../../hooks/state/use-isomorphic-layout-effect.js';
import { useMergedRefs } from '../../../../hooks/state/use-merged-refs.js';
import { attachInputCaret } from './inputCaretController.js';

export function useInputCaret(caretMode, forwardedRef) {
  const mode = useInputCaretMode(caretMode);
  const reducedMotion = usePrefersReducedMotion();
  const [input, setInput] = useState(null);
  const controller = useRef(null);
  const ref = useMergedRefs(forwardedRef, setInput);
  useIsomorphicLayoutEffect(() => {
    if (mode !== 'smooth' || reducedMotion || !input?.matches?.('input, textarea')) return;
    const attached = attachInputCaret(input);
    controller.current = attached;
    return () => { attached.destroy(); controller.current = null; };
  }, [input, mode, reducedMotion]);
  useIsomorphicLayoutEffect(() => { controller.current?.update(); });
  return ref;
}
