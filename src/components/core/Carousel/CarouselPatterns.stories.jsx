import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'carousel',
  import.meta.glob('../../../../.storybook/fixtures/patterns/carousel/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/carousel/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Layout & Containers/Carousel', id: 'core-carousel', tags: ['autodocs'], ...catalogueMeta('carousel') };

export const CarouselPattern1 = {
  name: 'Layout options',
  ...pattern(1, 'One image carousel with switches for vertical orientation, multiple slides per view (two, then three on wider screens), a centred loop and a tight gap.'),
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
export const CarouselPattern11 = {
  name: 'Content overlays with dots',
  ...pattern(11, 'Captioned slides over a scrim, with arrows and dot navigation that tracks the current slide.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Go to slide 3' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true'));
  }
};
export const CarouselPattern9 = {
  name: 'Thumbnail navigation',
  ...pattern(9, 'A strip of thumbnails drives the main slide; the switch moves the strip over the image.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Show slide 4' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Show slide 4' })).toHaveAttribute('aria-current', 'true'));
  }
};
export const CarouselPattern5 = { name: 'Autoplay', ...pattern(5, 'The autoplay plugin advances every two seconds.') };
