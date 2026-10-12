import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { act } from '../../../support/reactAct.js';
import { Pattern } from '../../../../src/components/core/Carousel/stories/fixtures/carousel/carousel-autoplay.jsx';

export async function checkReducedMotionAutoplay(canvasElement) {
  if (import.meta.env.MODE !== 'test') return;
  const sandbox = document.createElement('div');
  canvasElement.append(sandbox);
  const root = createRoot(sandbox);
  const originalMatchMedia = window.matchMedia;
  try {
    window.matchMedia = query => query === '(prefers-reduced-motion: reduce)'
      ? { matches: true, addEventListener() {}, removeEventListener() {} }
      : originalMatchMedia.call(window, query);
    await act(() => root.render(<StrictMode><Pattern /></StrictMode>));
    const canvas = within(sandbox);
    const play = await canvas.findByRole('button', { name: 'Play slideshow' });
    await waitFor(() => expect(play).toBeEnabled());
    const previous = canvas.getByRole('button', { name: 'Previous slide' });
    await new Promise(resolve => setTimeout(resolve, 2150));
    await expect(previous).toBeDisabled();
    await userEvent.click(play);
    await expect(canvas.getByRole('button', { name: 'Pause slideshow' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Pause slideshow' }));
  } finally {
    await act(() => root.unmount());
    window.matchMedia = originalMatchMedia;
    sandbox.remove();
  }
}
