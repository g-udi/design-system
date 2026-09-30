import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'toggle',
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', id: 'core-togglegroup', tags: ['autodocs'], ...catalogueMeta('toggle') };

export const TogglePattern13 = {
  name: 'Toggle variants, sizes and states',
  ...pattern(13, 'Default and outline toggles, pressed and disabled, three sizes, and matching heights beside buttons.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Strikethrough' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Bold toggle' }).getBoundingClientRect().height)
      .toBe(canvas.getByRole('button', { name: 'Bold button' }).getBoundingClientRect().height);
  }
};
export const TogglePattern9 = {
  name: 'Toggle that swaps icon and label',
  ...pattern(9, 'The pressed state fills the icon, swaps it, or rewrites the label; an icon-only toggle carries a tooltip.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Bookmark' }));
    await expect(canvas.getByRole('button', { name: 'Bookmarked' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Pin to sidebar' }));
    await expect(canvas.getByRole('button', { name: 'Unpin from sidebar' })).toHaveAttribute('aria-pressed', 'true');
  }
};
export const TogglePattern11 = {
  name: 'Reactions and counts',
  ...pattern(11),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const like = canvas.getByRole('button', { name: 'Like' });
    await userEvent.click(like);
    await expect(like).toHaveTextContent('13');
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications (3 unread)' }));
    await expect(canvas.getByRole('button', { name: 'Notifications' })).toHaveAttribute('aria-pressed', 'true');
  }
};
