// ReUI MIT example catalogue. See THIRD_PARTY_NOTICES.md.
import { catalogueMeta, reuiPatterns } from '../../../../.storybook/stories/ReuiStoryHelpers.jsx';
import { catalogueInteractions } from '../../../../.storybook/stories/ReuiInteractions.js';
import { expect, userEvent, within } from 'storybook/test';

const pattern = reuiPatterns(
  'tree',
  import.meta.glob('../../../../.storybook/fixtures/reui/tree/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/reui/tree/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Tree', tags: ['autodocs'], ...catalogueMeta('tree') };

export const ReuiTree1 = { name: 'Basic tree', ...pattern(1), play: catalogueInteractions['tree-1'] };
export const ReuiTree2 = { name: 'Indent guides', ...pattern(2, 'A repeating background draws one guide per indent level.') };
export const ReuiTree3 = { name: 'Folder icons', ...pattern(3) };
export const ReuiTree4 = { name: 'Plus and minus toggles', ...pattern(4) };
export const ReuiTree5 = { name: 'File explorer', ...pattern(5, 'Icons reflect each file type.') };
export const ReuiTree6 = { name: 'Organization chart', ...pattern(6) };
export const ReuiTree7 = {
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
