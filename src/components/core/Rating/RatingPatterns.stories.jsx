import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'rating',
  import.meta.glob('../../../../.storybook/fixtures/patterns/rating/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/rating/*.jsx', { eager: true, query: '?raw', import: 'default' })
);
const star = (canvasElement, index) =>
  canvasElement.querySelectorAll('[data-slot="rating-star-empty"]')[index].parentElement;

export default { title: 'Core/Inputs/Rating', id: 'core-rating', tags: ['autodocs'], ...catalogueMeta('rating') };

export const RatingPattern1 = { name: 'Display options', ...pattern(1, 'Whole and fractional scores, the numeric value, and the small and large sizes.') };
export const RatingPattern9 = {
  name: 'Review form',
  ...pattern(9, 'An editable score with its value; submission stays disabled until a score is chosen and confirms with a toast.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submit = canvas.getByRole('button', { name: 'Submit review' });
    await expect(submit).toBeDisabled();
    await userEvent.click(star(canvasElement, 2));
    await userEvent.unhover(star(canvasElement, 2));
    await expect(canvas.getByText('3.0')).toBeVisible();
    await expect(canvas.getByText('Thanks for your feedback')).toBeVisible();
    await userEvent.click(star(canvasElement, 4));
    await expect(submit).toBeEnabled();
    await expect(canvas.getByText('Glad you enjoyed it!')).toBeVisible();
  }
};
export const RatingPattern6 = { name: 'Review summary', ...pattern(6) };
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
