import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'cascader',
  import.meta.glob('../../../../.storybook/fixtures/patterns/cascader/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/cascader/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Cascader', tags: ['autodocs'], ...catalogueMeta('cascader') };

export const CascaderPattern1 = { name: 'Drill-down attribute picker', ...pattern(1) };
export const CascaderPattern2 = { name: 'Multi-select with a cap', ...pattern(2) };
export const CascaderPattern3 = { name: 'Deep search with paths', ...pattern(3) };
export const CascaderPattern4 = { name: 'Pinned footer with a flyout', ...pattern(4) };
export const CascaderPattern5 = { name: 'Avatars and role badges', ...pattern(5, 'Custom rows pairing avatars with outline role badges that color-code seniority.') };
export const CascaderPattern6 = { name: 'Trigger path formatting', ...pattern(6) };
export const CascaderPattern7 = { name: 'Inline panel', ...pattern(7) };
export const CascaderPattern8 = { name: 'Flat data with parent pointers', ...pattern(8) };
export const CascaderPattern9 = { name: 'Controlled state', ...pattern(9, 'External buttons jump the panel to a level, reset it to the root and clear the selection, with all four controlled props printed under the control.') };
export const CascaderPattern10 = { name: 'Translated labels', ...pattern(10, 'A German country picker where every string the primitive renders comes from labels, including the live-region announcements, with each flag in an IconTile.') };
export const CascaderPattern11 = { name: 'Descriptions and a disabled option', ...pattern(11) };
export const CascaderPattern12 = {
  name: 'Form field',
  ...pattern(12),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'What do you need help with?' }));
    await userEvent.click(await page.findByRole('option', { name: /Billing/ }));
    await userEvent.click(await page.findByRole('option', { name: /Invoice question/ }));
    // The popup unmounts after its exit transition; axe runs once it has gone.
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-base-ui-focus-guard]')).toBeNull());
    await userEvent.click(canvas.getByRole('button', { name: 'Submit request' }));
    await expect(canvas.getByText('topic=billing.invoice')).toBeVisible();
  }
};
export const CascaderPattern13 = { name: 'Columns mode', ...pattern(13, 'A media library in Miller columns where all three panes overflow and each scrolls on its own.') };
export const CascaderPattern14 = { name: 'Tree mode with multi-select', ...pattern(14) };
export const CascaderPattern15 = { name: 'Async drill-down', ...pattern(15) };
export const CascaderPattern16 = { name: 'Virtualized rows', ...pattern(16, 'Six unevenly sized regions of country markets, windowed so only the visible rows ever mount.') };
export const CascaderPattern17 = { name: 'Removable chips', ...pattern(17, 'Chips rendered outside the primitive from useCascaderSelection, each carrying its full path so repeated column names stay distinct.') };
export const CascaderPattern18 = { name: 'Cascading tree in a popover', ...pattern(18, 'A cascading tree with indeterminate branches in a popover, bounded by the positioner\'s available height.') };
export const CascaderPattern19 = { name: 'Status dots via renderLabel', ...pattern(19) };
export const CascaderPattern20 = { name: 'Branch colours inherited by children', ...pattern(20) };
