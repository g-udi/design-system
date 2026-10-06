import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { GlyphInspector } from '../../../../src/components/animations/GlyphInspector/index.js';

export async function checkPausedGlyphInspector(canvasElement) {
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:fixed;top:0;left:0;width:320px;font-size:72px;background:var(--ds-color-surface);z-index:1000';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const render = props => act(() => root.render(<StrictMode><GlyphInspector text="Gaudi" paused {...props} /></StrictMode>));
  const inspected = () => sandbox.querySelector('[data-focused="true"] .gaudi-glyph-inspector__fill')?.textContent;
  const frame = () => sandbox.querySelector('[data-slot="glyph-inspector-frame"]');
  const originalMatchMedia = window.matchMedia;
  try {
    await render({ activeIndex: 2, interval: 200 });
    await waitFor(() => expect(inspected()).toBe('u'));
    expect(frame()).toBeVisible();
    expect(sandbox.querySelector('.gaudi-glyph-inspector__readout').textContent).toContain('U+0075');
    expect(sandbox.querySelectorAll('[data-draggable="true"]')).toHaveLength(0);
    await userEvent.hover(sandbox.querySelector('.gaudi-glyph-inspector__letter'));
    await new Promise(resolve => setTimeout(resolve, 450));
    expect(inspected()).toBe('u');
    expect(sandbox.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running')).toHaveLength(0);
    for (const activeIndex of [-1, 5, 100, 1.5, NaN, Infinity]) {
      await render({ autoplay: false, activeIndex });
      await waitFor(() => expect(inspected()).toBe('G'));
    }
    await render({ text: 'A😀B', activeIndex: 1 });
    await waitFor(() => expect(inspected()).toBe('😀'));
    await render({ activeIndex: 4 });
    await waitFor(() => expect(inspected()).toBe('i'));
    await render({ text: 'Hi', activeIndex: 4 });
    await waitFor(() => expect(inspected()).toBe('H'));
    await render({ text: '', activeIndex: 4 });
    expect(frame()).not.toBeInTheDocument();
    await render({ text: ' A', activeIndex: -1 });
    await waitFor(() => expect(inspected()).toBe(' '));
    await render({ paused: false, interval: 200 });
    await waitFor(() => expect(sandbox.querySelector('[data-slot="glyph-inspector"]')).toHaveAttribute('data-animated', 'true'));
    await render({ activeIndex: 1 });
    await waitFor(() => expect(inspected()).toBe('a'));

    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true, addEventListener() {}, removeEventListener() {} } : originalMatchMedia.call(window, query);
    await act(() => root.render(null));
    await render({ activeIndex: 2 });
    await waitFor(() => expect(inspected()).toBe('u'));
    expect(frame()).toBeVisible();
    expect(sandbox.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running')).toHaveLength(0);
  } finally {
    window.matchMedia = originalMatchMedia;
    await act(() => root.unmount());
    sandbox.remove();
  }
}
