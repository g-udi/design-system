import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, fireEvent, waitFor } from 'storybook/test';
import { act } from '../../support/reactAct.js';
import { BackgroundSurface } from '../../../src/components/animations/backgroundRuntime.jsx';

const fragment = `vec3 shade(vec2 uv, float time) {
  float inputLight = uPressed + uPointerActive + uClicks[0].w + uTrail[0].w;
  return mix(uColor1, uColor2, 0.5 + 0.4 * sin(time + uv.x + uPointer.x + inputLight));
}`;

/** Exercise the shared renderer once, including actual drawing and browser event recovery. */
export async function checkBackgroundBehavior(canvasElement) {
  // Browser fault injection belongs to the test runner, never a consumer's live preview.
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.dataset.backgroundBehavior = '';
  sandbox.style.cssText = 'position:fixed;top:0;left:0;width:320px;z-index:1000;background:var(--ds-color-surface)';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const themeStyle = document.createElement('style');
  themeStyle.textContent = '[data-background-behavior][data-palette=warm] { --background-test-color: #ff0000; } [data-background-behavior][data-palette=cool] { --background-test-color: #00ff00; }';
  canvasElement.append(themeStyle);
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  const originalMatchMedia = window.matchMedia;
  const visibilityDescriptor = Object.getOwnPropertyDescriptor(document, 'visibilityState');
  const media = Object.assign(new EventTarget(), { matches: false });
  const surface = () => sandbox.querySelector('[data-effect="lifecycle-check"]');
  const heading = () => sandbox.querySelector('h2');
  let createdSimulations = 0;
  let disposedSimulations = 0;
  let simulationAdvances = 0;
  let simulationFrame;
  const createSimulation = () => {
    createdSimulations += 1;
    return {
      step(frame) {
        simulationFrame = frame;
        if (frame.delta > 0) simulationAdvances += 1;
      },
      dispose() { disposedSimulations += 1; }
    };
  };
  const render = (props = {}) => act(() => root.render(<StrictMode>
    <BackgroundSurface effect="lifecycle-check" fragment={fragment} height={180} interactive createSimulation={createSimulation} {...props}>
      <h2>Readable foreground</h2>
      <button type="button">Foreground action</button>
    </BackgroundSurface>
  </StrictMode>));
  const setVisibility = value => act(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const setReducedMotion = value => act(() => {
    media.matches = value;
    media.dispatchEvent(new Event('change'));
  });
  let gl;
  let loseContext;
  let drawDescriptor;
  let draws = 0;
  const expectDrawingStopped = async () => {
    const before = draws;
    const simulationBefore = simulationAdvances;
    // Longer than four of the renderer's 30fps frame intervals.
    await new Promise(resolve => setTimeout(resolve, 150));
    expect(draws).toBe(before);
    expect(simulationAdvances).toBe(simulationBefore);
  };

  try {
    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)' ? media : originalMatchMedia.call(window, query);
    await setVisibility('visible');
    HTMLCanvasElement.prototype.getContext = function (type, ...options) {
      if (type === 'webgl' && sandbox.contains(this)) return null;
      return originalGetContext.call(this, type, ...options);
    };
    await render();
    await waitFor(() => expect(surface()).toHaveAttribute('data-renderer', 'fallback'));
    expect(surface()).toHaveAttribute('data-animated', 'false');
    expect(heading()).toBeVisible();
    expect(heading().closest('[aria-hidden="true"]')).toBeNull();

    HTMLCanvasElement.prototype.getContext = originalGetContext;
    await act(() => root.render(null));
    await render();
    await waitFor(() => expect(surface()).toHaveAttribute('data-renderer', 'webgl'));
    await waitFor(() => expect(surface()).toHaveAttribute('data-animated', 'true'));
    gl = surface().querySelector('canvas').getContext('webgl');
    drawDescriptor = Object.getOwnPropertyDescriptor(gl, 'drawArrays');
    const drawArrays = gl.drawArrays;
    gl.drawArrays = function (...args) {
      draws += 1;
      return drawArrays.apply(this, args);
    };
    await waitFor(() => expect(draws).toBeGreaterThan(1));
    expect(simulationAdvances).toBeGreaterThan(0);

    const uniform = name => {
      const program = gl.getParameter(gl.CURRENT_PROGRAM);
      return gl.getUniform(program, gl.getUniformLocation(program, name));
    };
    await act(() => fireEvent.pointerMove(surface(), { clientX: 280, clientY: 35, pointerId: 1 }));
    await act(() => fireEvent.pointerDown(surface(), { clientX: 280, clientY: 35, button: 0, pointerId: 1 }));
    await waitFor(() => expect(uniform('uPressed')).toBeGreaterThan(0.5));
    expect(uniform('uPointer')[0]).toBeGreaterThan(0.5);
    expect(uniform('uClicks[0]')[3]).toBe(1);
    expect(uniform('uTrail[0]')[3]).toBeGreaterThan(0);
    await act(() => fireEvent.pointerUp(surface(), { button: 0, pointerId: 1 }));
    await waitFor(() => expect(uniform('uPressed')).toBeLessThan(0.1));
    const clickBefore = Array.from(uniform('uClicks[0]'));
    await act(() => fireEvent.pointerDown(sandbox.querySelector('button'), { clientX: 50, clientY: 50, button: 0 }));
    await new Promise(resolve => setTimeout(resolve, 80));
    expect(Array.from(uniform('uClicks[0]'))).toEqual(clickBefore);

    await render({ paused: true, colors: ['#ff0000', '#00ff00', '#0000ff'], background: '#000000', scale: 2, intensity: 0.5 });
    expect(surface()).toHaveAttribute('data-animated', 'false');
    expect(simulationFrame.colors).toEqual([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    expect(simulationFrame.background).toEqual([0, 0, 0]);
    expect(simulationFrame.scale).toBe(2);
    expect(simulationFrame.intensity).toBe(0.5);
    expect(simulationFrame.delta).toBe(0);
    expect(simulationFrame.width).toBe(320);
    expect(simulationFrame.height).toBe(180);
    expect(simulationFrame.bufferWidth).toBe(surface().querySelector('canvas').width);
    expect(simulationFrame.bufferHeight).toBe(surface().querySelector('canvas').height);
    await expectDrawingStopped();
    const retainedCanvas = surface().querySelector('canvas');
    sandbox.dataset.palette = 'warm';
    await render({ paused: true, colors: ['var(--background-test-color)', '#00ff00', '#0000ff'] });
    await waitFor(() => expect(simulationFrame.colors[0]).toEqual([1, 0, 0]));
    sandbox.dataset.palette = 'cool';
    await waitFor(() => expect(simulationFrame.colors[0]).toEqual([0, 1, 0]));
    expect(surface().querySelector('canvas')).toBe(retainedCanvas);
    expect(simulationFrame.delta).toBe(0);
    await expectDrawingStopped();
    await render({ paused: false });
    const afterPause = draws;
    await waitFor(() => expect(draws).toBeGreaterThan(afterPause));
    expect(surface()).toHaveAttribute('data-animated', 'true');

    await setReducedMotion(true);
    expect(surface()).toHaveAttribute('data-animated', 'false');
    expect(heading()).toBeVisible();
    await expectDrawingStopped();
    await setReducedMotion(false);
    await waitFor(() => expect(surface()).toHaveAttribute('data-animated', 'true'));

    await setVisibility('hidden');
    expect(surface()).toHaveAttribute('data-animated', 'false');
    await expectDrawingStopped();
    await setVisibility('visible');
    await waitFor(() => expect(surface()).toHaveAttribute('data-animated', 'true'));

    loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
      await waitFor(() => expect(surface()).toHaveAttribute('data-renderer', 'fallback'));
      expect(surface()).toHaveAttribute('data-animated', 'false');
      expect(heading()).toBeVisible();
      await expectDrawingStopped();
      loseContext.restoreContext();
      await waitFor(() => expect(surface()).toHaveAttribute('data-renderer', 'webgl'), { timeout: 5000 });
      expect(surface()).toHaveAttribute('data-animated', 'true');
      const afterRestore = draws;
      await waitFor(() => expect(draws).toBeGreaterThan(afterRestore));
    }

    await act(() => root.render(null));
    await expectDrawingStopped();
    expect(disposedSimulations).toBe(createdSimulations);
  } finally {
    HTMLCanvasElement.prototype.getContext = originalGetContext;
    window.matchMedia = originalMatchMedia;
    if (visibilityDescriptor) Object.defineProperty(document, 'visibilityState', visibilityDescriptor);
    else delete document.visibilityState;
    document.dispatchEvent(new Event('visibilitychange'));
    try {
      await act(() => root.unmount());
      if (loseContext) expect(gl.isContextLost(), 'unmount releases the detached context after recovery was verified').toBe(true);
    } finally {
      if (gl) {
        if (drawDescriptor) Object.defineProperty(gl, 'drawArrays', drawDescriptor);
        else delete gl.drawArrays;
      }
      sandbox.remove();
      themeStyle.remove();
    }
  }
}
