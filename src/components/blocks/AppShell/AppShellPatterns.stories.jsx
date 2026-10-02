import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'app-shell',
  import.meta.glob('../../../../.storybook/fixtures/patterns/app-shell/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/app-shell/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/App Shell', id: 'blocks-application-appshell', tags: ['autodocs'], ...catalogueMeta('app-shell') };

const sidebarOf = (canvasElement) => canvasElement.querySelector('[data-slot="sidebar"][data-state]');

export const AppShellPattern1 = {
  name: 'Writing workspace · icon rail, search and switcher',
  ...pattern(1, 'A writing workspace with a collapsible icon rail (⌘B, remembered between visits), a docked or floating sidebar, a workspace switcher, nested drafts, pinned pages with row menus, a ⌘K search palette, notifications, an apps grid and an account menu with a theme choice.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const sidebar = sidebarOf(canvasElement);
    const trigger = canvasElement.querySelector('[data-slot="sidebar-trigger"]');
    if (sidebar.dataset.state === 'collapsed') await userEvent.click(trigger);
    await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    await userEvent.click(trigger);
    await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{Control>}b{/Control}');
    await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    await userEvent.click(canvas.getByRole('button', { name: /^Workspace: Gaudi Editorial/ }));
    await userEvent.click(await body.findByRole('menuitem', { name: /Gaudi Labs/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /^Workspace: Gaudi Labs/ })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Inbox' }));
    await expect(canvas.getByRole('button', { name: 'Inbox' })).toHaveAttribute('aria-current', 'page');
  }
};

export const AppShellPattern2 = {
  name: 'Projects · inset sidebar, progress and agents',
  ...pattern(2, 'An inset sidebar that collapses to icons, with a progress ring per project, the agents at work, team presence with tooltips, and a notifications popover split into mentions, system and invites.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /Archive migration/ }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 1, name: 'Archive migration' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: /^Notifications/ }));
    await userEvent.click(await body.findByRole('tab', { name: 'Invites' }));
    await waitFor(() => expect(body.getByText('invited you to “Podcast season 3”')).toBeVisible());
  }
};

export const AppShellPattern3 = {
  name: 'Mail · app rail, folders and reading pane',
  ...pattern(3, 'An app rail, a folder sidebar with labels, and resizable message and reading panes. The reading header replies, stars, archives and deletes; below the laptop breakpoint one pane shows at a time.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const messages = canvas.getByRole('list', { name: 'Messages' });
    await userEvent.click(within(messages).getByRole('button', { name: /Sponsorship for Q4/ }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 2, name: 'Sponsorship for Q4' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Unstar' }));
    await expect(canvas.getByRole('button', { name: 'Star' })).toHaveAttribute('aria-pressed', 'false');
  }
};

export const AppShellPattern4 = {
  name: 'Calendar · section rail and context panel',
  ...pattern(4, 'A dark section rail switches the context panel between Calendar, Schedule, Contacts and Notifications; choosing the open section again slides the panel away. The panel holds a date picker and the up-next agenda, and the toolbar switches Day, Week and Month.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'Month' }));
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="event-calendar-content"]')).toHaveAttribute('data-view', 'month'));
    await userEvent.click(canvas.getByRole('button', { name: 'Contacts' }));
    await waitFor(() => expect(canvas.getByText('Priya Natarajan')).toBeVisible());
  }
};

export const AppShellPattern5 = {
  name: 'Environment console · scope switchers and live monitor',
  ...pattern(5, 'An inset icon rail with per-section secondary navigation, organisation, app and environment switchers in the breadcrumb, and a live system monitor popover whose readings update while it is open.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Environment: Production' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Staging' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Environment: Staging' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Logs' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 1, name: 'Live tail' })).toBeVisible());
  }
};

export const AppShellPattern6 = {
  name: 'Operations · toggleable regions and workbench',
  ...pattern(6, 'Mission control with four regions you can show or hide (navigation, filters, a resizable workbench and the inspector), a four-tab panel with run stats, an hourly runs chart and expandable robot event feeds.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Workbench' }));
    await waitFor(() => expect(canvas.queryByRole('tab', { name: 'Logs' })).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: 'Workbench' }));
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Logs' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Events for Courier 07' }));
    await waitFor(() => expect(canvas.getByText('08:42 Picked order 1182')).toBeVisible());
  }
};

export const AppShellPattern10 = {
  name: 'Security console · scope tabs and route tree',
  ...pattern(10, 'Icon scope tabs and a searchable route sidebar that folds to a 48px rail; route groups collapse and reorder by their handles. The header holds workspace tabs and a 3 × 3 section menu; the network tab shows a status-badged robot tree.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search routes' }), 'sso');
    await waitFor(() => expect(canvas.getByRole('link', { name: 'SSO' })).toBeVisible());
    await userEvent.clear(canvas.getByRole('searchbox', { name: 'Search routes' }));
    await userEvent.click(canvas.getByRole('radio', { name: 'Assets' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Robot network' })).toBeVisible());
    await userEvent.click(canvas.getByRole('tab', { name: 'Network' }));
    await waitFor(() => expect(canvas.getByText('Courier 12')).toBeVisible());
  }
};

export const AppShellPattern12 = {
  name: 'Top bar only · section pills, view track and inset sheet',
  ...pattern(12, 'A sidebar-free shell: section pills in the top bar, a route search palette, an inset notifications sheet, a page header with a count badge and eight views on one segmented track that scrolls on its own.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('tab', { name: /Scheduled/ }));
    await waitFor(() => expect(canvas.getByRole('list', { name: 'Scheduled posts' })).toBeVisible());
    const bell = canvas.getByRole('button', { name: /^Notifications/ });
    await userEvent.click(bell);
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Notifications' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
    // Focus returns to the button that opened the sheet.
    await waitFor(() => expect(bell).toHaveFocus());
  }
};

export const AppShellPattern13 = {
  name: 'Dark top bar · workspace switcher, pinnable sidebar and favorites',
  ...pattern(13, 'A full-width top bar in the dark theme holds the brand, a workspace switcher and search above a sidebar you can pin open or unpin to an icon rail that opens over the content on hover or focus. Starring a page adds it to the Favorites group; on phones the sidebar opens as a sheet from the top bar.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Workspace: Gaudi Editorial' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Gaudi Labs' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Workspace: Gaudi Labs' })).toBeVisible());
    const favorites = canvas.getByRole('list', { name: 'Favorites' });
    await expect(within(favorites).queryByRole('button', { name: 'Readers' })).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Add Readers to favorites' }));
    await waitFor(() => expect(within(canvas.getByRole('list', { name: 'Favorites' })).getByRole('button', { name: 'Readers' })).toBeInTheDocument());
    await userEvent.click(within(canvas.getByRole('list', { name: 'Pages' })).getByRole('button', { name: 'Analytics' }));
    await waitFor(() => expect(canvas.getByRole('heading', { level: 1, name: 'Analytics' })).toBeVisible());
    const pin = canvas.queryByRole('button', { name: 'Unpin sidebar' });
    if (pin) {
      await userEvent.click(pin);
      await waitFor(() => expect(sidebarOf(canvasElement)).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(canvas.getByRole('button', { name: 'Pin sidebar' }));
      await waitFor(() => expect(sidebarOf(canvasElement)).toHaveAttribute('data-state', 'expanded'));
    }
  }
};
