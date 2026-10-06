import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../docs/components/PatternInteractions.js';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'tree', import.meta.url,
  import.meta.glob('./fixtures/tree/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/tree/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Navigation/Tree', id: 'core-tree', tags: ['autodocs'], ...catalogueMeta('tree') };

export const DisplayOptions = { name: 'Display options', ...pattern('display-options', 'Switches toggle indent guides, folder icons and plus and minus toggles on one tree.'), play: catalogueInteractions['tree-display-options'] };
export const Permissions = {
  name: 'Permission checkboxes',
  ...pattern('permissions', 'Checkboxes toggle leaf permissions without expanding or collapsing the tree.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getAllByRole('checkbox')[0];
    const wasChecked = checkbox.getAttribute('aria-checked') === 'true';
    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute('aria-checked', String(!wasChecked));
  }
};
export const OrgChart = { name: 'Organization chart', ...pattern('org-chart', 'Rows carry an avatar, a name and a role.') };
