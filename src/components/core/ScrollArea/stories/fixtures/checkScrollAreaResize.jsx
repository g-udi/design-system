import { createRoot } from 'react-dom/client';
import { expect, waitFor } from 'storybook/test';
import { ScrollArea, ScrollBar } from '@gaudi/design-system/core/ScrollArea';

export async function checkScrollAreaResize(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  host.style.cssText = 'width:640px;height:320px;max-width:100%';
  canvasElement.append(host);
  const root = createRoot(host);
  try {
    root.render(
      <ScrollArea type='always' aria-label='Resize regression' className='size-full'>
        <div style={{ width: 1200, height: 800 }}>Scrollable content</div>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    );
    await waitFor(() => expect(host.querySelectorAll('[data-slot=scroll-area-thumb]')).toHaveLength(2));
    const viewport = host.querySelector('[data-slot=scroll-area-viewport]');
    const bars = [...host.querySelectorAll('[data-slot=scroll-area-scrollbar]')];
    const horizontal = bars.find(bar => bar.dataset.orientation === 'horizontal');
    const vertical = bars.find(bar => bar.dataset.orientation === 'vertical');
    await waitFor(() => {
      expect(horizontal.firstElementChild.getBoundingClientRect().width).toBeGreaterThan(0);
      expect(vertical.firstElementChild.getBoundingClientRect().height).toBeGreaterThan(0);
    });
    // The stored thumb size can lag its resized track until ResizeObserver runs.
    // It must fit immediately, including before that asynchronous measurement.
    host.style.width = `${horizontal.firstElementChild.getBoundingClientRect().width / 2}px`;
    host.style.height = `${vertical.firstElementChild.getBoundingClientRect().height / 2}px`;
    for (const bar of bars) {
      const track = bar.getBoundingClientRect();
      const thumb = bar.firstElementChild.getBoundingClientRect();
      expect(thumb.width).toBeLessThanOrEqual(track.width);
      expect(thumb.height).toBeLessThanOrEqual(track.height);
    }
    viewport.scrollTo({ left: 300, top: 200 });
    await waitFor(() => {
      expect(viewport.scrollLeft).toBe(300);
      expect(viewport.scrollTop).toBe(200);
    });
    host.style.width = '640px';
    host.style.height = '320px';
    await waitFor(() => {
      for (const bar of bars) {
        const track = bar.getBoundingClientRect();
        const thumb = bar.firstElementChild.getBoundingClientRect();
        expect(thumb.width).toBeLessThanOrEqual(track.width);
        expect(thumb.height).toBeLessThanOrEqual(track.height);
      }
    });
    viewport.scrollTo({ left: viewport.scrollWidth, top: viewport.scrollHeight });
    await waitFor(() => {
      expect(viewport.scrollLeft).toBeGreaterThan(300);
      expect(viewport.scrollTop).toBeGreaterThan(200);
    });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    host.style.width = `${horizontal.firstElementChild.getBoundingClientRect().width / 2}px`;
    host.style.height = `${vertical.firstElementChild.getBoundingClientRect().height / 2}px`;
    // A stale translation must not expose the thumb beyond its track either.
    for (const bar of bars) {
      const thumb = bar.firstElementChild;
      const rect = thumb.getBoundingClientRect();
      const track = bar.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (x > track.right || y > track.bottom) {
        expect(canvasElement.ownerDocument.elementFromPoint(x, y)).not.toBe(thumb);
      }
    }
  } finally {
    root.unmount();
    host.remove();
  }
}
