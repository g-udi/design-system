import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'toggle-group',
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle-group/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/toggle-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', id: 'core-togglegroup', tags: ['autodocs'], ...catalogueMeta('toggle-group') };

export const ToggleGroupPattern2 = {
  name: 'Group variants, spacing, sizes and orientation',
  ...pattern(2, 'Default and outline groups, attached (`spacing={0}`) and spaced items, three sizes, and vertical stacks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const group of canvas.getAllByRole('toolbar', { name: 'Formatting' }).slice(0, 2)) await expect(group).toHaveAttribute('data-orientation', 'horizontal');
    await expect(canvas.getAllByRole('toolbar', { name: 'Formatting' })[2]).toHaveAttribute('data-orientation', 'vertical');
  }
};
export const ToggleGroupPattern8 = { name: 'Icon and label switchers', ...pattern(8, 'Single-choice switches for alignment, view, columns, theme and sort order.') };
export const ToggleGroupPattern12 = {
  name: 'Filters',
  ...pattern(12, 'Single-choice status and time-range filters, and a multiple-choice channel picker where each item toggles independently.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const channels = within(canvas.getByRole('toolbar', { name: 'Notification channels' }));
    await userEvent.click(channels.getByRole('button', { name: 'SMS' }));
    await expect(channels.getByRole('button', { name: 'SMS' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(channels.getByRole('button', { name: 'Email' }));
    await expect(channels.getByRole('button', { name: 'Email' })).toHaveAttribute('aria-pressed', 'false');
    await expect(channels.getByRole('button', { name: 'Push' })).toHaveAttribute('aria-pressed', 'true');
  }
};
