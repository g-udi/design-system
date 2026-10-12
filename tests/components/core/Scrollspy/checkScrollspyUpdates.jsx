import { createRoot } from 'react-dom/client';
import { expect, fireEvent, spyOn, userEvent, waitFor } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Scrollspy } from '../../../../src/components/core/Scrollspy/index.js';
import Button from '../../../../src/components/core/Button/index.js';

export async function checkScrollspyUpdates(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const targetRef = { current: null };
  const render = async ({ extra = false, cancel = false } = {}) => {
    await act(() => root.render(<>
      <Scrollspy targetRef={targetRef} smooth={false}>
        <Button data-scrollspy-anchor='scrollspy-lifecycle-first'>First section</Button>
        {extra && <Button data-scrollspy-anchor='scrollspy-lifecycle-next' onClick={cancel ? event => event.preventDefault() : undefined}>Next section</Button>}
      </Scrollspy>
      <div ref={targetRef} style={{ height: 100, overflow: 'auto' }}>
        <section id='scrollspy-lifecycle-first' style={{ height: 200 }}>First</section>
        {extra && <section id='scrollspy-lifecycle-next' style={{ height: 200 }}>Next</section>}
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

    scrollTo.mockClear();
    await render({ extra: true, cancel: true });
    await userEvent.click(next);
    await expect(scrollTo).not.toHaveBeenCalled();

    await render({ extra: true });
    await fireEvent.click(next, { ctrlKey: true });
    await expect(scrollTo).not.toHaveBeenCalled();
    await fireEvent.click(next, { metaKey: true });
    await expect(scrollTo).not.toHaveBeenCalled();
  } finally {
    scrollTo?.mockRestore();
    await act(() => root.unmount());
    host.remove();
  }
}
