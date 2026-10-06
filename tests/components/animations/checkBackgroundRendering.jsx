import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { act } from '../../support/reactAct.js';

/** Compile every shader and prove its owner controls change actual pixels. */
export async function checkBackgroundRendering(canvasElement, Component, changedProps, initialProps = {}) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:fixed;top:0;left:0;width:240px;z-index:1000';
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const render = props => act(() => root.render(createElement(Component, {
    height: 150, paused: true, background: '#000000', colors: ['#3478fa', '#83d9ff', '#c7b5ff'], ...initialProps, ...props
  }, createElement('span', null, 'Content survives rendering'))));
  try {
    await render({});
    const canvas = sandbox.querySelector('canvas');
    const effect = sandbox.querySelector('[data-renderer]');
    await waitFor(() => expect(effect, canvas.dataset.renderError).toHaveAttribute('data-renderer', 'webgl'));
    const gl = canvas.getContext('webgl');
    const pixels = () => {
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      const data = new Uint8Array(canvas.width * canvas.height * 4);
      gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, data);
      expect(gl.getError()).toBe(gl.NO_ERROR);
      return data;
    };
    const baseline = pixels();
    const difference = (a, b) => a.reduce((sum, value, index) => sum + (index % 4 === 3 ? 0 : Math.abs(value - b[index])), 0);
    await render(changedProps);
    expect(sandbox.querySelector('canvas')).toBe(canvas);
    expect(difference(baseline, pixels())).toBeGreaterThan(1000);
    await render({ intensity: 0 });
    const blank = pixels();
    expect(blank.every((channel, index) => index % 4 === 3 || channel === 0)).toBe(true);
    expect(difference(baseline, blank)).toBeGreaterThan(1000);
    expect(sandbox.textContent).toContain('Content survives rendering');
  } finally {
    await act(() => root.unmount());
    sandbox.remove();
  }
}
