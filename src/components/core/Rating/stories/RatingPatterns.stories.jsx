import { expect, userEvent, within, waitFor } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'rating', import.meta.url,
  import.meta.glob('./fixtures/rating/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/rating/*.jsx', { eager: true, query: '?raw', import: 'default' })
);
const star = (canvasElement, index) =>
  canvasElement.querySelectorAll('[data-slot="rating-star-empty"]')[index].parentElement;

export default { title: 'Core/Advanced Inputs/Rating', id: 'core-rating', tags: ['autodocs'], ...catalogueMeta('rating') };

export const DisplayOptions = { name: 'Display options', ...pattern('display-options', 'Whole and fractional scores, the numeric value, and the small and large sizes.') };
export const ReviewForm = {
  name: 'Review form',
  ...pattern('review-form', 'An editable score with its value; submission stays disabled until a score is chosen and confirms with a toast.'),
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
    await userEvent.click(submit);
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() => expect(body.getByText('Rated 5 out of 5')).toBeVisible());
    await expect(submit).toBeDisabled();
    await userEvent.click(body.getByRole('button', { name: /close toast/i }));
  }
};
export const ReviewSummary = { name: 'Review summary', ...pattern('review-summary'), play: async ({canvasElement}) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByText('4.4')).toBeVisible();
  await expect(canvas.getByRole('progressbar', {name: '4 star reviews'})).toHaveAttribute('aria-valuenow', '22.5');
} };
export const EmojiReactions = {
  name: 'Emoji reactions',
  ...pattern('emoji-reactions', 'A custom scale of labelled toggle buttons for a single sentiment choice.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Good' }));
    await expect(canvas.getByRole('radio', { name: 'Good' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByText('Good')).toBeVisible();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('radio', { name: 'Amazing' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('radio', { name: 'Amazing' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('radio', { name: 'Good' })).toHaveAttribute('aria-checked', 'false');
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('radio', { name: 'Amazing' })).toHaveAttribute('aria-checked', 'true');
  }
};
