import { createRoot } from 'react-dom/client';
import { expect, fireEvent } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Pointer } from '../../../../src/components/core/Pointer/index.js';

export async function checkPointerUpdates(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const nativeCursor = document.documentElement.style.cursor;
  const capable = window.matchMedia('(any-hover: hover) and (any-pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const render = async (props = {}) => {
    await act(() => root.render(<Pointer {...props}><button>Action</button></Pointer>));
    return host.querySelector('[data-slot="pointer-follower"]');
  };
  try {
    let surface = await render();
    await fireEvent.pointerMove(surface, { pointerType: 'mouse', clientX: 40, clientY: 30 });
    await expect(surface.hasAttribute('data-active')).toBe(capable);
    surface = await render({ disabled: true });
    await expect(surface).not.toHaveAttribute('data-active');
    surface = await render();
    await expect(surface).not.toHaveAttribute('data-active');
    await fireEvent.pointerMove(surface, { pointerType: 'pen', clientX: 40, clientY: 30 });
    await expect(surface).not.toHaveAttribute('data-active');
    surface = await render({ onPointerMove: (event) => event.preventDefault() });
    await fireEvent.pointerMove(surface, { pointerType: 'mouse', clientX: 40, clientY: 30 });
    await expect(surface).not.toHaveAttribute('data-active');
    surface = await render();
    await fireEvent.pointerMove(surface, { pointerType: 'mouse', clientX: 40, clientY: 30 });
    await fireEvent.scroll(window);
    await expect(surface).not.toHaveAttribute('data-active');
    await fireEvent.pointerMove(surface, { pointerType: 'mouse', clientX: 40, clientY: 30 });
    await fireEvent.blur(window);
    await expect(surface).not.toHaveAttribute('data-active');
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
  await expect(document.documentElement.style.cursor).toBe(nativeCursor);
}
