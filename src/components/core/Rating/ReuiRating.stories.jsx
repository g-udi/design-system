// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';

const pattern = reuiPatterns(
  'rating',
  import.meta.glob('../../../../.storybook/fixtures/reui/rating/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/rating/*.jsx', { eager: true, query: '?raw', import: 'default' })
);
const star = (canvasElement, index) =>
  canvasElement.querySelectorAll('[data-slot="rating-star-empty"]')[index].parentElement;

export default { title: 'Core/Rating', tags: ['autodocs'], ...catalogueMeta('rating') };

export const ReuiRating1 = { name: 'Read-only score', ...pattern(1) };
export const ReuiRating2 = { name: 'Partial stars', ...pattern(2, 'Fractional scores fill the last star proportionally.') };
export const ReuiRating3 = { name: 'Numeric value', ...pattern(3) };
export const ReuiRating4 = {
  name: 'Editable with confirmation',
  ...pattern(4, 'Selecting a star updates the score and confirms it with a toast.'),
  play: async ({ canvasElement }) => {
    await userEvent.click(star(canvasElement, 2));
    await userEvent.unhover(star(canvasElement, 2));
    await expect(within(canvasElement).getByText('3.0')).toBeVisible();
  }
};
export const ReuiRating5 = { name: 'Sizes', ...pattern(5) };
export const ReuiRating6 = { name: 'Review summary', ...pattern(6) };
export const ReuiRating7 = { name: 'Score readout', ...pattern(7, 'The host renders the selected score beside the stars.') };
export const ReuiRating8 = {
  name: 'Emoji reactions',
  ...pattern(8, 'A custom scale of labelled toggle buttons for a single sentiment choice.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Good' }));
    await expect(canvas.getByRole('button', { name: 'Good' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByText('Good')).toBeVisible();
  }
};
export const ReuiRating9 = {
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
