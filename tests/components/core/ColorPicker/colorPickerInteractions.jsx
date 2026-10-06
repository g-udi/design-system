import { act } from '../../../support/reactAct.js';
import { createRoot } from 'react-dom/client';
import { expect, fireEvent, fn, userEvent, within } from 'storybook/test';
import { ColorPicker } from '../../../../src/components/core/ColorPicker/index.js';

/** Exercise the browser-only API without ever sampling the user's screen. */
export async function verifyScreenSampling(canvasElement) {
  const original = Object.getOwnPropertyDescriptor(window, 'EyeDropper');
  const requests = [];
  const change = fn();
  const open = fn(({ signal }) => new Promise((resolve, reject) => {
    requests.push({ resolve, reject, signal });
    signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), { once: true });
  }));
  Object.defineProperty(window, 'EyeDropper', { configurable: true, value: class { open = open; } });
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const render = props => act(async () => root.render(<ColorPicker label='Sample' value='#00000080' onValueChange={change} {...props} />));
  const canvas = within(host);
  let mounted = true;
  try {
    await render();
    const button = canvas.getByRole('button', { name: 'Sample: pick from screen' });
    await act(async () => userEvent.click(button));
    await expect(button).toBeDisabled();
    await act(async () => requests[0].resolve({ sRGBHex: '#ff0000' }));
    await expect(change).toHaveBeenLastCalledWith('#ff000080');
    await act(async () => userEvent.click(button));
    await act(async () => requests[1].reject(new DOMException('Cancelled', 'AbortError')));
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(change).toHaveBeenCalledTimes(1);
    await act(async () => userEvent.click(button));
    await act(async () => requests[2].reject(new Error('Unavailable')));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Try again');
    await act(async () => userEvent.click(button));
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await render({ disabled: true });
    await expect(requests[3].signal.aborted).toBe(true);
    await expect(change).toHaveBeenCalledTimes(1);
    await render();
    await act(async () => userEvent.click(button));
    await render({ value: '#00ff00' });
    await expect(requests[4].signal.aborted).toBe(true);
    await expect(canvas.getByRole('textbox', { name: 'Sample: hex value' })).toHaveValue('#00ff00');
    await act(async () => userEvent.click(button));
    await act(async () => root.unmount());
    mounted = false;
    await expect(requests[5].signal.aborted).toBe(true);
  } finally {
    if (mounted) await act(async () => root.unmount());
    host.remove();
    if (original) Object.defineProperty(window, 'EyeDropper', original);
    else delete window.EyeDropper;
  }
}


export async function verifyCanvasPointer(canvasElement, label) {
  const area = canvasElement.querySelector('[data-slot="color-picker-area"]');
  const canvas = within(canvasElement);
  const rect = area.getBoundingClientRect();
  const originals = ['setPointerCapture', 'hasPointerCapture', 'releasePointerCapture'].map(key => [key, Object.getOwnPropertyDescriptor(area, key)]);
  let captured = null;
  area.setPointerCapture = id => { captured = id; };
  area.hasPointerCapture = id => captured === id;
  area.releasePointerCapture = () => { captured = null; };
  const pointer = { pointerId: 71, pointerType: 'touch', isPrimary: true, button: 0, clientX: rect.left + rect.width * 0.3, clientY: rect.top + rect.height * 0.3 };
  try {
    await fireEvent.pointerDown(area, pointer);
    await expect(captured).toBe(71);
    await expect(canvas.getByRole('slider', { name: `${label}: saturation` })).toHaveAttribute('aria-valuenow', '30');
    await fireEvent.pointerMove(area, { ...pointer, pointerId: 72, clientX: rect.right });
    await expect(canvas.getByRole('slider', { name: `${label}: saturation` })).toHaveAttribute('aria-valuenow', '30');
    await fireEvent.pointerMove(area, { ...pointer, clientX: rect.right + 100, clientY: rect.top - 100 });
    await expect(canvas.getByRole('slider', { name: `${label}: saturation` })).toHaveAttribute('aria-valuenow', '100');
    await expect(canvas.getByRole('slider', { name: `${label}: brightness` })).toHaveAttribute('aria-valuenow', '100');
    await fireEvent.pointerCancel(area, pointer);
    await expect(captured).toBe(null);
    await fireEvent.pointerMove(area, pointer);
    await expect(canvas.getByRole('slider', { name: `${label}: saturation` })).toHaveAttribute('aria-valuenow', '100');
    const marker = area.querySelector('[data-slot="color-picker-thumb"]').getBoundingClientRect();
    await expect(marker.right).toBeLessThanOrEqual(rect.right + 1);
    await expect(marker.top).toBeGreaterThanOrEqual(rect.top - 1);
  } finally {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(area, key, descriptor);
      else delete area[key];
    }
  }
}
