import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'button', import.meta.url,
  import.meta.glob('./fixtures/button/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/button/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Button', id: 'core-button', tags: ['autodocs'], ...catalogueMeta('button') };

export const IconsLoading = {
  name: 'Icons, loading and links',
  ...pattern('icons-loading', 'Leading and trailing icons across every variant, icon-only sizes, a loading spinner, `asChild` anchors with hover motion, and hover-reveal labels.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Please wait' })).toBeDisabled();
    await expect(canvas.getByRole('link', { name: 'Back to home' })).toHaveAttribute('data-slot', 'button');
  }
};
export const CountsShortcuts = { name: 'Counts, badges and shortcuts', ...pattern('counts-shortcuts', 'Split counts, inline and corner badges, a live status dot, and keyboard shortcuts inline or in a tooltip.') };
export const AvatarTwoLine = { name: 'Avatar and two-line content', ...pattern('avatar-two-line') };
export const AsyncSuccess = {
  name: 'Async loading and success',
  ...pattern('async-success'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save changes' }));
    await expect(canvas.getByRole('button', { name: 'Saving…' })).toBeDisabled();
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Saved' })).toBeEnabled());
  }
};
export const CopyFeedback = { name: 'Copy with feedback', ...pattern('copy-feedback') };
export const TogglingLabel = {
  name: 'Toggling icon and label',
  ...pattern('toggling-label', 'Menu and theme icons swap in place; the disclosure label flips with its chevron.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }));
    await expect(canvas.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Show more' }));
    await expect(canvas.getByRole('button', { name: 'Show less' })).toBeVisible();
  }
};
export const SocialSignIn = { name: 'Social sign-in', ...pattern('social-sign-in') };
