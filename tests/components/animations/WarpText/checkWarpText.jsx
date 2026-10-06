import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { WarpText } from '../../../../src/components/animations/WarpText/index.js';
import { createWarpRenderer, createWarpTextMask } from '../../../../src/components/animations/WarpText/warpRenderer.js';

function checkLensPixels(host) {
  const canvas = document.createElement('canvas');
  const renderer = createWarpRenderer(canvas);
  expect(renderer).not.toBeNull();
  try {
    renderer.upload(createWarpTextMask(host, 'Bend me', 320, 160));
    const gl = canvas.getContext('webgl');
    const sample = overrides => {
      renderer.draw({ x: .45, y: .5, aspect: 2, time: 0, ambient: 0, scale: 1.7, radius: .6, strength: .8, hover: 0, ripple: 0, refraction: 0, ...overrides });
      const pixels = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      return pixels;
    };
    const resting = sample({});
    const hovering = sample({ hover: 1 });
    const moved = sample({ hover: 1, x: .7 });
    const changed = (a, b) => a.reduce((count, value, index) => count + Number(value !== b[index]), 0);
    expect(resting.some((value, index) => index % 4 === 3 && value > 0)).toBe(true);
    expect(changed(resting, hovering)).toBeGreaterThan(100);
    expect(changed(hovering, moved)).toBeGreaterThan(100);
    expect(changed(resting, sample({}))).toBe(0);
  } finally { renderer.dispose(); }
}

export async function checkWarpText(canvasElement) {
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'width:320px;max-width:100%;font-size:72px;font-weight:700';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const original = window.matchMedia;
  const render = props => act(() => root.render(<StrictMode><WarpText text="Move me" warpStrength={0} {...props} /></StrictMode>));
  try {
    checkLensPixels(sandbox);
    await render({});
    const effect = sandbox.querySelector('[data-slot="warp-text"]');
    await waitFor(() => expect(effect).toHaveAttribute('data-ready', 'true'));
    await userEvent.hover(effect);
    await waitFor(() => expect(effect).toHaveAttribute('data-hovered', 'true'));
    await userEvent.unhover(effect);
    await waitFor(() => expect(effect).toHaveAttribute('data-hovered', 'false'));
    // Touch scroll must not latch the decorative mouse lens.
    await act(() => effect.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType: 'touch' })));
    expect(effect).toHaveAttribute('data-hovered', 'false');
    await render({ paused: true, text: 'Long text\nthat stays readable' });
    await userEvent.hover(effect);
    expect(effect).toHaveAttribute('data-animated', 'false');
    expect(effect).toHaveAttribute('data-hovered', 'false');
    expect(effect.querySelector('.sr-only').textContent).toBe('Long text\nthat stays readable');
    for (const density of [.75, .875, 1, 1.25, 1.5]) {
      await render({ paused: true, style: { '--ds-space-scale': density } });
      expect(sandbox.scrollWidth).toBeLessThanOrEqual(sandbox.clientWidth + 1);
    }
    // The HTML fallback survives a lost GPU context.
    await act(() => effect.querySelector('canvas').dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
    expect(effect).toHaveAttribute('data-ready', 'false');
    expect(getComputedStyle(effect.querySelector('.gaudi-warp-text__fallback')).visibility).toBe('visible');
    await act(() => effect.querySelector('canvas').dispatchEvent(new Event('webglcontextrestored')));
    await waitFor(() => expect(effect).toHaveAttribute('data-ready', 'true'));
    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true, addEventListener() {}, removeEventListener() {} } : original.call(window, query);
    await act(() => root.render(null));
    await render({});
    await waitFor(() => expect(sandbox.querySelector('[data-slot="warp-text"]')).toHaveAttribute('data-animated', 'false'));
    await render({ text: '' });
    expect(sandbox.querySelector('.sr-only').textContent).toBe('');
  } finally {
    window.matchMedia = original;
    await act(() => root.unmount()); sandbox.remove();
  }
}
