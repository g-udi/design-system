import { createRoot } from 'react-dom/client';
import { expect, fireEvent, spyOn, userEvent, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Scrollspy } from '../../../../src/components/core/Scrollspy/index.js';
import Button from '../../../../src/components/core/Button/index.js';
import Link from '../../../../src/components/core/Link/index.js';
import { ScrollArea } from '../../../../src/components/core/ScrollArea/index.js';

export async function checkScrollspyUpdates(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const originalURL = window.location.href;
  const originalPosition = { top: window.scrollY, left: window.scrollX };
  const targetRef = { current: null };
  const render = async ({ extra = false, cancel = false, fractional = false, nested = false } = {}) => {
    await act(() => root.render(<>
      <Scrollspy targetRef={targetRef} smooth={false}>
        <Button data-scrollspy-anchor='scrollspy-lifecycle-first'>First section</Button>
        {extra && <Button data-scrollspy-anchor='scrollspy-lifecycle-next' onClick={cancel ? event => event.preventDefault() : undefined}>Next section</Button>}
      </Scrollspy>
      <div ref={targetRef} data-slot='scroll-area-viewport' style={{ height: 100, overflow: 'auto' }}>
        <section id='scrollspy-lifecycle-first' style={{ height: fractional ? 200.4 : 200 }}>First</section>
        {extra && <section id='scrollspy-lifecycle-next' style={{ height: 200 }}>Next</section>}
        {nested && <ScrollArea aria-label='Nested navigation' className='h-12'>A contained navigation list</ScrollArea>}
      </div>
    </>));
  };
  let scrollTo;
  try {
    await render();
    await waitFor(() => expect(host.querySelector('button')).toHaveAttribute('aria-current', 'location'));
    scrollTo = spyOn(targetRef.current, 'scrollTo');
    await render({ extra: true });
    const next = host.querySelector('[data-scrollspy-anchor="scrollspy-lifecycle-next"]');
    await userEvent.click(next);
    await expect(scrollTo).toHaveBeenCalledTimes(1);
    await expect(next).toHaveAttribute('aria-current', 'location');
    await expect(targetRef.current.scrollTop).toBe(200);

    await render({ extra: true, nested: true });
    scrollTo.mockClear();
    await userEvent.click(next);
    await expect(scrollTo).toHaveBeenCalledTimes(1);

    // The viewport rounds the landing point, but the next heading keeps its fraction.
    await render({ extra: true, fractional: true });
    targetRef.current.scrollTop = 200;
    await fireEvent.scroll(targetRef.current);
    await expect(next).toHaveAttribute('aria-current', 'location');

    scrollTo.mockClear();
    await render({ extra: true, cancel: true });
    await userEvent.click(next);
    await expect(scrollTo).not.toHaveBeenCalled();

    await render({ extra: true });
    await fireEvent.click(next, { ctrlKey: true });
    await expect(scrollTo).not.toHaveBeenCalled();
    await fireEvent.click(next, { metaKey: true });
    await expect(scrollTo).not.toHaveBeenCalled();

    // Two near-end headings can share a clamped landing point. Preserve the
    // clicked one until the reader scrolls away, rather than always marking the last.
    await act(() => root.render(<>
      <Scrollspy targetRef={targetRef} smooth={false}>
        <Button data-scrollspy-anchor='clamped-first'>Start</Button>
        <Button data-scrollspy-anchor='clamped-middle'>Middle</Button>
        <Button data-scrollspy-anchor='clamped-last'>End</Button>
      </Scrollspy>
      <div ref={targetRef} style={{ height: 100, overflow: 'auto' }}>
        <section id='clamped-first' style={{ height: 200 }}>Start</section>
        <section id='clamped-middle' style={{ height: 20 }}>Middle</section>
        <section id='clamped-last' style={{ height: 20 }}>End</section>
      </div>
    </>));
    const middle = host.querySelector('[data-scrollspy-anchor="clamped-middle"]');
    await userEvent.click(middle);
    await waitFor(() => expect(targetRef.current.scrollTop + targetRef.current.clientHeight).toBe(targetRef.current.scrollHeight));
    await fireEvent.scroll(targetRef.current);
    await expect(middle).toHaveAttribute('aria-current', 'location');
    targetRef.current.scrollTop = 0;
    await fireEvent.scroll(targetRef.current);
    await expect(middle).not.toHaveAttribute('aria-current');

    // A document contents list needs no synthetic ref. Keep Ctrl/Meta navigation native.
    await act(() => root.render(<>
      <Scrollspy smooth={false} offset={24}>
        <Link href='#scrollspy-document-target' target='_self' data-scrollspy-anchor='scrollspy-document-target'>Document section</Link>
      </Scrollspy>
      <h2 id='scrollspy-document-target'>Document target</h2>
    </>));
    const documentLink = host.querySelector('a');
    const expectedTop = host.querySelector('h2').getBoundingClientRect().top + window.scrollY - 24;
    const documentScroll = spyOn(window, 'scrollTo').mockImplementation(() => {});
    try {
      await fireEvent.click(documentLink, { ctrlKey: true });
      await expect(documentScroll).not.toHaveBeenCalled();
      await fireEvent.click(documentLink);
      await expect(documentScroll).toHaveBeenCalledWith({ top: expectedTop, left: 0, behavior: 'auto' });
      await expect(documentLink).toHaveAttribute('aria-current', 'location');
    } finally { documentScroll.mockRestore(); }

    await act(() => root.render(<>
      <Scrollspy smooth={false} fallbackToFirst={false}>
        <Link href='#scrollspy-later-target' target='_self' data-scrollspy-anchor='scrollspy-later-target'>Later section</Link>
      </Scrollspy>
      <div style={{ height: 1200 }} />
      <h2 id='scrollspy-later-target'>Later target</h2>
    </>));
    const later = host.querySelector('a');
    await waitFor(() => expect(later).not.toHaveAttribute('aria-current'));
  } finally {
    scrollTo?.mockRestore();
    await act(() => root.unmount());
    host.remove();
    window.history.replaceState(window.history.state, '', originalURL);
    window.scrollTo({ ...originalPosition, behavior: 'instant' });
  }
}
