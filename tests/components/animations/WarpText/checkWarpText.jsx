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
    // Each optical control changes the same input mask at the same phase and pointer.
    const opticalBase = { hover: 1, ambient: .08, time: 1.2, ripple: 1, refraction: .02 };
    const optical = sample(opticalBase);
    for (const [control, value] of Object.entries({ ambient: .2, scale: 3, radius: .25, strength: .2, ripple: 0, refraction: .05, time: 2.4 })) {
      expect(changed(optical, sample({ ...opticalBase, [control]: value })), `${control} changes independent pixels`).toBeGreaterThan(100);
    }
  } finally {
    const gl = canvas.getContext('webgl');
    const supportsRelease = Boolean(gl.getExtension('WEBGL_lose_context'));
    renderer.dispose();
    if (supportsRelease) expect(gl.isContextLost(), 'disposed detached WarpText renderer releases its WebGL context').toBe(true);
  }
}

export async function checkWarpText(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'width:320px;max-width:100%;font-size:72px;font-weight:700';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const themeStyle = document.createElement('style');
  sandbox.dataset.warpThemeProbe = '';
  themeStyle.textContent = '[data-warp-theme-probe][data-palette=warm] { color: rgb(255, 0, 0); } [data-warp-theme-probe][data-palette=cool] { color: rgb(0, 255, 0); }';
  canvasElement.append(themeStyle);
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
    const gl = effect.querySelector('canvas').getContext('webgl');
    const uniform = name => { const program = gl.getParameter(gl.CURRENT_PROGRAM); return gl.getUniform(program, gl.getUniformLocation(program, name)); };
    const controls = { warpStrength: ['ambient', .2], warpScale: ['scale', 3], pointerRadius: ['radius', .25], pointerStrength: ['strength', .8], refraction: ['refraction', .05], ripple: ['ripple', false] };
    for (const [prop, [name, value]] of Object.entries(controls)) {
      await render({ [prop]: value });
      await waitFor(() => expect(uniform(name), prop).toBeCloseTo(Number(value), 4));
    }
    await render({ warpStrength: .08, speed: 0 });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const zeroTime = uniform('time');
    await new Promise(resolve => setTimeout(resolve, 120));
    expect(uniform('time')).toBe(zeroTime);
    await render({ warpStrength: .08, speed: 2 });
    await waitFor(() => expect(uniform('time')).toBeGreaterThan(zeroTime));
    const { commands } = await import('vitest/browser');
    await commands.recordStoryAudit({ id: 'warp-text-independent-controls', theme: 'light', checks: [
      ...Object.keys(controls).map(control => ({ control, evidence: 'public prop updates shader uniform; corresponding optical term independently changes real pixels at fixed phase/input' })),
      { control: 'speed', evidence: 'zero speed freezes shader clock; speed 2 advances it; time changes real pixels' },
      { control: 'text', evidence: 'existing multiline/empty checks verify updated text mask and fallback' },
      { control: 'paused', evidence: 'existing pause/reduced-motion tests stop animation and hover; readable fallback survives context loss' }
    ] });
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
    // A paused mask must refresh for a scoped custom theme selector without reallocating its canvas.
    const textCanvas = effect.querySelector('canvas');
    const texImageDescriptor = Object.getOwnPropertyDescriptor(gl, 'texImage2D');
    const texImage2D = gl.texImage2D;
    let uploadedColor;
    gl.texImage2D = function (...args) {
      const mask = args.at(-1);
      if (mask instanceof HTMLCanvasElement) {
        const pixels = mask.getContext('2d').getImageData(0, 0, mask.width, mask.height).data;
        const offset = pixels.findIndex((value, index) => index % 4 === 3 && value > 200) - 3;
        if (offset >= 0) uploadedColor = Array.from(pixels.slice(offset, offset + 3));
      }
      return texImage2D.apply(this, args);
    };
    try {
      sandbox.dataset.palette = 'warm';
      await waitFor(() => expect(uploadedColor).toEqual([255, 0, 0]));
      sandbox.dataset.palette = 'cool';
      await waitFor(() => expect(uploadedColor).toEqual([0, 255, 0]));
      expect(effect.querySelector('canvas')).toBe(textCanvas);
      expect(effect).toHaveAttribute('data-animated', 'false');
    } finally {
      if (texImageDescriptor) Object.defineProperty(gl, 'texImage2D', texImageDescriptor);
      else delete gl.texImage2D;
      delete sandbox.dataset.palette;
    }
    // The HTML fallback survives a lost GPU context.
    const contextLifecycle = gl.getExtension('WEBGL_lose_context');
    expect(contextLifecycle, 'the browser exposes real WebGL context loss').not.toBeNull();
    await act(async () => {
      const lost = new Promise(resolve => textCanvas.addEventListener('webglcontextlost', resolve, { once: true }));
      contextLifecycle.loseContext();
      await lost;
    });
    expect(gl.isContextLost()).toBe(true);
    await waitFor(() => expect(effect).toHaveAttribute('data-ready', 'false'));
    // A pending size measurement must not recreate a usable renderer while the context is lost.
    await act(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    expect(effect).toHaveAttribute('data-ready', 'false');
    expect(getComputedStyle(effect.querySelector('.gaudi-warp-text__fallback')).visibility).toBe('visible');
    await act(async () => {
      const restored = new Promise(resolve => textCanvas.addEventListener('webglcontextrestored', resolve, { once: true }));
      contextLifecycle.restoreContext();
      await restored;
    });
    expect(gl.isContextLost()).toBe(false);
    await waitFor(() => expect(effect).toHaveAttribute('data-ready', 'true'));
    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? { matches: true, addEventListener() {}, removeEventListener() {} } : original.call(window, query);
    await act(() => root.render(null));
    await render({});
    await waitFor(() => expect(sandbox.querySelector('[data-slot="warp-text"]')).toHaveAttribute('data-animated', 'false'));
    await render({ text: '' });
    expect(sandbox.querySelector('.sr-only').textContent).toBe('');
  } finally {
    window.matchMedia = original;
    await act(() => root.unmount()); sandbox.remove(); themeStyle.remove();
  }
}
