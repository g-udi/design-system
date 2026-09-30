import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/PatternInteractions.js';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'tree',
  import.meta.glob('../../../../.storybook/fixtures/patterns/tree/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/tree/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tree', tags: ['autodocs'], ...catalogueMeta('tree') };

export const TreePattern1 = { name: 'Basic tree', ...pattern(1), play: catalogueInteractions['tree-1'] };
export const TreePattern2 = { name: 'Indent guides', ...pattern(2, 'A repeating background draws one guide per indent level.') };
export const TreePattern3 = { name: 'Folder icons', ...pattern(3) };
export const TreePattern4 = { name: 'Plus and minus toggles', ...pattern(4) };
export const TreePattern5 = { name: 'File explorer', ...pattern(5, 'Icons reflect each file type.') };
export const TreePattern6 = { name: 'Organization chart', ...pattern(6) };
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
