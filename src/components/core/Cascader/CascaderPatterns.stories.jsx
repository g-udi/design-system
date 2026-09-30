import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'cascader',
  import.meta.glob('../../../../.storybook/fixtures/patterns/cascader/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/cascader/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Cascader', tags: ['autodocs'], ...catalogueMeta('cascader') };

// The popup unmounts after its exit transition; axe runs once it has gone.
const popupGone = (canvasElement) =>
  waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-base-ui-focus-guard]')).toBeNull());

export const CascaderPattern1 = {
  name: 'Drill-down picker',
  ...pattern(1, 'Brand icons, branch counts and search keywords across three levels. The toggles switch how the trigger prints the path (collapsed, full, tail, leaf or a headless custom value) and whether search reaches every level.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('switch'));
    await userEvent.click(canvas.getByRole('combobox', { name: 'Resource' }));
    await userEvent.type(await page.findByPlaceholderText('Search every level...'), 'review');
    await userEvent.click(await page.findByRole('option', { name: /#design-review/ }));
    await popupGone(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Resource' })).toHaveTextContent('#design-review');
  }
};
export const CascaderPattern2 = {
  name: 'Multi-select with chips and presets',
  ...pattern(2, 'Up to five leaves with a count in the trigger, a clear button, removable path chips outside the popup, and a footer with a preset flyout and a clear action.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Permissions' }));
    await userEvent.click(await page.findByText('Start from a preset'));
    await userEvent.click(await page.findByText('Developer'));
    await userEvent.keyboard('{Escape}');
    await popupGone(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Permissions' })).toHaveTextContent('5 selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Projects / Edit projects' }));
    await expect(canvas.getByRole('combobox', { name: 'Permissions' })).toHaveTextContent('4 selected');
  }
};
export const CascaderPattern12 = {
  name: 'Form field',
  ...pattern(12, 'A named field inside a form, built from flat rows whose parent pointers getParent turns into the tree; the submitted value is printed below.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'What do you need help with?' }));
    await userEvent.click(await page.findByRole('option', { name: /Billing/ }));
    await userEvent.click(await page.findByRole('option', { name: /Invoice question/ }));
    await popupGone(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Submit request' }));
    await expect(canvas.getByText('topic=billing.invoice')).toBeVisible();
  }
};
export const CascaderPattern5 = { name: 'Avatars and role badges', ...pattern(5, 'Custom rows pairing avatars and presence dots with outline role badges, and a trigger that shows the chosen person.') };
export const CascaderPattern20 = { name: 'Two-line rows with branch colours', ...pattern(20, 'Account codes and amounts on a second line, branch colours inherited by children, any level selectable, and a closed account disabled.') };
export const CascaderPattern14 = { name: 'Recently used groups', ...pattern(14, 'Custom item rendering splits the root into labelled groups, recent destinations move to the top, and search reaches every folder.') };
export const CascaderPattern13 = { name: 'Columns mode', ...pattern(13, 'A media library in Miller columns where all three panes overflow and each scrolls on its own.') };
export const CascaderPattern18 = { name: 'Cascading tree in a popover', ...pattern(18, 'A cascading tree with indeterminate branches in a popover, bounded by the positioner\'s available height.') };
export const CascaderPattern9 = { name: 'Controlled state', ...pattern(9, 'External buttons jump the panel to a level, reset it to the root and clear the selection, with all four controlled props printed under the control.') };
export const CascaderPattern15 = { name: 'Async drill-down', ...pattern(15) };
export const CascaderPattern16 = { name: 'Virtualized rows', ...pattern(16, 'Six unevenly sized regions of country markets, windowed so only the visible rows ever mount.') };
export const CascaderPattern10 = { name: 'Translated labels', ...pattern(10, 'A German country picker where every string the primitive renders comes from labels, including the live-region announcements, with each flag in an IconTile.') };
