import { createRef } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';

export async function checkSmoothScrollLifecycle(canvasElement) {
  const host = document.createElement('div');
  host.style.cssText = 'width:100%;height:120px';
  canvasElement.prepend(host);
  const root = createRoot(host);
  const viewportRef = createRef();
  const render = smooth => root.render(<ScrollArea smooth={smooth} viewportRef={viewportRef} className='h-full' aria-label='Scroll lifecycle check'><div style={{ height: 600 }}>An article that stays in place when smoothing changes.</div></ScrollArea>);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    render(true);
    await waitFor(() => expect(viewportRef.current).toBeTruthy());
    const viewport = viewportRef.current;
    await waitFor(() => expect(viewport.classList.contains('lenis')).toBe(!reduced));
    for (const modifiers of [{ shiftKey: true }, { ctrlKey: true }]) {
      const wheel = new WheelEvent('wheel', { ...modifiers, deltaY: 40, bubbles: true, cancelable: true });
      viewport.dispatchEvent(wheel);
      await expect(wheel.defaultPrevented).toBe(false);
    }
    // Synthetic touch verifies pass-through, not a claim about physical-device momentum.
    for (const [type, y] of [['touchstart', 80], ['touchmove', 40], ['touchend', 40]]) {
      const point = new Touch({ identifier: 1, target: viewport, clientX: 40, clientY: y });
      const touches = type === 'touchend' ? [] : [point];
      const touch = new TouchEvent(type, { touches, targetTouches: touches, changedTouches: [point], bubbles: true, cancelable: true });
      viewport.dispatchEvent(touch);
      await expect(touch.defaultPrevented).toBe(false);
    }
    viewport.scrollTop = 120;
    render(false);
    await waitFor(() => expect(viewport.classList.contains('lenis')).toBe(false));
    await expect(viewport.scrollTop).toBe(120);
    const nativeWheel = new WheelEvent('wheel', { deltaY: 40, bubbles: true, cancelable: true });
    viewport.dispatchEvent(nativeWheel);
    await expect(nativeWheel.defaultPrevented).toBe(false);
    render(true);
    await waitFor(() => expect(viewport.classList.contains('lenis')).toBe(!reduced));
    await expect(viewport.scrollTop).toBe(120);
    root.unmount();
    await expect(viewportRef.current).toBe(null);
    await expect(viewport.classList.contains('lenis')).toBe(false);
    const afterUnmount = new WheelEvent('wheel', { deltaY: 40, bubbles: true, cancelable: true });
    viewport.dispatchEvent(afterUnmount);
    await expect(afterUnmount.defaultPrevented).toBe(false);
  } finally {
    if (host.childNodes.length) root.unmount();
    host.remove();
  }
}
