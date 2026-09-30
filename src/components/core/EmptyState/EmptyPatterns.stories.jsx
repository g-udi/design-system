import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'empty',
  import.meta.glob('../../../../.storybook/fixtures/patterns/empty/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/empty/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Feedback & States/EmptyState', id: 'core-emptystate', tags: ['autodocs'], ...catalogueMeta('empty') };

export const EmptyPattern1 = { name: 'Surfaces and actions', ...pattern(1, 'Plain, muted, bordered and dashed upload surfaces, with and without an icon, inline links, and one or two actions.') };
export const EmptyPattern8 = { name: 'Inside a card', ...pattern(8) };
export const EmptyPattern3 = { name: 'Not found with search', ...pattern(3, 'A 404 that offers a search field with a keyboard hint and a support link.') };
export const EmptyPattern13 = {
  name: 'Illustrated empty states',
  ...pattern(13, 'Custom SVG and markup illustrations in place of an icon; switch scenes to compare them with none, one or two actions.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No automations yet')).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Integrations' }));
    await expect(canvas.getByText('No integrations')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Learn more' })).toBeVisible();
    await userEvent.click(canvas.getByRole('radio', { name: 'Products' }));
    await expect(canvas.queryByRole('button', { name: 'Learn more' })).not.toBeInTheDocument();
  }
};
