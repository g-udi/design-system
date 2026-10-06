import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'badge', import.meta.url,
  import.meta.glob('./fixtures/badge/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/badge/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pill', id: 'core-pill', tags: ['autodocs'], ...catalogueMeta('badge') };

export const Variants = { name: 'Variants', ...pattern('variants', 'Solid, light and outline treatments for each tone.') };
export const SizesCounts = { name: 'Sizes, counts and labels', ...pattern('sizes-counts', 'Every size from xs to xl with counts, labels and quieter variants.') };
export const IconsAvatars = { name: 'Icons, dots, avatars and images', ...pattern('icons-avatars') };
export const RemovableFilters = {
  name: 'Removable filters and links',
  ...pattern('removable-filters', 'Filter badges with a remove button, one carrying an avatar, and a badge rendered as a link.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Design' }));
    await expect(canvas.queryByText('Design')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByText('Design')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'View all tags' })).toHaveAttribute('href', '#');
  }
};
