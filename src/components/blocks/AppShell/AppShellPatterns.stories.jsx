import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'app-shell',
  import.meta.glob('../../../../.storybook/fixtures/patterns/app-shell/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/app-shell/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/App Shell', id: 'blocks-application-appshell', tags: ['autodocs'], ...catalogueMeta('app-shell') };

/*
 * Shared steps for the framed app-shell examples (see the Patterns section of the AppShell README).
 * The desktop sidebar carries `data-state`; in a narrow frame it is a sheet opened from the header.
 */
const desktopSidebar = (canvasElement) => canvasElement.querySelector('[data-slot="sidebar"][data-state]');

/** Returns the region that holds the navigation: the docked sidebar, or the phone sheet after opening it. */
async function openNavigation(canvasElement) {
  const canvas = within(canvasElement);
  const docked = desktopSidebar(canvasElement);
  if (docked) return within(docked);
  await userEvent.click(canvas.getAllByRole('button', { name: 'Toggle Sidebar' })[0]);
  const sheet = await waitFor(() => {
    const element = canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]');
    expect(element).toBeTruthy();
    return element;
  });
  return within(sheet);
}

/** Every framed example renders inside one bordered app window that contains its own main landmark. */
async function expectFramed(canvasElement) {
  const frame = canvasElement.querySelector('[data-slot="app-shell-frame"]');
  await expect(frame).toBeTruthy();
  await expect(within(frame).getByRole('main')).toBeVisible();
  await expect(getComputedStyle(frame).borderTopStyle).toBe('solid');
}

