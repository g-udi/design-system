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
