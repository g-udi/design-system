import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'toggle', import.meta.url,
  import.meta.glob('./fixtures/toggle/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/toggle/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', id: 'core-togglegroup', tags: ['autodocs'], ...catalogueMeta('toggle') };

export const ToggleVariants = {
  name: 'Toggle variants, sizes and states',
  ...pattern('variants', 'Default and outline toggles, pressed and disabled, three sizes, and matching heights beside buttons.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Strikethrough' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Bold toggle' }).getBoundingClientRect().height)
      .toBe(canvas.getByRole('button', { name: 'Bold button' }).getBoundingClientRect().height);
  }
};
export const ToggleIconLabelSwap = {
  name: 'Toggle that swaps icon and label',
  ...pattern('icon-label-swap', 'The pressed state fills the icon, swaps it, or rewrites the label; an icon-only toggle carries a tooltip.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Bookmark' }));
    await expect(canvas.getByRole('button', { name: 'Bookmarked' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Pin to sidebar' }));
    await expect(canvas.getByRole('button', { name: 'Unpin from sidebar' })).toHaveAttribute('aria-pressed', 'true');
  }
};
export const ToggleReactions = {
  name: 'Reactions and counts',
  ...pattern('reactions'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const like = canvas.getByRole('button', { name: 'Like' });
    await userEvent.click(like);
    await expect(like).toHaveTextContent('13');
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications (3 unread)' }));
    await expect(canvas.getByRole('button', { name: 'Notifications' })).toHaveAttribute('aria-pressed', 'true');
  }
};