export const AppShellPattern1 = {
  name: 'Icon rail · workspace switcher, nested nav and user menu',
  ...pattern(1, 'A collapsible icon-rail sidebar in an app window: a workspace switcher, Platform pages with nested Pipelines and Infrastructure sections and a count badge, a collapsible Resources group with status dots, tags and row menus, footer links, and an account menu. The rail handle on the sidebar edge folds it to icons with tooltips (nested sections open beside the rail); in a narrow frame the sidebar opens as a sheet inside the window. Skeleton cards stand in for the page.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    // Pipelines remembers its last view while Overview is the current page.
    await expect(nav.getByRole('link', { name: 'Deployments' })).toHaveAttribute('data-active', 'true');
    await expect(nav.getByRole('link', { name: 'Deployments' })).not.toHaveAttribute('aria-current');
    await userEvent.click(nav.getByRole('button', { name: 'Infrastructure' }));
    await userEvent.click(await nav.findByRole('link', { name: 'Clusters' }));
    await waitFor(() => expect(main.getByText('Clusters')).toBeVisible());
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Clusters' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Actions for CDN' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Remove' }));
    await waitFor(() => expect(nav.queryByRole('link', { name: /^CDN/ })).not.toBeInTheDocument());
    await userEvent.click(nav.getByRole('button', { name: 'Workspace: Gaudi' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Atlas Labs/ }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Workspace: Atlas Labs' })).toBeVisible());
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(canvas.getByRole('button', { name: 'Pipelines' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'Release Gates' }));
      await waitFor(() => expect(main.getByText('Release Gates')).toBeVisible());
      await userEvent.click(canvas.getByRole('button', { name: 'Expand sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const AppShellPattern2 = {
  name: 'Floating sidebar · ⌘K search, nested nav and organization switcher',
  ...pattern(2, 'A floating sidebar card that collapses to icons: brand and trigger, a ⌘K search palette over every page, Platform pages with nested Customers and Subscriptions sections and a live-activity dot, footer links and an organization switcher. The header breadcrumb shows the workspace, the account and the current page; in a narrow frame the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: /Search/ }));
    const dialog = await body.findByRole('dialog', { name: 'Search' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'health');
    await userEvent.click(await within(dialog).findByRole('option', { name: /Health Scores/ }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument());
    await waitFor(() => expect(main.getByText('Health Scores')).toBeVisible());
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Health Scores' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Organization: Stripe' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /OpenAI/ }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Organization: OpenAI' })).toBeVisible());
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      const trigger = within(sidebar).getByRole('button', { name: 'Toggle Sidebar' });
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Subscriptions' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'Invoices' }));
      await waitFor(() => expect(main.getByText('Invoices')).toBeVisible());
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
    // ⌘K / Ctrl+K opens the palette from anywhere in the page.
    const mod = /mac|iphone|ipad/i.test(navigator.userAgentData?.platform || navigator.platform || '') ? 'Meta' : 'Control';
    await userEvent.keyboard(`{${mod}>}k{/${mod}}`);
    await expect(await body.findByRole('dialog', { name: 'Search' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument());
  }
};

export const AppShellPattern3 = {
  name: 'Inset sidebar · project progress rings and a notifications popover',
  ...pattern(3, 'An inset sidebar with the brand, a notifications bell and the collapse trigger in its header, a ⌘K search palette (while focus is inside the window), Platform pages with nested Issues and Team sections, collapsible Active Projects whose progress rings are spoken with each name and whose row menus archive a project, a spending-limit meter, and an organization and account menu. The bell opens a multi-type feed (mentions, approvals with Approve and Review, shared files, tasks, joins, events, milestones) with unread dots and Mark all as read. The sidebar folds to an icon rail with tooltips and side menus; in a narrow frame it opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    // Each project ring is spoken with its name.
    await expect(nav.getByRole('link', { name: /Design System.*72% complete/ })).toBeVisible();
    await userEvent.click(nav.getByRole('button', { name: 'Notifications, 5 unread' }));
    const feed = await body.findByRole('dialog', { name: 'Notifications' });
    await userEvent.click(within(feed).getByRole('button', { name: 'Approve' }));
    await expect(within(feed).getByText('Approved')).toBeVisible();
    await userEvent.click(within(feed).getByRole('button', { name: 'Mark all as read' }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Notifications' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument());
    nav = await openNavigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Actions for Auth Module' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Archive' }));
    await waitFor(() => expect(nav.queryByRole('link', { name: /Auth Module/ })).not.toBeInTheDocument());
    await userEvent.click(nav.getByRole('button', { name: 'Issues' }));
    await userEvent.click(await nav.findByRole('link', { name: 'In Progress' }));
    await waitFor(() => expect(main.getByText('In Progress')).toBeVisible());
    nav = await openNavigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Organization: Claude' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /OpenAI/ }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Organization: OpenAI' })).toBeVisible());
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Team' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'Workload' }));
      await waitFor(() => expect(main.getByText('Workload')).toBeVisible());
      await userEvent.click(canvas.getByRole('button', { name: 'Expand sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const AppShellPattern4 = {
  name: 'Dual sidebar · dark app rail, mail inbox and a slide-in calendar panel',
  ...pattern(4, 'A dark app rail switches the sidebar panel between Mail (folders with counts, labels and storage), Calendar (a mini calendar, calendar accounts with visibility checkboxes and the next events), Schedule, Contacts (searchable, with presence) and Notifications (invites to accept or decline). Mail shows a wide message list with All, Unread, Starred and Files tabs; choosing a message marks it read and fills the action header (previous and next, Reply all, star, bookmark, delete and a More menu). The calendar context panel slides in from the other edge, inline on wide windows and over the message on narrow ones. The rail handle folds the sidebar to the dark rail; in a narrow frame the list and the message take turns and the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Mail' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: /^Inbox/ })).toHaveAttribute('aria-current', 'page');
    if (!desktopSidebar(canvasElement)) await userEvent.keyboard('{Escape}');
    // Choosing a message marks it read and fills the action header.
    await userEvent.click(main.getByRole('button', { name: /Marcus Lee: Q4 sprint planning, your input needed, unread/ }));
    await expect(main.getByRole('heading', { name: 'Q4 sprint planning, your input needed' })).toBeVisible();
    // In a narrow panel the list steps aside for the message, so look it up hidden or not.
    await expect(main.getByRole('button', { name: /Marcus Lee: Q4 sprint planning, your input needed$/, hidden: true })).toBeInTheDocument();
    const actions = within(main.getByRole('toolbar', { name: 'Message actions' }));
    await userEvent.click(actions.getByRole('button', { name: 'Star message' }));
    await expect(actions.getByRole('button', { name: 'Unstar message' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(actions.getByRole('button', { name: 'More options' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Move to Archive' }));
    await waitFor(() => expect(main.queryByRole('button', { name: /Marcus Lee/ })).not.toBeInTheDocument());
    // The calendar context panel slides in from the other edge.
    const toggle = main.getByRole('button', { name: /^(Show|Hide) calendar panel$/ });
    if (toggle.getAttribute('aria-pressed') !== 'true') await userEvent.click(toggle);
    const context = main.getByRole('complementary', { name: 'Calendar' });
    await waitFor(() => expect(context).toHaveAttribute('data-state', 'open'));
    await userEvent.click(within(context).getByRole('button', { name: 'Close calendar panel' }));
    await waitFor(() => expect(context).toHaveAttribute('data-state', 'closed'));
    // The dark rail switches the sidebar panel and the page.
    nav = await openNavigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Contacts' }));
    await userEvent.type(nav.getByRole('textbox', { name: 'Search contacts' }), 'aisha');
    await expect(nav.getByText('Aisha Patel')).toBeVisible();
    await expect(nav.queryByText('Sarah Chen')).not.toBeInTheDocument();
    await userEvent.click(nav.getByRole('button', { name: 'Calendar' }));
    await expect(nav.getByRole('button', { name: 'Calendar' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('checkbox', { name: 'Work' })).toBeChecked();
    await userEvent.click(nav.getByRole('checkbox', { name: 'Work' }));
    await expect(nav.getByRole('checkbox', { name: 'Work' })).not.toBeChecked();
    await expect(canvas.getByRole('heading', { name: /Calendar: June 2026/ })).toBeInTheDocument();
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      // A section chosen from the folded rail opens its panel again.
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Mail' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
      await expect(within(sidebar).getByRole('link', { name: /^Inbox/ })).toBeVisible();
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const AppShellPattern5 = {
  name: 'Inset icon rail · per-section navigation, org, app and environment switchers',
  ...pattern(5, 'An icon rail of sections, each with its own secondary navigation inside the inset panel (Catalog and Operations with counts and a storage meter for Inventory; Order Management, Fulfillment and live metrics for Orders; and so on). The header switches organization, application and environment from breadcrumb menus, centres a ⌘K search over every page, and holds a Create menu and a notifications sheet with stock alerts, reviews and approvals. The trigger folds the secondary navigation away so only the rail remains; in a narrow frame the rail and the section navigation open together as a sheet.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const docked = Boolean(desktopSidebar(canvasElement));
    let rail = await openNavigation(canvasElement);
    await expect(rail.getByRole('button', { name: 'Inventory' })).toHaveAttribute('aria-current', 'page');
    let section = within(canvas.getByRole('navigation', { name: 'Inventory navigation' }));
    await expect(section.getByRole('link', { name: 'Product Catalog' })).toHaveAttribute('aria-current', 'page');
    await expect(section.getByRole('progressbar', { name: 'Warehouse capacity used' })).toBeInTheDocument();
    await userEvent.click(section.getByRole('link', { name: /^Stock Alerts/ }));
    rail = await openNavigation(canvasElement);
    section = within(canvas.getByRole('navigation', { name: 'Inventory navigation' }));
    await expect(section.getByRole('link', { name: /^Stock Alerts/ })).toHaveAttribute('aria-current', 'page');
    // Each rail section brings its own navigation.
    await userEvent.click(rail.getByRole('button', { name: 'Orders' }));
    section = within(await canvas.findByRole('navigation', { name: 'Orders navigation' }));
    await expect(section.getByRole('link', { name: 'All Orders' })).toHaveAttribute('aria-current', 'page');
    await expect(section.getByText('Live Metrics')).toBeVisible();
    if (!docked) await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull());
    // Breadcrumb switchers.
    await userEvent.click(canvas.getByRole('button', { name: 'Environment: Production' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Staging' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Environment: Staging' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Organization: Acme Inc' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Starter Kit/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Organization: Starter Kit' })).toBeInTheDocument());
    // The notifications sheet opens inside the window.
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }));
    const sheet = within(await canvas.findByRole('dialog', { name: 'Notifications' }));
    await userEvent.click(sheet.getByRole('button', { name: 'Reorder' }));
    await expect(sheet.getByText('Reorder placed')).toBeVisible();
    await userEvent.click(sheet.getByRole('button', { name: 'Close notifications' }));
    await waitFor(() => expect(canvas.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument());
    // Search reaches pages in every section.
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    const palette = await body.findByRole('dialog', { name: 'Search' });
    await userEvent.type(within(palette).getByRole('combobox'), 'suppliers');
    await userEvent.click(await within(palette).findByRole('option', { name: /Suppliers/ }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument());
    rail = await openNavigation(canvasElement);
    await expect(rail.getByRole('button', { name: 'Inventory' })).toHaveAttribute('aria-current', 'page');
    section = within(canvas.getByRole('navigation', { name: 'Inventory navigation' }));
    await expect(section.getByRole('link', { name: 'Suppliers' })).toHaveAttribute('aria-current', 'page');
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' });
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await expect(canvas.getByRole('navigation', { name: 'Inventory navigation' }).closest('[inert]')).not.toBeNull();
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const AppShellPattern6 = {
  name: 'Mini icon rail · per-section navigation and a tabbed workspace toolbar',
  ...pattern(6, 'A mini rail of product sections and apps beside a sidebar panel with a workspace switcher, the section’s own pages, and collapsible Workspaces and Communities groups with add actions. The page has a breadcrumb, search, Reports and Add actions and a profile menu with presence, above a workspace toolbar with List, Kanban, Calendar and Dashboard views (a view menu in narrow panels), Sort, View field options, Filter and search. The rail handle folds the panel to the rail and the header takes over the trigger; in a narrow frame the rail and panel open as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Insights' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Updates' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('button', { name: 'Workspaces' })).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('button', { name: 'Create workspace' })).toBeInTheDocument();
    await userEvent.click(nav.getByRole('button', { name: 'Workspace: Thunder AI' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Clarity AI/ }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Workspace: Clarity AI' })).toBeVisible());
    // Each rail section brings its own pages.
    await userEvent.click(nav.getByRole('button', { name: 'Security' }));
    const pages = within(nav.getByRole('navigation', { name: 'Security pages' }));
    await expect(pages.getByRole('link', { name: 'Access' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(pages.getByRole('link', { name: 'Audit Log' }));
    await waitFor(() => expect(main.getByText('Audit Log')).toBeVisible());
    // The workspace toolbar switches views: tabs in wide panels, a menu in narrow ones.
    const kanban = main.queryByRole('tab', { name: 'Kanban' });
    if (kanban) {
      await userEvent.click(kanban);
      await expect(kanban).toHaveAttribute('aria-selected', 'true');
    } else {
      await userEvent.click(main.getByRole('button', { name: 'View: List' }));
      await userEvent.click(await body.findByRole('menuitemradio', { name: 'Kanban' }));
      await waitFor(() => expect(main.getByRole('button', { name: 'View: Kanban' })).toBeVisible());
    }
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="app-shell-placeholder-grid"]')).toHaveAttribute('data-preset', 'grid'));
    await userEvent.click(main.getByRole('button', { name: 'View options' }));
    const labels = await body.findByRole('menuitemcheckbox', { name: 'Labels' });
    await expect(labels).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(labels);
    await userEvent.click(main.getByRole('button', { name: 'View options' }));
    await expect(await body.findByRole('menuitemcheckbox', { name: 'Labels' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      // Folded to the rail, the page header carries the trigger.
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      nav = await openNavigation(canvasElement);
      await expect(nav.getByRole('link', { name: 'Audit Log' })).toHaveAttribute('aria-current', 'page');
      await userEvent.keyboard('{Escape}');
    }
  }
};

/** The docked sidebar only: the phone sheet carries a `data-state` too while it is open or closing. */
const dockedSidebar = (canvasElement) => canvasElement.querySelector('[data-slot="sidebar"][data-state]:not([data-mobile="true"])');

/** Opens the navigation once a closing phone sheet has gone, so the steps never act on the old sheet. */
async function navigation(canvasElement) {
  await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"][data-state="closed"]')).toBeNull());
  return openNavigation(canvasElement);
}

export const AppShellPattern7 = {
  name: 'Floating sidebar · AI chat with a model picker grid and prompt composer',
  ...pattern(7, 'An AI chat workspace on a floating sidebar that collapses to icons: New Chat, a three-tile model picker kept in step with the header picker, a pinned thread card, recent threads with row menus (pin, delete), quick actions with count badges and an assistant menu. A new chat opens on a welcome canvas whose starter prompts fill the composer; sending adds the question and a reply to the thread, and opening a past thread shows its loading skeleton. In a narrow frame the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    await expect(main.getByRole('heading', { name: 'How Can I Help?' })).toBeVisible();
    // The header picker and the sidebar grid choose the same model.
    await userEvent.click(main.getByRole('button', { name: 'Model: GPT-4' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Claude/ }));
    await waitFor(() => expect(main.getByRole('button', { name: 'Model: Claude' })).toBeVisible());
    let nav = await navigation(canvasElement);
    await expect(nav.getByRole('radio', { name: 'Claude' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(nav.getByRole('radio', { name: 'Gemini' }));
    // The open phone sheet hides the page from assistive technology, so look past it.
    await waitFor(() => expect(main.getByRole('button', { name: 'Model: Gemini', hidden: true })).toBeInTheDocument());
    // Pin a recent thread from its row menu; it moves to the pinned cards.
    await userEvent.click(nav.getByRole('button', { name: 'Actions for Lisbon trip itinerary' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Pin Chat' }));
    await waitFor(() => expect(nav.getAllByRole('link', { name: /Lisbon trip itinerary/ })).toHaveLength(1));
    await userEvent.click(nav.getByRole('link', { name: /Refactor auth middleware/ }));
    nav = await navigation(canvasElement);
    await expect(nav.getByRole('link', { name: /Refactor auth middleware/ })).toHaveAttribute('aria-current', 'page');
    // A new chat: a starter prompt fills the composer and sending adds the turn.
    await userEvent.click(nav.getByRole('button', { name: 'New Chat' }));
    await userEvent.click(await main.findByRole('button', { name: /Draft an email/ }));
    const prompt = main.getByRole('combobox', { name: 'Message Gaudi AI' });
    await expect(prompt).toHaveValue('Draft an email');
    await userEvent.click(main.getByRole('button', { name: 'Send message' }));
    const thread = within(await main.findByRole('region', { name: 'Conversation' }));
    await expect(thread.getByText('Draft an email')).toBeVisible();
    await expect(prompt).toHaveValue('');
    const sidebar = dockedSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await expect(within(sidebar).getByRole('link', { name: 'Favorites' })).toBeVisible();
      // On the rail the trigger sits in the page header.
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    }
  }
};

export const AppShellPattern8 = {
  name: 'Mail client · folder sidebar, split list and reading panes, and an app rail',
  ...pattern(8, 'A webmail shell: an account menu, New Mail (a compose dialog), Mail folders with counts, Labels with a create-label dialog, direct messages with presence, and footer links in a sidebar that collapses to icons from the list header. The message list searches and filters by category (an empty state offers to clear filters); choosing a message opens it in the reading pane with previous and next, read, flag, star and delete actions, and an icon rail of app shortcuts sits on the far edge of wide frames. In a narrow frame the list and the reading pane take turns and the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await navigation(canvasElement);
    await expect(nav.getByRole('link', { name: /^Inbox/ })).toHaveAttribute('aria-current', 'page');
    if (!dockedSidebar(canvasElement)) await userEvent.keyboard('{Escape}');
    const list = within(await main.findByRole('region', { name: 'Inbox messages' }));
    // Search narrows the list; a miss shows the empty state, which clears the filters.
    await userEvent.type(list.getByRole('textbox', { name: 'Search mail' }), 'zzz');
    await expect(await list.findByText("It's empty here")).toBeVisible();
    await userEvent.click(list.getByRole('button', { name: 'clear filters' }));
    await expect(list.getByRole('textbox', { name: 'Search mail' })).toHaveValue('');
    // Open a message, star it, then move it to the trash.
    await userEvent.click(list.getByRole('button', { name: /Q4 roadmap review/ }));
    const pane = within(main.getByRole('region', { name: 'Reading pane' }));
    await expect(await pane.findByRole('heading', { name: 'Q4 roadmap review' })).toBeVisible();
    await userEvent.click(pane.getByRole('button', { name: 'Star message' }));
    await expect(pane.getByRole('button', { name: 'Star message' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(pane.getByRole('button', { name: 'Delete message' }));
    await expect(await pane.findByText('Choose an email to view details')).toBeInTheDocument();
    await waitFor(() => expect(list.queryByRole('button', { name: /Q4 roadmap review/ })).not.toBeInTheDocument());
    // Compose from the sidebar and find the message in Sent.
    nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'New mail' }));
    const dialog = within(await body.findByRole('dialog', { name: 'New Message' }));
    // On phones the sheet closes as the dialog opens; type once it has gone.
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull());
    await userEvent.type(dialog.getByRole('textbox', { name: 'To' }), 'sam@gaudi.dev');
    await userEvent.type(dialog.getByRole('textbox', { name: 'Subject' }), 'Launch plan');
    await userEvent.click(dialog.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'New Message' })).not.toBeInTheDocument());
    nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('link', { name: /^Sent/ }));
    await expect(await main.findByRole('button', { name: /Launch plan/ })).toBeVisible();
    const sidebar = dockedSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    }
  }
};

export const AppShellPattern9 = {
  name: 'Resizable sidebar · AI chat threads, icon rail and header model picker',
  ...pattern(9, 'An AI chat shell whose thread sidebar resizes from its edge (drag, or the arrow keys on the handle) and collapses to an icon rail where Pinned and Recent open as menus. Chats and Artifacts tabs, shortcuts with counts, collapsible Pinned and Recent groups with pin and row menus, a chat search palette, and an account menu with organizations. The header carries the thread title, a memory toggle, a model picker with provider and context details, and chat options; the conversation shows its loading skeleton. In a narrow frame an app bar opens the sidebar as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    await expect(main.getByRole('heading', { name: 'Stripe webhook 500s on charge.refunded' })).toBeVisible();
    await userEvent.click(main.getByRole('button', { name: 'Model: Claude Sonnet 5' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /GPT-5\.1/ }));
    await waitFor(() => expect(main.getByRole('button', { name: 'Model: GPT-5.1' })).toBeVisible());
    // Pin a recent chat with its hover action; the Pinned count follows.
    let nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Pin Churn by plan tier' }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Unpin Churn by plan tier' })).toBeInTheDocument());
    await expect(nav.getByRole('button', { name: /Pinned\s*3/ })).toBeVisible();
    // The search palette opens a chat.
    await userEvent.click(nav.getAllByRole('button', { name: 'Search chats' })[0]);
    const dialog = await body.findByRole('dialog', { name: 'Search chats' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'trial');
    await userEvent.click(await within(dialog).findByRole('option', { name: /Rewrite the trial expiry email/ }));
    await waitFor(() => expect(main.getByRole('heading', { name: 'Rewrite the trial expiry email' })).toBeVisible());
    nav = await navigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Rewrite the trial expiry email' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('tab', { name: 'Artifacts' }));
    await expect(nav.getByRole('link', { name: 'stripe-webhook.ts' })).toBeVisible();
    await userEvent.click(nav.getByRole('tab', { name: 'Chats' }));
    const sidebar = dockedSidebar(canvasElement);
    if (sidebar) {
      // The edge handle resizes the sidebar from the keyboard.
      const handle = within(sidebar).getByRole('separator', { name: 'Resize sidebar' });
      const container = sidebar.querySelector('[data-slot="sidebar-container"]');
      const before = container.getBoundingClientRect().width;
      handle.focus();
      await userEvent.keyboard('{ArrowRight}{ArrowRight}');
      await waitFor(() => expect(container.getBoundingClientRect().width).toBeGreaterThan(before + 20));
      await userEvent.keyboard('{Home}');
      await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '224'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Recent chats' }));
      await userEvent.click(await body.findByRole('menuitem', { name: /Stream chat responses/ }));
      await waitFor(() => expect(main.getByRole('heading', { name: 'Stream chat responses' })).toBeVisible());
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Expand sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

/** Closes the phone sheet (when one is open) and waits until the page behind it is exposed again. */
async function closeNavigation(canvasElement) {
  // The open sheet also carries data-state, so look for the sheet itself rather than the docked rail.
  if (!canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')) return;
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull());
  await waitFor(() => expect(canvasElement.querySelector('main')?.closest('[aria-hidden="true"]')).toBeFalsy());
}

export const AppShellPattern10 = {
  name: 'Topbar switchers · team and project switchers, indented route groups and a 3 × 3 apps menu',
  ...pattern(10, 'A top bar across the window with team and project switchers in a breadcrumb, a 3 × 3 apps menu, settings with operation toggles, a notifications sheet, an account menu and a New Mission menu. Below it the sidebar lists Robot Fleet, Mission Control and System Tools routes indented under icon headings, with an upgrade card at the foot. In a narrow frame the switchers move into the sidebar sheet and the button shortens to New.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    // The apps menu is a 3 × 3 grid of launchers.
    await userEvent.click(canvas.getByRole('button', { name: 'Apps' }));
    const apps = await body.findByRole('menu');
    await expect(within(apps).getAllByRole('menuitem')).toHaveLength(10);
    await userEvent.keyboard('{Escape}');
    // Notifications: dismissing removes a row; marking all read clears the count.
    await userEvent.click(canvas.getByRole('button', { name: /^Notifications/ }));
    const sheet = await body.findByRole('dialog', { name: /Notifications/ });
    await userEvent.click(within(sheet).getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(within(sheet).queryByText('Dock 4 lost telemetry')).not.toBeInTheDocument());
    await userEvent.click(within(sheet).getByRole('button', { name: 'Mark all as read' }));
    await waitFor(() => expect(within(sheet).getByRole('button', { name: 'Mark all as read' })).toBeDisabled());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: /Notifications/ })).not.toBeInTheDocument());
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Stations' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('link', { name: 'Fleet Map' }));
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Fleet Map' })).toHaveAttribute('aria-current', 'page');
    // The team switcher sits in the top bar, or at the top of the phone sheet.
    const switchers = desktopSidebar(canvasElement) ? canvas : nav;
    await userEvent.click(switchers.getByRole('button', { name: 'Switch team' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Logistics Team' }));
    await waitFor(() => expect(switchers.getByRole('button', { name: 'Switch team' })).toHaveTextContent('Logistics Team'));
    await closeNavigation(canvasElement);
  }
};

export const AppShellPattern11 = {
  name: 'Topbar pills · section pills, route search palette and an inset notifications sheet',
  ...pattern(11, 'A top bar with section pills, a route search palette, settings, an inset notifications sheet, an account menu with a presence status, and a New Mission menu above a sidebar of Fleet Overview, Activity and Settings routes with an account card. The search palette filters every route and counts the matches. In a narrower frame the pills fold into a bottom sheet behind one button, and on phones the sidebar opens as a sheet.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    // Section pills, or the sections sheet that replaces them in a narrow frame.
    const pills = canvas.queryByRole('navigation', { name: 'Fleet sections' });
    if (pills && pills.checkVisibility()) {
      await userEvent.click(within(pills).getByRole('button', { name: 'Missions' }));
      await expect(within(pills).getByRole('button', { name: 'Missions' })).toHaveAttribute('aria-current', 'page');
    } else {
      await userEvent.click(canvas.getByRole('button', { name: 'Fleet sections: Fleet' }));
      const sections = await body.findByRole('dialog', { name: 'Fleet Sections' });
      await userEvent.click(within(sections).getByRole('button', { name: 'Missions' }));
      await expect(await canvas.findByRole('button', { name: 'Fleet sections: Missions' })).toBeVisible();
    }
    // The route search palette filters pages and counts the matches.
    await userEvent.click(canvas.getByRole('button', { name: 'Search fleet pages' }));
    const palette = await body.findByRole('dialog', { name: 'Search Fleet' });
    await userEvent.type(within(palette).getByRole('combobox'), 'zon');
    await expect(within(palette).getByRole('status')).toHaveTextContent('1 result');
    await userEvent.click(within(palette).getByRole('option', { name: /Zones/ }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search Fleet' })).not.toBeInTheDocument());
    // The inset notifications sheet resolves an approval in place.
    await userEvent.click(canvas.getByRole('button', { name: /^Notifications/ }));
    const sheet = await body.findByRole('dialog', { name: /Notifications/ });
    await expect(sheet).toHaveAttribute('data-inset', 'true');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Approve' }));
    await expect(await within(sheet).findByText('Approved')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: /Notifications/ })).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: /Account and status for Ava Brooks/ }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Away' }));
    await expect(await canvas.findByRole('button', { name: 'Account and status for Ava Brooks: Away' })).toBeVisible();
    const nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Zones' })).toHaveAttribute('aria-current', 'page');
    await closeNavigation(canvasElement);
  }
};

export const AppShellPattern12 = {
  name: 'Mission control · icon rail, 4-tab missions panel and expandable robot event feeds',
  ...pattern(12, 'A mission-control console: an icon rail with section tooltips, help, settings and profile menus beside a Missions, Robots, Stations and Alerts panel. Robots shows the mission distribution, run stats and collapsible Scheduled, Active, Paused and Failed queues; each active robot expands (one at a time) into its metrics and timestamped event feed. The header search filters active robots and has a scope menu; a sort menu orders them. In a narrow frame the rail and panel open together as one sheet and the labels fold to icons.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    // The header search filters the active queue.
    await userEvent.type(main.getByRole('searchbox', { name: 'Search robots' }), 'kiko');
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Expand Kiko B17 detail' })).toBeVisible();
    await expect(nav.queryByRole('button', { name: /Meow S025 detail/ })).not.toBeInTheDocument();
    await closeNavigation(canvasElement);
    await userEvent.clear(main.getByRole('searchbox', { name: 'Search robots' }));
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Robots' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Routes' }));
    await expect(nav.getByRole('button', { name: 'Routes' })).toHaveAttribute('aria-current', 'page');
    // One robot feed is open at a time.
    await expect(nav.getByRole('button', { name: 'Collapse Dock C112 detail' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(nav.getByRole('button', { name: 'Expand Meow S025 detail' }));
    await expect(nav.getByRole('button', { name: 'Collapse Meow S025 detail' })).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('button', { name: 'Expand Dock C112 detail' })).toHaveAttribute('aria-expanded', 'false');
    await expect(nav.getByText('Delivering')).toBeInTheDocument();
    await userEvent.click(nav.getByRole('button', { name: 'Expand scheduled' }));
    await expect(await nav.findByText(/Zone D/)).toBeVisible();
    await userEvent.click(nav.getByRole('button', { name: 'Sort assignments' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'By Name' }));
    await waitFor(() => {
      const rows = nav.getAllByRole('button', { name: /^(Expand|Collapse) .+ detail$/ }).map((button) => button.getAttribute('aria-label'));
      expect(rows[0]).toMatch(/Dock C112/);
    });
    await userEvent.click(nav.getByRole('tab', { name: 'Alerts' }));
    await expect(await nav.findByText('Incidents Routed')).toBeVisible();
    await userEvent.click(nav.getByRole('tab', { name: 'Robots' }));
    await userEvent.click(nav.getByRole('button', { name: /Open profile for Sienna Wells/ }));
    await expect(await body.findByRole('menuitem', { name: /Sign-In Security/ })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await closeNavigation(canvasElement);
  }
};

export const AppShellPattern13 = {
  name: 'Section tile rail · 3 × 3 section tiles, workspace tabs and a status-badged robot network tree',
  ...pattern(13, 'A sidebar with Fleet, Team and Events workspace tabs that swap a 3 × 3 grid of section tiles and a tree below it: counts, status badges, inline Add, Review and Manage actions and indent guides, with arrow-key navigation from the Gaudi Tree. The collapse button folds the sidebar to an icon strip with tooltips; ⌘F / Ctrl+F focuses the workspace search while focus is in the window. In a narrow frame the sidebar opens as a sheet from the header.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expectFramed(canvasElement);
    const docked = desktopSidebar(canvasElement);
    if (!docked) await userEvent.click(canvas.getByRole('button', { name: 'Open navigation' }));
    const region = docked || (await waitFor(() => {
      const element = canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]');
      expect(element).toBeTruthy();
      return element;
    }));
    const nav = within(region);
    await expect(nav.getByRole('treeitem', { name: /^Scheduled/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(nav.getByRole('treeitem', { name: /^Delivery/ }));
    await expect(nav.getByRole('treeitem', { name: /^Delivery/ })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(await nav.findByRole('treeitem', { name: /^Drop Points/ }));
    await expect(nav.getByRole('treeitem', { name: /^Drop Points/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(nav.getByRole('button', { name: 'Live Map' }));
    await expect(nav.getByRole('button', { name: 'Live Map' })).toHaveAttribute('aria-current', 'page');
    // Workspace tabs swap the tiles and the tree.
    await userEvent.click(nav.getByRole('tab', { name: 'Team' }));
    await expect(await nav.findByRole('treeitem', { name: /^Dispatch Crew/ })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Roster' })).toHaveAttribute('aria-current', 'page');
    if (docked) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse navigation' }));
      await waitFor(() => expect(docked).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(canvas.getByRole('button', { name: 'Shifts' }));
      await expect(canvas.getByRole('button', { name: 'Shifts' })).toHaveAttribute('aria-current', 'page');
      await userEvent.click(canvas.getByRole('button', { name: 'Expand navigation' }));
      await waitFor(() => expect(docked).toHaveAttribute('data-state', 'expanded'));
    } else {
      await closeNavigation(canvasElement);
    }
    // ⌘F / Ctrl+F focuses the search while focus is inside the window.
    const main = within(canvas.getByRole('main'));
    await waitFor(() => expect(within(canvasElement.ownerDocument.body).queryByRole('dialog')).not.toBeInTheDocument());
    canvas.getByRole('button', { name: /(Open|Collapse) navigation/ }).focus();
    const mod = /mac|iphone|ipad/i.test(navigator.userAgentData?.platform || navigator.platform || '') ? 'Meta' : 'Control';
    await userEvent.keyboard(`{${mod}>}f{/${mod}}`);
    await expect(main.getByRole('searchbox', { name: 'Search the workspace' })).toHaveFocus();
  }
};
