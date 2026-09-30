import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'marker',
  import.meta.glob('../../../../.storybook/fixtures/patterns/marker/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/marker/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Marker', tags: ['autodocs'], ...catalogueMeta('marker') };

export const MarkerPattern4 = { name: 'Run log grouped by phase', ...pattern(4, 'Separator markers name each phase; default markers with icons list its steps.') };
export const MarkerPattern3 = { name: 'Run status with a live step', ...pattern(3, 'Settled, failed, and in-progress steps, with a spinner on the live one.') };
export const MarkerPattern5 = { name: 'Changed files with border markers', ...pattern(5, 'Border markers divide rows that carry trailing badges and counts.') };
export const MarkerPattern6 = {
  name: 'Links and an action button',
  ...pattern(6),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Review pull request #412' })).toHaveAttribute('data-slot', 'marker');
    await userEvent.click(canvas.getByRole('button', { name: 'Revert this change' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Change reverted');
    await expect(canvas.getByRole('button', { name: 'Undo the revert' })).toBeVisible();
  }
};
