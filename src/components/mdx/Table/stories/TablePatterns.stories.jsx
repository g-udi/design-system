import { expect, userEvent, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'table', import.meta.url,
  import.meta.glob('./fixtures/table/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/table/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'MDX/Table', tags: ['autodocs'], ...catalogueMeta('table') };

export const Basic = { name: 'Simple data table', ...pattern('basic', 'A caption, a header row, right-aligned amounts and a footer total.') };
export const Records = {
  name: 'Records with avatars, status and actions',
  ...pattern('records', 'Rich cells in one table: a mono ID, an avatar with a secondary line, an icon tile with a SKU, a status badge with its date, a numeric column and a row menu.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('row')).toHaveLength(6);
    await userEvent.click(canvas.getByRole('button', { name: 'Actions for order #3209' }));
    await expect(await within(document.body).findByRole('menuitem', { name: 'Refund' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
  }
};
export const TeamProjects = { name: 'Projects with team avatars', ...pattern('team-projects', 'Stacked avatars with an overflow count, beside a status badge and due date.') };
export const ApiKeys = { name: 'API keys and permissions', ...pattern('api-keys', 'Code tokens, several permission badges per row and icon-only row buttons.') };
export const Leaderboard = { name: 'Leaderboard', ...pattern('leaderboard', 'A ranked list with scores and up or down trend indicators.') };
export const Editable = { name: 'Editable cells', ...pattern('editable', 'Inputs inside cells for quick quantity edits.') };
export const VerticalDetails = { name: 'Vertical details', ...pattern('vertical-details', 'A two-column key and value table under a frame header, with status, meters and mono values.') };
