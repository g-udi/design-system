import { auditOpenMenus } from './auditOpenStates.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const patternStory = patternStories(
  'dropdown-menu', import.meta.url,
  import.meta.glob('./fixtures/dropdown-menu/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/dropdown-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const pattern = (...args) => ({ ...patternStory(...args), play: auditOpenMenus });

export default { title: 'Core/Overlays & Menus/DropdownMenu', id: 'core-dropdownmenu', tags: ['autodocs'], ...catalogueMeta('dropdown-menu') };

const body = (canvasElement) => within(canvasElement.ownerDocument.body);

export const ItemKinds = {
  name: 'Item kinds',
  ...pattern('item-kinds', 'Labels, icons, shortcuts, a submenu, checkbox and radio items, disabled entries and a destructive action in one menu.'),
  play: async (context) => {
    const { canvasElement } = context;
    await auditOpenMenus(context);
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
export const Placement = { name: 'Side and alignment', ...pattern('placement') };
export const AccountCreate = { name: 'Account and create menus', ...pattern('account-create', 'An app header: a create menu beside the account menu with a theme switch, presence status submenu, counts and sign out.') };
export const Switchers = { name: 'Workspace and model switchers', ...pattern('switchers', 'The trigger shows the current choice; the menu marks it with a check.') };
export const Notifications = {
  name: 'Notifications',
  ...pattern('notifications'),
  play: async (context) => {
    await auditOpenMenus(context);
    const canvas = within(context.canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Notifications, 1 unread' });
    const badge = within(trigger).getByText('1');
    await expect(badge.getBoundingClientRect().top).toBeGreaterThanOrEqual(0);
    await userEvent.click(trigger);
    const menu = within(await body(context.canvasElement).findByRole('menu'));
    await userEvent.click(menu.getByRole('menuitem', { name: 'Mark all as read' }));
    await expect(trigger).toHaveAccessibleName('Notifications, 0 unread');
    await expect(within(trigger).queryByText('1')).not.toBeInTheDocument();
    await waitFor(() => expect(body(context.canvasElement).queryByRole('menu')).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('All notifications marked as read.');
    await userEvent.click(trigger);
    const reopened = within(await body(context.canvasElement).findByRole('menu'));
    await expect(reopened.getByRole('menuitem', { name: 'Mark all as read' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
  }
};
