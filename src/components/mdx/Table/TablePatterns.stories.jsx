import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'table',
  import.meta.glob('../../../../.storybook/fixtures/patterns/table/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/table/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Table', tags: ['autodocs'], ...catalogueMeta('table') };

export const TablePattern1 = { name: 'Basic table', ...pattern(1, 'A caption, a header row, right-aligned amounts and a footer total.') };
export const TablePattern7 = {
  name: 'Records with avatars, status and actions',
  ...pattern(7, 'Rich cells in one table: a mono ID, an avatar with a secondary line, an icon tile with a SKU, a status badge with its date, a numeric column and a row menu.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('row')).toHaveLength(6);
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for order #3209' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Refund' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  }
};
export const TablePattern8 = { name: 'Projects with team avatars', ...pattern(8, 'Stacked avatars with an overflow count, beside a status badge and due date.') };
export const TablePattern12 = { name: 'API keys and permissions', ...pattern(12, 'Code tokens, several permission badges per row and icon-only row buttons.') };
export const TablePattern15 = { name: 'Leaderboard', ...pattern(15, 'A ranked list with scores and up or down trend indicators.') };
export const TablePattern5 = { name: 'Editable cells', ...pattern(5, 'Inputs inside cells for quick quantity edits.') };
export const TablePattern17 = { name: 'Vertical details', ...pattern(17, 'A two-column key and value table under a frame header, with status, meters and mono values.') };
