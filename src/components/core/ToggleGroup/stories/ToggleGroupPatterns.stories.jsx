import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import tokens from '../../../../tokens/tokens.json';

const pattern = patternStories(
  'toggle-group', import.meta.url,
  import.meta.glob('./fixtures/toggle-group/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/toggle-group/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/ToggleGroup', id: 'core-togglegroup', tags: ['autodocs'], ...catalogueMeta('toggle-group') };

export const Variants = {
  name: 'Group variants, spacing, sizes and orientation',
  ...pattern('variants', 'Default and outline groups, attached (`spacing={0}`) and spaced items, three sizes, and vertical stacks.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const group of canvas.getAllByRole('toolbar', { name: 'Formatting' }).slice(0, 2)) await expect(group).toHaveAttribute('data-orientation', 'horizontal');
    await expect(canvas.getAllByRole('toolbar', { name: 'Formatting' })[2]).toHaveAttribute('data-orientation', 'vertical');
    const root = canvasElement.ownerDocument.documentElement;
    const previousScale = root.style.getPropertyValue('--ds-space-scale');
    const previousPriority = root.style.getPropertyPriority('--ds-space-scale');
    const unit = parseFloat(getComputedStyle(root).fontSize) / 4;
    try {
      for (const scale of Object.values(tokens.spaceScales)) {
        root.style.setProperty('--ds-space-scale', scale);
        for (const spacing of [0, 2]) {
          const group = canvas.getByRole('radiogroup', { name: `Period, spacing ${spacing}` });
          await expect(parseFloat(getComputedStyle(group).columnGap)).toBeCloseTo(spacing * unit * scale);
        }
      }
    } finally {
      if (previousScale) root.style.setProperty('--ds-space-scale', previousScale, previousPriority);
      else root.style.removeProperty('--ds-space-scale');
    }
  }
};
export const Switchers = { name: 'Icon and label switchers', ...pattern('switchers', 'Single-choice switches for alignment, view, columns, theme and sort order.') };
export const Filters = {
  name: 'Filters',
  ...pattern('filters', 'Single-choice status and time-range filters, and a multiple-choice channel picker where each item toggles independently.'),
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
