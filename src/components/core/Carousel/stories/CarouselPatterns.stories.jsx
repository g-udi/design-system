import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { Pattern as CaptionedCarousel } from './fixtures/carousel/carousel-content-overlays.jsx';
const onNavigate = fn();

const pattern = patternStories(
  'carousel', import.meta.url,
  import.meta.glob('./fixtures/carousel/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/carousel/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Carousel', id: 'core-carousel', tags: ['autodocs'], ...catalogueMeta('carousel') };

export const Layouts = {
  name: 'Layout options',
  ...pattern('layouts', 'One image carousel with switches for vertical orientation, multiple slides per view (two, then three on wider screens), a centred loop and a tight gap.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const previous = canvas.getByRole('button', { name: 'Previous slide' });
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Next slide' })).toBeEnabled());
    await expect(previous).toBeDisabled();
    await userEvent.click(canvas.getByRole('switch', { name: 'Centred loop' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Previous slide' })).toBeEnabled());
    await userEvent.click(canvas.getByRole('switch', { name: 'Centred loop' }));
  }
};
export const ContentOverlays = {
  name: 'Content overlays with dots',
  ...pattern('content-overlays', 'Captioned slides over a scrim, with arrows and dot navigation that tracks the current slide.'),
  render: () => <CaptionedCarousel onNavigate={onNavigate} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 3' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true'));
    onNavigate.mockClear();
    const next = canvas.getByRole('button', { name: 'Next slide' });
    await userEvent.click(next);
    await expect(onNavigate).toHaveBeenLastCalledWith('next', expect.anything());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Go to slide 4' })).toHaveAttribute('aria-current', 'true'));
    onNavigate.mockImplementationOnce((_direction, event) => event.preventDefault());
    await userEvent.click(next);
    await expect(canvas.getByRole('button', { name: 'Go to slide 4' })).toHaveAttribute('aria-current', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Previous slide' }));
    await expect(onNavigate).toHaveBeenLastCalledWith('previous', expect.anything());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true'));
  }
};
export const Thumbnails = {
  name: 'Thumbnail navigation',
  ...pattern('thumbnails', 'A strip of thumbnails drives the main slide; the switch moves the strip over the image.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show slide 4' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Show slide 4' })).toHaveAttribute('aria-current', 'true'));
  }
};
export const Autoplay = { name: 'Autoplay', ...pattern('autoplay', 'The autoplay plugin advances every two seconds.') };
