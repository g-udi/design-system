import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'button',
  import.meta.glob('../../../../.storybook/fixtures/patterns/button/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/button/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Button', id: 'core-button', tags: ['autodocs'], ...catalogueMeta('button') };

export const ButtonPattern14 = {
  name: 'Icons, loading and links',
  ...pattern(14, 'Leading and trailing icons across every variant, icon-only sizes, a loading spinner, `asChild` anchors with hover motion, and hover-reveal labels.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Please wait' })).toBeDisabled();
    await expect(canvas.getByRole('link', { name: 'Back to home' })).toHaveAttribute('data-slot', 'button');
  }
};
export const ButtonPattern40 = { name: 'Counts, badges and shortcuts', ...pattern(40, 'Split counts, inline and corner badges, a live status dot, and keyboard shortcuts inline or in a tooltip.') };
export const ButtonPattern55 = { name: 'Avatar and two-line content', ...pattern(55) };
export const ButtonPattern44 = {
  name: 'Async loading and success',
  ...pattern(44),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Saved' })).toBeEnabled());
  }
};
export const ButtonPattern41 = { name: 'Copy with feedback', ...pattern(41) };
export const ButtonPattern43 = {
  name: 'Toggling icon and label',
  ...pattern(43, 'Menu and theme icons swap in place; the disclosure label flips with its chevron.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await expect(canvas.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Show more' }));
    await expect(canvas.getByRole('button', { name: 'Show less' })).toBeVisible();
  }
};
export const ButtonPattern59 = { name: 'Social sign-in', ...pattern(59) };
