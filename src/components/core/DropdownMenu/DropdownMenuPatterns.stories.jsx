import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'dropdown-menu',
  import.meta.glob('../../../../.storybook/fixtures/patterns/dropdown-menu/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/dropdown-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/DropdownMenu', id: 'core-dropdownmenu', tags: ['autodocs'], ...catalogueMeta('dropdown-menu') };

const body = (canvasElement) => within(canvasElement.ownerDocument.body);

export const DropdownMenuPattern8 = {
  name: 'Item kinds',
  ...pattern(8, 'Labels, icons, shortcuts, a submenu, checkbox and radio items, disabled entries and a destructive action in one menu.'),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'File' }));
    const menu = within(await body(canvasElement).findByRole('menu'));
    await expect(menu.getByRole('menuitem', { name: /Publish/ })).toHaveAttribute('aria-disabled', 'true');
    await expect(menu.getByRole('menuitemcheckbox', { name: /Activity bar/ })).toHaveAttribute('aria-disabled', 'true');
    const status = menu.getByRole('menuitemcheckbox', { name: /Status bar/ });
    await userEvent.click(status);
    await waitFor(() => expect(status).toHaveAttribute('aria-checked', 'false'));
    await userEvent.click(menu.getByRole('menuitemradio', { name: /Top/ }));
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'File' }));
    const reopened = within(await body(canvasElement).findByRole('menu'));
    await expect(reopened.getByRole('menuitemradio', { name: /Top/ })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
  }
};
export const DropdownMenuPattern2 = { name: 'Side and alignment', ...pattern(2) };
export const DropdownMenuPattern14 = { name: 'Account and create menus', ...pattern(14, 'An app header: a create menu beside the account menu with a theme switch, presence status submenu, counts and sign out.') };
export const DropdownMenuPattern10 = { name: 'Workspace and model switchers', ...pattern(10, 'The trigger shows the current choice; the menu marks it with a check.') };
export const DropdownMenuPattern11 = { name: 'Notifications', ...pattern(11) };
