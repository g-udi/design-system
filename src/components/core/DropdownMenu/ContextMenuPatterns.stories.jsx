import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, within } from 'storybook/test';

const pattern = patternStories(
  'context-menu',
  import.meta.glob('../../../../.storybook/fixtures/patterns/context-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/context-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/DropdownMenu', tags: ['autodocs'], ...catalogueMeta('context-menu') };

export const ContextMenuPattern5 = {
  name: 'Context menu',
  ...pattern(5, 'Right click the area: labels, icons, shortcuts, a disabled item, a submenu, checkbox and radio items, and a destructive action.'),
  play: async ({ canvasElement }) => {
    const target = within(canvasElement).getByText('Right click here');
    await userEvent.pointer({ keys: '[MouseRight]', target });
    const menu = within(await within(canvasElement.ownerDocument.body).findByRole('menu'));
    await expect(menu.getByRole('menuitem', { name: /Paste/ })).toHaveAttribute('aria-disabled', 'true');
    await expect(menu.getByRole('menuitemradio', { name: '100%' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
  }
};
export const ContextMenuPattern10 = { name: 'Context menu inside a dialog', ...pattern(10) };
