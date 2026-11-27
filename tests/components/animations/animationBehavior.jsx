import { StrictMode, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { expect } from 'storybook/test';
import { act } from '../../support/reactAct.js';
import { animationProbeStep, waitForAnimationState } from './animationProbeStep.js';
import { CipherReveal, GlyphInspector, PhraseCycle, ReelText, Typewriter, WarpText, WordSpotlight } from '../../../src/components/animations/index.js';

// Browser promises (fonts, observers, renderers) can update state immediately after commit.
function ActMicrotaskProbe() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let current = true;
    Promise.resolve().then(() => { if (current) setReady(true); });
    return () => { current = false; };
  }, []);
  return <span>{ready ? 'Microtask settled' : 'Pending microtask'}</span>;
}

/** Real-browser lifecycle checks; temporary roots never enter copied examples. */
export async function checkAnimationBehavior(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:fixed;top:0;left:0;width:320px;z-index:1000;background:white;color:black;font-size:36px';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const render = (Component, props = {}) => flushSync(() => root.render(<StrictMode><Component {...props} /></StrictMode>));
  const originalMatchMedia = window.matchMedia;
  const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
  try {
    const errors = [];
    const originalError = console.error;
    console.error = (...args) => {
      if (args.some(value => String(value).includes('ActMicrotaskProbe'))) errors.push(args.map(String).join(' '));
      originalError.apply(console, args);
    };
    try {
      await animationProbeStep('React microtask after commit', () => act(() => root.render(<StrictMode><ActMicrotaskProbe /></StrictMode>)));
      expect(sandbox.textContent).toBe('Microtask settled');
      expect(errors, 'promise updates after commit stay inside the awaited act scope').toEqual([]);
    } finally {
      console.error = originalError;
    }

    render(Typewriter, { texts: ['ABC'], typeDelay: 16, eraseDelay: 16, holdDelay: 100, repeat: false });
    await waitForAnimationState(sandbox, 'first typewriter text', () => expect(sandbox.querySelector('.gaudi-typewriter__value').textContent).toBe('ABC|'));
    render(Typewriter, { texts: ['New'], typeDelay: 16, repeat: false });
    await waitForAnimationState(sandbox, 'updated typewriter text', () => expect(sandbox.querySelector('.gaudi-typewriter__value').textContent).toBe('New|'));

    render(CipherReveal, { text: 'Ready', duration: 100 });
    await waitForAnimationState(sandbox, 'cipher revealed', () => expect(sandbox.querySelector('[data-slot]').dataset.animated).toBe('false'));
    expect(sandbox.querySelector('[aria-hidden]').textContent).toBe('Ready');

    render(PhraseCycle, { texts: ['First', 'Next'], interval: 700 });
    await waitForAnimationState(sandbox, 'phrase advanced', () => expect(sandbox.querySelector('.gaudi-phrase-cycle__value').textContent).toBe('Next'));
    render(PhraseCycle, { texts: ['Only'], interval: 700 });
    expect(sandbox.querySelector('.gaudi-phrase-cycle__value').textContent).toBe('Only');

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    flushSync(() => document.dispatchEvent(new Event('visibilitychange')));
    await waitForAnimationState(sandbox, 'hidden document stops phrase', () => expect(sandbox.querySelector('[data-slot]').dataset.animated).toBe('false'));
    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    else delete document.visibilityState;
    flushSync(() => document.dispatchEvent(new Event('visibilitychange')));

    const media = { matches: true, addEventListener() {}, removeEventListener() {} };
    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? media : originalMatchMedia.call(window, query);
    // Background owners check reduced motion on their own mounted surfaces.
    for (const [name, Component] of Object.entries({ CipherReveal, GlyphInspector, PhraseCycle, ReelText, Typewriter, WarpText, WordSpotlight })) {
      render(Component, { text: 'Readable', texts: ['Readable'] });
      await waitForAnimationState(sandbox, `${name} reduced motion`, () => expect(sandbox.querySelector('[data-animated]')?.dataset.animated, `${name} honors reduced motion`).toBe('false'));
    }
    render(Typewriter, { texts: ['Readable'] });
    expect(sandbox.querySelector('.gaudi-typewriter__value').textContent).toBe('Readable|');
  } finally {
    window.matchMedia = originalMatchMedia;
    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    else delete document.visibilityState;
    document.dispatchEvent(new Event('visibilitychange'));
    root.unmount();
    sandbox.remove();
  }
}
