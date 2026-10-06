import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { ImageGallery } from '../../../../src/components/core/ImageGallery/index.js';
import { DirectionProvider } from '../../../../src/components/core/Direction/index.js';

export async function checkGalleryLifecycle(canvasElement) {
  const host = document.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const images = [
    { id: 'a', src: '/static/images/art/0.svg', alt: 'First study' },
    { id: 'b', src: '/static/images/art/1.svg', alt: 'Second study' }
  ];
  const change = fn();
  const render = (props = {}, dir = 'ltr') => act(() => root.render(<StrictMode><DirectionProvider dir={dir}><ImageGallery images={images} label='Lifecycle gallery' onSelectedIdChange={change} {...props} /></DirectionProvider></StrictMode>));
  const page = within(document.body);
  try {
    await render({ selectedId: null });
    await userEvent.click(within(host).getByRole('button', { name: 'Open image: First study' }));
    await expect(change).toHaveBeenLastCalledWith('a');
    await expect(page.queryByRole('dialog')).toBeNull();
    await render({ selectedId: 'a' });
    let dialog = await page.findByRole('dialog', { name: 'First study' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next image' }));
    await expect(change).toHaveBeenLastCalledWith('b');
    await expect(page.getByRole('dialog', { name: 'First study' })).toBeVisible();
    const viewport = dialog.querySelector('[data-slot="carousel-content"]');
    const bounds = viewport.getBoundingClientRect();
    const start = bounds.right - 20;
    const y = bounds.top + 50;
    const touch = x => new Touch({ identifier: 1, target: viewport, clientX: x, clientY: y });
    fireEvent.touchStart(viewport, { touches: [touch(start)] });
    for (const fraction of [0.25, 0.5, 0.75]) {
      fireEvent.touchMove(viewport, { touches: [touch(start - bounds.width * fraction)] });
    }
    fireEvent.touchEnd(viewport, { touches: [], changedTouches: [touch(start - bounds.width * 0.75)] });
    await waitFor(() => expect(change).toHaveBeenLastCalledWith('b'));
    await waitFor(() => expect(Math.abs(dialog.querySelector('[aria-hidden="false"][data-slot="carousel-item"]').getBoundingClientRect().left - viewport.getBoundingClientRect().left)).toBeLessThan(1));
    await userEvent.keyboard('{Escape}');
    await expect(change).toHaveBeenLastCalledWith(null);
    await expect(page.getByRole('dialog', { name: 'First study' })).toBeVisible();
    await render({ selectedId: 'b', images: [...images].reverse() }, 'rtl');
    dialog = await page.findByRole('dialog', { name: 'Second study' });
    await expect(within(dialog).getByRole('button', { name: 'Previous image' })).toBeDisabled();
    within(dialog).getByRole('button', { name: 'Close image viewer' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(change).toHaveBeenLastCalledWith('a');
    await render({ selectedId: 'b', images: [] });
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(within(host).getByRole('region', { name: 'Lifecycle gallery' })).toHaveFocus();
    await render({ selectedId: 'a', disabled: true });
    await expect(page.queryByRole('dialog')).toBeNull();
    await expect(within(host).getByRole('button', { name: 'Open image: First study' })).toBeDisabled();
    await render({ selectedId: null });
    await userEvent.click(within(host).getByRole('button', { name: 'Open image: First study' }));
    await render({ selectedId: 'a' });
    await page.findByRole('dialog', { name: 'First study' });
    await render({ selectedId: 'a', disabled: true });
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull());
    await expect(within(host).getByRole('region', { name: 'Lifecycle gallery' })).toHaveFocus();
  } finally {
    await act(() => root.unmount());
    host.remove();
  }
}
