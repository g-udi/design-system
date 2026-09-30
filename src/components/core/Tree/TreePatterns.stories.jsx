import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'tree',
  import.meta.glob('../../../../.storybook/fixtures/patterns/tree/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/tree/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tree', tags: ['autodocs'], ...catalogueMeta('tree') };

export const TreePattern1 = { name: 'Display options', ...pattern(1, 'Switches toggle indent guides, folder icons and plus and minus toggles on one tree.'), play: catalogueInteractions['tree-1'] };
export const TreePattern7 = {
  name: 'Permission checkboxes',
  ...pattern(7, 'Checkboxes toggle leaf permissions without expanding or collapsing the tree.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getAllByRole('checkbox')[0];
    const wasChecked = checkbox.getAttribute('aria-checked') === 'true';
    await userEvent.click(checkbox);
    await expect(checkbox).toHaveAttribute('aria-checked', String(!wasChecked));
  }
};
export const TreePattern6 = { name: 'Organization chart', ...pattern(6, 'Rows carry an avatar, a name and a role.') };
