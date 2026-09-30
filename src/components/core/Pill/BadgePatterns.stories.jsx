import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'badge',
  import.meta.glob('../../../../.storybook/fixtures/patterns/badge/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/badge/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Pill', id: 'core-pill', tags: ['autodocs'], ...catalogueMeta('badge') };

export const BadgePattern1 = { name: 'Variants', ...pattern(1, 'Solid, light and outline treatments for each tone.') };
export const BadgePattern19 = { name: 'Sizes, counts and labels', ...pattern(19, 'Every size from xs to xl with counts, labels and quieter variants.') };
export const BadgePattern20 = { name: 'Icons, dots, avatars and images', ...pattern(20) };
export const BadgePattern21 = {
  name: 'Removable filters and links',
  ...pattern(21, 'Filter badges with a remove button, one carrying an avatar, and a badge rendered as a link.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Design' }));
    await expect(canvas.queryByText('Design')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(canvas.getByText('Design')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'View all tags' })).toHaveAttribute('href', '#');
  }
};
