import { createElement, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, fireEvent, waitFor } from 'storybook/test';
import { act } from '../../support/reactAct.js';

const difference = (a, b) => a.reduce((sum, value, index) => sum + (index % 4 === 3 ? 0 : Math.abs(value - b[index])), 0) / a.length;

/** Measure each control independently, with the same clock and input for both sides. */
export async function checkBackgroundRendering(canvasElement, Component, changedProps = {}, initialProps = {}) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:fixed;top:0;left:0;width:320px;z-index:1000';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const getContext = HTMLCanvasElement.prototype.getContext;
  const requestFrame = window.requestAnimationFrame;
  const cancelFrame = window.cancelAnimationFrame;
  const queue = new Map();
  let frameId = 0;
  let now = 1000;
  let pixels;
  let capturePixels = true;
  let draws = 0;
  const contexts = new Map();
  const results = [];
  let completed = false;
  const defaults = { height: 180, paused: true, speed: 1, intensity: 0.8, background: '#101010', colors: ['#3478fa', '#83d9ff', '#c7b5ff'], ...initialProps };
  const render = props => act(() => root.render(createElement(StrictMode, null, createElement(Component, { ...defaults, ...props }, createElement('span', null, 'Content survives rendering')))));
  const surface = () => sandbox.querySelector('[data-renderer]');
  const step = async (duration = 500) => {
    for (let elapsed = 0; elapsed < duration; elapsed += 100) {
      now += 100;
      capturePixels = elapsed + 100 >= duration;
      const callbacks = [...queue];
      await act(() => { for (const [id, callback] of callbacks) { if (queue.delete(id)) callback(now); } });
    }
    capturePixels = true;
  };
  const fresh = async props => {
    await act(() => root.render(null));
    await render(props);
    await waitFor(() => expect(surface(), sandbox.querySelector('canvas')?.dataset.renderError).toHaveAttribute('data-renderer', 'webgl'));
  };
  const recordDifference = (control, before, after) => {
    const meanChannelDifference = difference(before, after);
    results.push({ control, meanChannelDifference });
    expect(meanChannelDifference, `${Component.displayName || Component.name}: ${control} changes pixels independently`).toBeGreaterThan(0.01);
  };
  try {
    window.requestAnimationFrame = callback => { queue.set(++frameId, callback); return frameId; };
    window.cancelAnimationFrame = id => queue.delete(id);
    HTMLCanvasElement.prototype.getContext = function (kind, ...options) {
      const gl = getContext.call(this, kind, ...options);
      if (kind === 'webgl' && sandbox.contains(this) && gl && !contexts.has(gl)) {
        const descriptor = Object.getOwnPropertyDescriptor(gl, 'drawArrays');
        const drawArrays = gl.drawArrays;
        contexts.set(gl, { descriptor, canRelease: Boolean(gl.getExtension('WEBGL_lose_context')) });
        gl.drawArrays = function (...args) {
          const result = drawArrays.apply(this, args);
          // Simulations can draw into private textures before the final screen pass.
          if (this.getParameter(this.FRAMEBUFFER_BINDING) === null) {
            if (capturePixels) {
              pixels = new Uint8Array(this.drawingBufferWidth * this.drawingBufferHeight * 4);
              this.readPixels(0, 0, this.drawingBufferWidth, this.drawingBufferHeight, this.RGBA, this.UNSIGNED_BYTE, pixels);
              if (this.getError() !== this.NO_ERROR) throw new Error('Unable to sample the WebGL drawing buffer');
            }
            draws += 1;
          }
          return result;
        };
      }
      return gl;
    };
    await fresh({ paused: false });
    await step(1500);
    await render({});
    const canvas = sandbox.querySelector('canvas');
    const baseline = pixels.slice();
    const staticControls = { scale: 1.8, colors: ['#fc4300', '#00e050', '#ffff00'], background: '#eeeeee', intensity: 0, ...changedProps };
    for (const [control, value] of Object.entries(staticControls)) {
      await render({});
      const before = pixels.slice();
      if (control === 'fadeEdges') {
        const mask = getComputedStyle(surface()).maskImage;
        await render({ [control]: value });
        expect(getComputedStyle(surface()).maskImage).not.toBe(mask);
        results.push({ control, evidence: 'computed mask changed' });
      } else if (control === 'text' || control === 'textSize') {
        // ShapeWaves cuts text from the final canvas with a CSS mask.
        const mask = getComputedStyle(canvas).maskImage;
        await render({ [control]: value });
        expect(getComputedStyle(canvas).maskImage).not.toBe(mask);
        results.push({ control, evidence: 'computed text mask changed' });
      } else {
        await render({ [control]: value });
        recordDifference(control, before, pixels);
      }
      expect(sandbox.querySelector('canvas')).toBe(canvas);
      expect(canvas.getContext('webgl').isContextLost(), 'mounted canvas survives StrictMode and prop changes').toBe(false);
    }
    await render({ height: 240 });
    await waitFor(() => expect(Math.round(surface().getBoundingClientRect().height)).toBe(240));
    await waitFor(() => expect(canvas.height).toBe(Math.round(240 * Math.min(window.devicePixelRatio, 1.5))));
    results.push({ control: 'height', evidence: 'surface and drawing buffer resize' });

    await fresh({ paused: false });
    await step(500);
    const moving = pixels.slice();
    await step(500);
    recordDifference('paused: motion before pause', moving, pixels);
    await render({ paused: true });
    const frozen = pixels.slice();
    const stopped = draws;
    await step(500);
    expect(draws).toBe(stopped);
    expect(pixels).toEqual(frozen);
    results.push({ control: 'paused', evidence: 'no new screen draws or changed pixels while paused' });

    await fresh({ paused: false, speed: 0 });
    const zeroSpeed = pixels.slice();
    const zeroDraws = draws;
    await step(500);
    expect(draws).toBe(zeroDraws);
    expect(pixels).toEqual(zeroSpeed);
    await fresh({ paused: false, speed: 1 });
    await step(1000);
    const normalSpeed = pixels.slice();
    await fresh({ paused: false, speed: 2 });
    await step(1000);
    recordDifference('speed', normalSpeed, pixels);
    results.push({ control: 'speed: zero', evidence: 'no new screen draws or changed pixels' });

    if (surface().dataset.effect !== 'borealis') {
      const pointerRun = async interactive => {
        await fresh({ paused: false, interactive });
        await step(300);
        const bounds = surface().getBoundingClientRect();
        await act(() => {
          fireEvent.pointerMove(surface(), { clientX: bounds.left + bounds.width * 0.8, clientY: bounds.top + bounds.height * 0.3, pointerId: 1 });
          fireEvent.pointerDown(surface(), { clientX: bounds.left + bounds.width * 0.8, clientY: bounds.top + bounds.height * 0.3, pointerId: 1, button: 0 });
        });
        await step(600);
        return pixels.slice();
      };
      const disabled = await pointerRun(false);
      const enabled = await pointerRun(true);
      recordDifference('interactive', disabled, enabled);
    }
    expect(difference(baseline, new Uint8Array(baseline.length))).toBeGreaterThan(0.01);
    expect(sandbox.textContent).toContain('Content survives rendering');
    // Renderer reinitialization retains the mounted canvas/context.
    const mountedCanvas = sandbox.querySelector('canvas');
    await act(() => mountedCanvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
    expect(surface()).toHaveAttribute('data-renderer', 'fallback');
    await act(() => mountedCanvas.dispatchEvent(new Event('webglcontextrestored')));
    await waitFor(() => expect(surface()).toHaveAttribute('data-renderer', 'webgl'));
    expect(sandbox.querySelector('canvas')).toBe(mountedCanvas);
    expect(mountedCanvas.getContext('webgl').isContextLost()).toBe(false);
    results.push({ control: 'renderer lifecycle', evidence: 'StrictMode and context restoration retain a usable mounted canvas' });
    completed = true;
  } finally {
    const id = surface()?.dataset.effect || Component.name;
    HTMLCanvasElement.prototype.getContext = getContext;
    await act(() => root.unmount());
    window.requestAnimationFrame = requestFrame;
    window.cancelAnimationFrame = cancelFrame;
    for (const [gl, { descriptor }] of contexts) {
      if (descriptor) Object.defineProperty(gl, 'drawArrays', descriptor);
      else delete gl.drawArrays;
    }
    sandbox.remove();
    for (const [gl, { canRelease }] of contexts) {
      if (canRelease) expect(gl.isContextLost(), 'unmounted background releases its detached WebGL context').toBe(true);
    }
    const { commands } = await import('vitest/browser');
    await commands.recordStoryAudit({ id: `${id}${initialProps.variant ? `-${initialProps.variant}` : ''}-independent-controls`, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', completed, checks: results });
  }
}
