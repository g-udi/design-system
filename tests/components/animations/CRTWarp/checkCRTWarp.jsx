import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { CRTWarp } from '../../../../src/components/animations/CRTWarp/CRTWarp.jsx';
import { act } from '../../../support/reactAct.js';

/** Render controls against the real shader; a successful canvas mount alone is insufficient. */
export async function checkCRTWarpBehavior(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:fixed;left:0;top:0;width:640px;z-index:1000';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  let gl;
  let originalDraw;
  let drawDescriptor;
  let pixels;
  let draws = 0;
  const render = props => act(() => root.render(<CRTWarp
    paused height={320} colors={['#477be6', '#2abfae', '#8b70dc']} background="#101010" {...props}
  />));
  const difference = (a, b) => a.reduce((sum, value, index) => sum + Math.abs(value - b[index]), 0) / a.length;

  try {
    HTMLCanvasElement.prototype.getContext = function (kind, ...options) {
      const context = originalGetContext.call(this, kind, ...options);
      if (kind === 'webgl' && sandbox.contains(this) && context && !gl) {
        gl = context;
        originalDraw = gl.drawArrays;
        drawDescriptor = Object.getOwnPropertyDescriptor(gl, 'drawArrays');
        gl.drawArrays = function (...args) {
          originalDraw.apply(this, args);
          pixels = new Uint8Array(this.drawingBufferWidth * this.drawingBufferHeight * 4);
          this.readPixels(0, 0, this.drawingBufferWidth, this.drawingBufferHeight, this.RGBA, this.UNSIGNED_BYTE, pixels);
          draws += 1;
        };
      }
      return context;
    };

    await render();
    await waitFor(() => expect(sandbox.querySelector('[data-effect="crt-warp"]')).toHaveAttribute('data-renderer', 'webgl'));
    await waitFor(() => expect(draws).toBeGreaterThan(0));
    const still = pixels.slice();
    const values = Array.from(still).filter((_, index) => index % 4 !== 3);
    expect(values.some(value => value > 100)).toBe(true);
    expect(values.some(value => value < 25)).toBe(true);

    await render({ intensity: 0 });
    expect(Array.from(pixels).every((value, index) => value === (index % 4 === 3 ? 255 : 16))).toBe(true);
    await render({ scale: 1.8 });
    expect(difference(pixels, still)).toBeGreaterThan(8);
    for (const index of [0, 1, 2]) {
      const colors = ['#477be6', '#2abfae', '#8b70dc'];
      colors[index] = '#ff4500';
      await render({ colors });
      expect(difference(pixels, still)).toBeGreaterThan(0.25);
    }

    await render({ paused: false });
    const started = draws;
    await waitFor(() => expect(draws).toBeGreaterThan(started + 5));
    expect(difference(pixels, still)).toBeGreaterThan(0.1);
    await render({ paused: true });
    const stopped = draws;
    const frozen = pixels.slice();
    await new Promise(resolve => setTimeout(resolve, 160));
    expect(draws).toBe(stopped);
    expect(pixels).toEqual(frozen);
  } finally {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    await act(() => root.unmount());
    if (gl) {
      if (drawDescriptor) Object.defineProperty(gl, 'drawArrays', drawDescriptor);
      else delete gl.drawArrays;
    }
    sandbox.remove();
  }
}
