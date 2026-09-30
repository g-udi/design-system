import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'rating',
  import.meta.glob('../../../../.storybook/fixtures/patterns/rating/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/rating/*.jsx', { eager: true, query: '?raw', import: 'default' })
);
const star = (canvasElement, index) =>
  canvasElement.querySelectorAll('[data-slot="rating-star-empty"]')[index].parentElement;

export default { title: 'Core/Rating', tags: ['autodocs'], ...catalogueMeta('rating') };

export const RatingPattern1 = { name: 'Read-only score', ...pattern(1) };
export const RatingPattern2 = { name: 'Partial stars', ...pattern(2, 'Fractional scores fill the last star proportionally.') };
export const RatingPattern3 = { name: 'Numeric value', ...pattern(3) };
export const RatingPattern4 = {
  name: 'Editable with confirmation',
  ...pattern(4, 'Selecting a star updates the score and confirms it with a toast.'),
  play: async ({ canvasElement }) => {
    await userEvent.click(star(canvasElement, 2));
    await userEvent.unhover(star(canvasElement, 2));
    await expect(within(canvasElement).getByText('3.0')).toBeVisible();
  }
};
export const RatingPattern5 = { name: 'Sizes', ...pattern(5) };
export const RatingPattern6 = { name: 'Review summary', ...pattern(6) };
export const RatingPattern7 = { name: 'Score readout', ...pattern(7, 'The host renders the selected score beside the stars.') };
export const RatingPattern8 = {
  name: 'Emoji reactions',
  ...pattern(8, 'A custom scale of labelled toggle buttons for a single sentiment choice.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Good' }));
    await expect(canvas.getByRole('button', { name: 'Good' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('Good')).toBeVisible();
  }
};
export const RatingPattern9 = {
  name: 'Review form',
  ...pattern(9, 'Submission stays disabled until a score is chosen.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: 'Submit Review' });
    await expect(submit).toBeDisabled();
    await userEvent.click(star(canvasElement, 4));
    await expect(submit).toBeEnabled();
    await expect(canvas.getByText('Glad you enjoyed it!')).toBeVisible();
  }
};
