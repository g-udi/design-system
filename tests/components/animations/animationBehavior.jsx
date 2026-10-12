import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { act } from '../../support/reactAct.js';
import * as animations from '../../../src/components/animations/index.js';

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
  const render = (Component, props = {}) => act(() => root.render(<StrictMode><Component {...props} /></StrictMode>));
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
      await render(ActMicrotaskProbe);
      expect(sandbox.textContent).toBe('Microtask settled');
      expect(errors, 'promise updates after commit stay inside the awaited act scope').toEqual([]);
    } finally {
      console.error = originalError;
    }

    await render(animations.Typewriter, { texts: ['ABC'], typeDelay: 16, eraseDelay: 16, holdDelay: 100, repeat: false });
    await waitFor(() => expect(sandbox.querySelector('.gaudi-typewriter__value').textContent).toBe('ABC|'));
    await render(animations.Typewriter, { texts: ['New'], typeDelay: 16, repeat: false });
    await waitFor(() => expect(sandbox.querySelector('.gaudi-typewriter__value').textContent).toBe('New|'));

    await render(animations.CipherReveal, { text: 'Ready', duration: 100 });
    await waitFor(() => expect(sandbox.querySelector('[data-slot]').dataset.animated).toBe('false'));
    expect(sandbox.querySelector('[aria-hidden]').textContent).toBe('Ready');

    await render(animations.PhraseCycle, { texts: ['First', 'Next'], interval: 700 });
    await waitFor(() => expect(sandbox.querySelector('.gaudi-phrase-cycle__value').textContent).toBe('Next'), { timeout: 2500 });
    await render(animations.PhraseCycle, { texts: ['Only'], interval: 700 });
    expect(sandbox.querySelector('.gaudi-phrase-cycle__value').textContent).toBe('Only');

    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    await act(() => document.dispatchEvent(new Event('visibilitychange')));
    await waitFor(() => expect(sandbox.querySelector('[data-slot]').dataset.animated).toBe('false'));
    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    else delete document.visibilityState;
    await act(() => document.dispatchEvent(new Event('visibilitychange')));

    const media = { matches: true, addEventListener() {}, removeEventListener() {} };
    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? media : originalMatchMedia.call(window, query);
    for (const [name, Component] of Object.entries(animations)) {
      await render(Component, { text: 'Readable', texts: ['Readable'] });
      await waitFor(() => expect(sandbox.querySelector('[data-animated]')?.dataset.animated, `${name} honors reduced motion`).toBe('false'));
    }
    await render(animations.Typewriter, { texts: ['Readable'] });
    expect(sandbox.querySelector('.gaudi-typewriter__value').textContent).toBe('Readable|');
  } finally {
    window.matchMedia = originalMatchMedia;
    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    else delete document.visibilityState;
    document.dispatchEvent(new Event('visibilitychange'));
    await act(() => root.unmount());
    sandbox.remove();
  }
}
