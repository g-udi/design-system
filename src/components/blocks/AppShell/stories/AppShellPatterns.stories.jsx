import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { desktopSidebar, expectFramed, expectHeaderToggle, openNavigation } from './AppShell.story-steps.js';

const pattern = patternStories(
  'app-shell', import.meta.url,
  import.meta.glob('./fixtures/app-shell/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/app-shell/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/App Shell', id: 'blocks-application-appshell', tags: ['autodocs'], ...catalogueMeta('app-shell') };

export const ReadingDesk = {
  name: 'Floating sidebar · header ⌘K search, reading queue and shelf switcher',
  ...pattern('reading-desk', 'A reading desk with a floating sidebar card that collapses to icons: the brand and trigger, Reading pages with nested Queue and Highlights sections and a new-issue dot on Digest, footer links and a shelf switcher. The page header carries the breadcrumb (shelf, reader and current page) and the search button, which opens a ⌘K palette over every page; in a narrow frame the sidebar opens as a sheet inside the window and the search button shrinks to its icon.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    // The search button sits in the page header, outside the navigation.
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    const dialog = await body.findByRole('dialog', { name: 'Search' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'long');
    await userEvent.click(await within(dialog).findByRole('option', { name: /Long Reads/ }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument());
    await waitFor(() => expect(main.getByText('Long Reads')).toBeVisible());
    const nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Today' })).not.toHaveAttribute('aria-current');
    await expect(nav.getByRole('link', { name: 'Long Reads' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Shelf: Personal Shelf' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Book Club/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Shelf: Book Club' })).toBeVisible());
    // The phone sheet also carries data-state; only a docked sidebar collapses.
    const docked = desktopSidebar(canvasElement);
    const sidebar = docked?.dataset.mobile ? null : docked;
    if (sidebar) {
      const trigger = within(sidebar).getByRole('button', { name: 'Toggle Sidebar' });
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Highlights' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'By Topic' }));
      await waitFor(() => expect(main.getByText('By Topic')).toBeVisible());
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

export const ResearchProjects = {
  name: 'Inset sidebar · study progress rings, reading goal and a header notifications feed',
  ...pattern('research-projects', 'A research workspace with an inset sidebar: the brand and collapse trigger, a ⌘K search palette (while focus is inside the window), Research pages with nested Questions and Collaborators sections, collapsible Active Studies whose progress rings are spoken with each name and whose row menus archive a study, a weekly reading-goal meter, and a lab and account menu. The notifications bell sits at the end of the page header and opens a multi-type feed (mentions, sign-off requests with Approve and Review, shared transcripts, assigned reading, joins, reading-group events, goals) with unread dots and Mark all as read. The sidebar folds to an icon rail with tooltips and side menus; in a narrow frame it opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    // The bell sits in the page header, outside the navigation.
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications, 5 unread' }));
    const feed = await body.findByRole('dialog', { name: 'Notifications' });
    await userEvent.click(within(feed).getByRole('button', { name: 'Approve' }));
    await expect(within(feed).getByText('Approved')).toBeVisible();
    const markRead = within(feed).getByRole('button', { name: 'Mark all as read' });
    await userEvent.click(markRead);
    await waitFor(() => expect(markRead).toBeDisabled());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Notifications' })).toBeVisible());
    // Leave the nested tooltip before Escape targets the notifications popover.
    await userEvent.hover(within(feed).getByRole('heading', { name: 'Notifications' }));
    await waitFor(() => expect(body.queryByRole('tooltip')).not.toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Notifications' })).toHaveFocus());
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    // Each study ring is spoken with its name.
    await expect(nav.getByRole('link', { name: /Memory & Sleep.*72% complete/ })).toBeVisible();
    await userEvent.click(nav.getByRole('button', { name: 'Actions for Grant Proposal' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Archive' }));
    await waitFor(() => expect(nav.queryByRole('link', { name: /Grant Proposal/ })).not.toBeInTheDocument());
    await userEvent.click(nav.getByRole('button', { name: 'Questions' }));
    await userEvent.click(await nav.findByRole('link', { name: 'Investigating' }));
    await waitFor(() => expect(main.getByText('Investigating')).toBeVisible());
    nav = await openNavigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Lab: Cognition Lab' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Urban Studies Group/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Lab: Urban Studies Group' })).toBeVisible());
    // The phone sheet also carries data-state; only a docked sidebar collapses.
    const docked = desktopSidebar(canvasElement);
    const sidebar = docked?.dataset.mobile ? null : docked;
    if (sidebar) {
      const trigger = await expectHeaderToggle(canvasElement);
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Collaborators' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'Reviewers' }));
      await waitFor(() => expect(main.getByText('Reviewers')).toBeVisible());
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const DigestInbox = {
  name: 'Dual sidebar · digest inbox, reading-plan panel and an author directory',
  ...pattern('digest-inbox', 'A dark rail switches the sidebar panel between Digests (a weekly reading goal, library folders with counts, collapsible topics and a reading streak), Reading plan (a mini calendar, plans with visibility checkboxes and the next reading sessions), Authors (searchable, marked when they published today) and Activity (seminar invitations to join or skip, replies to highlights). Digests shows a wide list of newsletter issues with reading times and All, Unread, Saved and Attachments tabs; opening an issue marks it read and fills the action header (previous and next, Highlights, save, add to the reading plan, delete and a More menu). The reading-plan panel slides in from the other edge, inline on wide windows and over the issue on narrow ones. The icon at the top of the dark rail folds the sidebar; in a narrow frame the list and the issue take turns and the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Digests' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: /^Latest issues/ })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('progressbar', { name: 'Weekly reading goal' })).toBeInTheDocument();
    if (!desktopSidebar(canvasElement)) await userEvent.keyboard('{Escape}');
    // Opening an issue marks it read and fills the action header.
    await userEvent.click(main.getByRole('button', { name: /Slow Science Weekly: Replication, one decade on, unread/ }));
    await expect(main.getByRole('heading', { name: 'Replication, one decade on' })).toBeVisible();
    // In a narrow panel the list steps aside for the issue, so look it up hidden or not.
    await expect(main.getByRole('button', { name: /Slow Science Weekly: Replication, one decade on$/, hidden: true })).toBeInTheDocument();
    const actions = within(main.getByRole('toolbar', { name: 'Issue actions' }));
    await userEvent.click(actions.getByRole('button', { name: 'Save issue' }));
    await expect(actions.getByRole('button', { name: 'Remove from saved' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(actions.getByRole('button', { name: 'More options' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Mark as finished' }));
    await waitFor(() => expect(main.queryByRole('button', { name: /Slow Science Weekly/ })).not.toBeInTheDocument());
    // The reading-plan panel slides in from the other edge.
    const toggle = main.getByRole('button', { name: /^(Show|Hide) reading plan$/ });
    if (toggle.getAttribute('aria-pressed') !== 'true') await userEvent.click(toggle);
    const context = main.getByRole('complementary', { name: 'Reading plan' });
    await waitFor(() => expect(context).toHaveAttribute('data-state', 'open'));
    await userEvent.click(within(context).getByRole('button', { name: 'Close reading plan' }));
    await waitFor(() => expect(context).toHaveAttribute('data-state', 'closed'));
    // The dark rail switches the sidebar panel and the page.
    nav = await openNavigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Authors' }));
    await userEvent.type(nav.getByRole('textbox', { name: 'Search authors' }), 'mori');
    await expect(nav.getByText('Hana Mori')).toBeVisible();
    await expect(nav.queryByText('Lina Sato')).not.toBeInTheDocument();
    await userEvent.click(nav.getByRole('button', { name: 'Reading plan' }));
    await expect(nav.getByRole('button', { name: 'Reading plan' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('checkbox', { name: 'Deep reading' })).toBeChecked();
    await userEvent.click(nav.getByRole('checkbox', { name: 'Deep reading' }));
    await expect(nav.getByRole('checkbox', { name: 'Deep reading' })).not.toBeChecked();
    await expect(canvas.getByRole('heading', { name: /Reading plan: June 2026/ })).toBeInTheDocument();
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      const trigger = await expectHeaderToggle(canvasElement);
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      // A section chosen from the folded rail opens its panel again.
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Digests' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
      await expect(within(sidebar).getByRole('link', { name: /^Latest issues/ })).toBeVisible();
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const PublishingConsole = {
  name: 'Inset icon rail · per-section navigation, site, publication and environment switchers',
  ...pattern('publishing-console', 'A publishing console for a notes and essays site: an icon rail of sections, each with its own secondary navigation inside the inset panel (Writing and Library with counts and a monthly writing goal for Content; Releases, Distribution and a live-readers card for Publishing; and so on). The header switches site, publication and Draft, Preview or Live environment from breadcrumb menus, centres a ⌘K search over every page, and holds a Write menu, a link to the live site and a notifications sheet with comments, broken-link checks and suggested edits to approve. The trigger folds the secondary navigation away so only the rail remains; in a narrow frame the rail and the section navigation open together as a sheet.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const docked = Boolean(desktopSidebar(canvasElement));
    let rail = await openNavigation(canvasElement);
    await expect(rail.getByRole('button', { name: 'Content' })).toHaveAttribute('aria-current', 'page');
    let section = within(canvas.getByRole('navigation', { name: 'Content navigation' }));
    await expect(section.getByRole('link', { name: 'Essays' })).toHaveAttribute('aria-current', 'page');
    await expect(section.getByRole('progressbar', { name: 'Monthly writing goal' })).toBeInTheDocument();
    await userEvent.click(section.getByRole('link', { name: /^Broken links/ }));
    rail = await openNavigation(canvasElement);
    section = within(canvas.getByRole('navigation', { name: 'Content navigation' }));
    await expect(section.getByRole('link', { name: /^Broken links/ })).toHaveAttribute('aria-current', 'page');
    // Each rail section brings its own navigation.
    await userEvent.click(rail.getByRole('button', { name: 'Publishing' }));
    section = within(await canvas.findByRole('navigation', { name: 'Publishing navigation' }));
    await expect(section.getByRole('link', { name: 'All releases' })).toHaveAttribute('aria-current', 'page');
    await expect(section.getByText('Live readers')).toBeVisible();
    if (!docked) await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull());
    // Breadcrumb switchers.
    await userEvent.click(canvas.getByRole('button', { name: 'Environment: Live' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Preview' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Environment: Preview' })).toBeVisible());
    await userEvent.click(canvas.getByRole('button', { name: 'Site: Field Notes' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Lab Journal/ }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Site: Lab Journal' })).toBeInTheDocument());
    // The notifications sheet opens inside the window.
    await userEvent.click(canvas.getByRole('button', { name: 'Notifications' }));
    const sheet = within(await canvas.findByRole('dialog', { name: 'Notifications' }));
    await userEvent.click(sheet.getByRole('button', { name: 'Fix links' }));
    await expect(sheet.getByText('Links fixed')).toBeVisible();
    await userEvent.click(sheet.getByRole('button', { name: 'Close notifications' }));
    await waitFor(() => expect(canvas.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument());
    // Search reaches pages in every section.
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    const palette = await body.findByRole('dialog', { name: 'Search' });
    await userEvent.type(within(palette).getByRole('combobox'), 'sources');
    await userEvent.click(await within(palette).findByRole('option', { name: /Sources/ }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search' })).not.toBeInTheDocument());
    rail = await openNavigation(canvasElement);
    await expect(rail.getByRole('button', { name: 'Content' })).toHaveAttribute('aria-current', 'page');
    section = within(canvas.getByRole('navigation', { name: 'Content navigation' }));
    await expect(section.getByRole('link', { name: 'Sources' })).toHaveAttribute('aria-current', 'page');
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' });
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await expect(canvas.getByRole('navigation', { name: 'Content navigation' }).closest('[inert]')).not.toBeNull();
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const NotebookTabs = {
  name: 'Mini icon rail · research notebooks with per-section pages and view tabs',
  ...pattern('notebook-tabs', 'A research-notebook workspace: a mini rail of notebook sections (Research, Evidence, Datasets, Drafts, Collaborators) and companion apps beside a sidebar panel with a notebook switcher, the section’s own pages, and collapsible Collections and Reading groups with add actions. The page header has the notebook breadcrumb, Share, Export and New note actions and a profile menu with presence, above a notebook toolbar with Outline, Board, Timeline and Canvas views (a view menu in narrow panels), an inline search on wide panels, Sort, field options and Filter. The sidebar icon before the breadcrumbs folds the panel to the rail and remains available to expand it; in a narrow frame the rail and panel open as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Research' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('link', { name: 'Notes' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('button', { name: 'Collections' })).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('button', { name: 'Create collection' })).toBeInTheDocument();
    await userEvent.click(nav.getByRole('button', { name: 'Notebook: Memory & Learning' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Urban Reading/ }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Notebook: Urban Reading' })).toBeVisible());
    // Each rail section brings its own pages.
    await userEvent.click(nav.getByRole('button', { name: 'Evidence' }));
    const pages = within(nav.getByRole('navigation', { name: 'Evidence pages' }));
    await expect(pages.getByRole('link', { name: 'Claims' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(pages.getByRole('link', { name: 'Citations' }));
    await waitFor(() => expect(main.getByText('Citations')).toBeVisible());
    // The notebook toolbar switches views: tabs in wide panels, a menu in narrow ones.
    const board = main.queryByRole('tab', { name: 'Board' });
    if (board) {
      await userEvent.click(board);
      await expect(board).toHaveAttribute('aria-selected', 'true');
    } else {
      await userEvent.click(main.getByRole('button', { name: 'View: Outline' }));
      await userEvent.click(await body.findByRole('menuitemradio', { name: 'Board' }));
      await waitFor(() => expect(main.getByRole('button', { name: 'View: Board' })).toBeVisible());
    }
    await expect(main.getByRole('tabpanel', { name: 'Board' })).toBeVisible();
    await userEvent.click(main.getByRole('button', { name: 'View options' }));
    const tags = await body.findByRole('menuitemcheckbox', { name: 'Tags' });
    await expect(tags).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(tags);
    await userEvent.click(main.getByRole('button', { name: 'View options' }));
    await expect(await body.findByRole('menuitemcheckbox', { name: 'Tags' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{Escape}');
    const sidebar = desktopSidebar(canvasElement);
    if (sidebar) {
      const trigger = await expectHeaderToggle(canvasElement);
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      // The same page-header trigger remains available when the sidebar is folded.
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      nav = await openNavigation(canvasElement);
      await expect(nav.getByRole('link', { name: 'Citations' })).toHaveAttribute('aria-current', 'page');
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

export const ResearchAssistant = {
  name: 'Floating sidebar · library research assistant with answer modes, sources and cited replies',
  ...pattern('research-assistant', 'A research assistant over your own library on a floating sidebar that collapses to icons: New question, an Answer from picker (Library, Library + web, Deep read) kept in step with the header Mode picker, a pinned notes card, Sources with counts, recent questions with row menus (save, pin, delete) and a reader menu. A new question opens on a welcome canvas whose starter prompts fill the composer (attach a PDF, cite a bookmark or quote a note); asking adds the question and a cited reply, and opening a past question shows its loading skeleton. The header saves the answer to a notebook. In a narrow frame the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    await expect(main.getByRole('heading', { name: 'What are you researching?' })).toBeVisible();
    // The header picker and the sidebar tiles choose the same mode.
    await userEvent.click(main.getByRole('button', { name: 'Mode: Library' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Library \+ web/ }));
    await waitFor(() => expect(main.getByRole('button', { name: 'Mode: Library + web' })).toBeVisible());
    let nav = await navigation(canvasElement);
    await expect(nav.getByRole('radio', { name: 'Library + web' })).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(nav.getByRole('radio', { name: 'Deep read' }));
    // The open phone sheet hides the page from assistive technology, so look past it.
    await waitFor(() => expect(main.getByRole('button', { name: 'Mode: Deep read', hidden: true })).toBeInTheDocument());
    // Pin a recent question from its row menu; it moves to the pinned cards.
    await userEvent.click(nav.getByRole('button', { name: 'Actions for Timeline of the printing press' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Pin question' }));
    await waitFor(() => expect(nav.getAllByRole('link', { name: /Timeline of the printing press/ })).toHaveLength(1));
    await userEvent.click(nav.getByRole('link', { name: /Compare spaced repetition studies/ }));
    nav = await navigation(canvasElement);
    await expect(nav.getByRole('link', { name: /Compare spaced repetition studies/ })).toHaveAttribute('aria-current', 'page');
    // A new question: a starter prompt fills the composer and asking adds the turn.
    await userEvent.click(nav.getByRole('button', { name: 'New question' }));
    await userEvent.click(await main.findByRole('button', { name: /Build a reading plan on memory/ }));
    const prompt = main.getByRole('combobox', { name: 'Ask your library' });
    await expect(prompt).toHaveValue('Build a reading plan on memory');
    await userEvent.click(main.getByRole('button', { name: 'Ask' }));
    const thread = within(await main.findByRole('region', { name: 'Conversation' }));
    await expect(thread.getByText('Build a reading plan on memory')).toBeVisible();
    await expect(prompt).toHaveValue('');
    const sidebar = dockedSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await expect(within(sidebar).getByRole('link', { name: 'Highlights' })).toBeVisible();
      // On the rail the trigger sits in the page header.
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    }
  }
};

export const NewsletterReader = {
  name: 'Newsletter reader · library and topics sidebar, issue list, reading pane and a reading-tools rail',
  ...pattern('newsletter-reader', 'A reader for subscribed newsletters in a mail-client layout: a reader menu (subscriptions, OPML import), Share a read (a dialog that sends an issue with a note), Library views with counts, Topics with a new-topic dialog, a reading circle with presence and footer links, in a sidebar that collapses to icons from the list header. The issue list searches and filters by kind (an empty state offers to clear filters); choosing an issue opens it in the reading pane with previous and next, reading time, read, read-later, star and archive actions and a Save to notebook button, and a rail of reading tools sits on the far edge of wide frames. In a narrow frame the list and the reading pane take turns and the sidebar opens as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await navigation(canvasElement);
    await expect(nav.getByRole('link', { name: /^Unread/ })).toHaveAttribute('aria-current', 'page');
    if (!dockedSidebar(canvasElement)) await userEvent.keyboard('{Escape}');
    const list = within(await main.findByRole('region', { name: 'Unread messages' }));
    // Search narrows the list; a miss shows the empty state, which clears the filters.
    await userEvent.type(list.getByRole('textbox', { name: 'Search issues' }), 'zzz');
    await expect(await list.findByText('Nothing to read here')).toBeVisible();
    await userEvent.click(list.getByRole('button', { name: 'clear filters' }));
    await expect(list.getByRole('textbox', { name: 'Search issues' })).toHaveValue('');
    // Open an issue, star it, then archive it.
    await userEvent.click(list.getByRole('button', { name: /Why we write in the margins/ }));
    const pane = within(main.getByRole('region', { name: 'Reading pane' }));
    await expect(await pane.findByRole('heading', { name: 'Why we write in the margins' })).toBeVisible();
    await userEvent.click(pane.getByRole('button', { name: 'Star issue' }));
    await expect(pane.getByRole('button', { name: 'Star issue' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(pane.getByRole('button', { name: 'Archive issue' }));
    await expect(await pane.findByText('Choose an issue to open it here')).toBeInTheDocument();
    await waitFor(() => expect(list.queryByRole('button', { name: /Why we write in the margins/ })).not.toBeInTheDocument());
    // Share an issue from the sidebar and find it in Shared.
    nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Share a read' }));
    const dialog = within(await body.findByRole('dialog', { name: 'Share a read' }));
    // On phones the sheet closes as the dialog opens; type once it has gone.
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull());
    await userEvent.type(dialog.getByRole('textbox', { name: 'To' }), 'ines@example.com');
    await userEvent.type(dialog.getByRole('textbox', { name: 'Title' }), 'The card catalogue');
    await userEvent.click(dialog.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Share a read' })).not.toBeInTheDocument());
    nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('link', { name: /^Shared/ }));
    await expect(await main.findByRole('button', { name: /The card catalogue/ })).toBeVisible();
    const sidebar = dockedSidebar(canvasElement);
    if (sidebar) {
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(main.getByRole('button', { name: 'Toggle Sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    }
  }
};

export const StudyChat = {
  name: 'Resizable sidebar · reading-group study threads, notes tab and a header tutor picker',
  ...pattern('study-chat', 'A study workspace for reading groups whose thread sidebar resizes from its edge (drag, or the arrow keys on the handle) and collapses to an icon rail where Pinned and Recent open as menus. Threads and Notes tabs, shortcuts with flashcard and group counts, collapsible Pinned and Recent groups with pin and row menus, a thread search palette, and an account menu that switches reading groups. The header carries the thread title, a spoiler guard, a tutor picker with each tutor\'s style, and thread options (share with group, make flashcards); the discussion shows its loading skeleton. In a narrow frame an app bar opens the sidebar as a sheet inside the window.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    await expect(main.getByRole('heading', { name: 'Book club: Middlemarch, chapters 1–10' })).toBeVisible();
    await userEvent.click(main.getByRole('button', { name: 'Tutor: Socratic tutor' }));
    await userEvent.click(await body.findByRole('option', { name: /Summariser/ }));
    await waitFor(() => expect(main.getByRole('button', { name: 'Tutor: Summariser' })).toBeVisible());
    const modelTrigger = main.getByRole('button', { name: 'Tutor: Summariser' });
    await waitFor(() => expect(modelTrigger).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(body.getByRole('listbox', { name: 'Tutor' })).toHaveFocus());
    await userEvent.tab();
    await expect(body.getByRole('link', { name: 'Compare tutors' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Tutor' })).not.toBeInTheDocument());
    await waitFor(() => expect(modelTrigger).toHaveFocus());
    // Pin a recent thread with its hover action; the Pinned count follows.
    let nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('button', { name: 'Pin Compare two Odyssey translations' }));
    await waitFor(() => expect(nav.getByRole('button', { name: 'Unpin Compare two Odyssey translations' })).toBeInTheDocument());
    await expect(nav.getByRole('button', { name: /Pinned\s*3/ })).toBeVisible();
    // The search palette opens a thread.
    await userEvent.click(nav.getAllByRole('button', { name: 'Search threads' })[0]);
    const dialog = await body.findByRole('dialog', { name: 'Search threads' });
    await userEvent.type(within(dialog).getByRole('combobox'), 'revolution');
    await userEvent.click(await within(dialog).findByRole('option', { name: /Quiz me on the French Revolution/ }));
    await waitFor(() => expect(main.getByRole('heading', { name: 'Quiz me on the French Revolution' })).toBeVisible());
    nav = await navigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Quiz me on the French Revolution' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('tab', { name: 'Notes' }));
    await expect(nav.getByRole('link', { name: 'middlemarch-themes.md' })).toBeVisible();
    await userEvent.click(nav.getByRole('link', { name: 'middlemarch-themes.md' }));
    await waitFor(() => expect(main.getByRole('heading', { name: 'middlemarch-themes.md' })).toBeVisible());
    nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('link', { name: 'Study guide', exact: true }));
    await waitFor(() => expect(main.getByRole('heading', { name: 'Study guide' })).toBeVisible());
    nav = await navigation(canvasElement);
    await userEvent.click(nav.getByRole('tab', { name: 'Threads' }));
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
      const previousDir = container.getAttribute('dir');
      try {
        container.setAttribute('dir', 'rtl');
        await userEvent.keyboard('{ArrowLeft}');
        await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '240'));
        await userEvent.keyboard('{ArrowRight}');
        await waitFor(() => expect(handle).toHaveAttribute('aria-valuenow', '224'));
      } finally {
        if (previousDir === null) container.removeAttribute('dir');
        else container.setAttribute('dir', previousDir);
      }
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Collapse sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Recent threads' }));
      await userEvent.click(await body.findByRole('menuitem', { name: /Questions on Gödel, Escher, Bach/ }));
      await waitFor(() => expect(main.getByRole('heading', { name: 'Questions on Gödel, Escher, Bach' })).toBeVisible());
      await userEvent.click(within(sidebar).getByRole('button', { name: 'Expand sidebar' }));
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
    await waitFor(() => expect(main.getByRole('button', { name: 'Tutor: Summariser' })).toBeVisible());
    await userEvent.click(modelTrigger);
    await waitFor(() => expect(body.getByRole('listbox', { name: 'Tutor' })).toHaveFocus());
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

export const TopbarCollections = {
  name: 'Library top bar · circle and collection switchers, grouped routes and an apps grid',
  ...pattern('topbar-collections', 'A shared reading library: the top bar leads with a New Entry menu (save a link, a note or a collection), then a notifications sheet, an apps grid, reading settings and the account menu, with reading-circle and collection switchers in the breadcrumb. Below it the sidebar groups Library, Research and Workspace routes under icon headings, with a monthly reading-goal meter at the foot. In a narrow frame the switchers move into the sidebar sheet and the button shortens to New.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    // The apps menu is a grid of nine launchers plus Browse All Apps.
    await userEvent.click(canvas.getByRole('button', { name: 'Apps' }));
    const apps = await body.findByRole('menu');
    await expect(within(apps).getAllByRole('menuitem')).toHaveLength(10);
    await userEvent.keyboard('{Escape}');
    // Notifications: dismissing removes a row; marking all read clears the count.
    await userEvent.click(canvas.getByRole('button', { name: /^Notifications/ }));
    const sheet = await body.findByRole('dialog', { name: /Notifications/ });
    await userEvent.click(within(sheet).getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(within(sheet).queryByText('Feed import paused')).not.toBeInTheDocument());
    await userEvent.click(within(sheet).getByRole('button', { name: 'Mark all as read' }));
    await waitFor(() => expect(within(sheet).getByRole('button', { name: 'Mark all as read' })).toBeDisabled());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: /Notifications/ })).not.toBeInTheDocument());
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Collections' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('link', { name: 'Highlights' }));
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Highlights' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('progressbar', { name: 'October reading goal' })).toHaveAttribute('aria-valuenow', '12');
    // The circle switcher sits in the top bar, or at the top of the phone sheet.
    const switchers = desktopSidebar(canvasElement) ? canvas : nav;
    await userEvent.click(switchers.getByRole('button', { name: 'Switch circle' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Thesis Group' }));
    await waitFor(() => expect(switchers.getByRole('button', { name: 'Switch circle' })).toHaveTextContent('Thesis Group'));
    await closeNavigation(canvasElement);
  }
};

export const TopbarJournal = {
  name: 'Journal top bar · section pills, sidebar page search and an inset notifications sheet',
  ...pattern('topbar-journal', 'A writing journal: the top bar carries Today, Entries, Prompts, Reviews and Archive pills, a New Entry menu, an inset notifications sheet (comments, a paused backup, a share request, a streak), editor settings and an account menu with a presence status. The sidebar opens with a page search that filters every route and counts the matches, groups Write, Reflect and Journal Settings pages, and ends with a daily word-goal meter. In a narrower frame the pills fold into a bottom sheet behind one button; on phones the sidebar opens as a sheet and choosing a search result closes it.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    // Section pills, or the sections sheet that replaces them in a narrow frame.
    const pills = canvas.queryByRole('navigation', { name: 'Journal sections' });
    if (pills && pills.checkVisibility()) {
      await userEvent.click(within(pills).getByRole('button', { name: 'Prompts' }));
      await expect(within(pills).getByRole('button', { name: 'Prompts' })).toHaveAttribute('aria-current', 'page');
    } else {
      await userEvent.click(canvas.getByRole('button', { name: 'Journal sections: Today' }));
      const sections = await body.findByRole('dialog', { name: 'Journal Sections' });
      await userEvent.click(within(sections).getByRole('button', { name: 'Prompts' }));
      await expect(await canvas.findByRole('button', { name: 'Journal sections: Prompts' })).toBeVisible();
    }
    // The inset notifications sheet resolves a share request in place.
    await userEvent.click(canvas.getByRole('button', { name: /^Notifications/ }));
    const sheet = await body.findByRole('dialog', { name: /Notifications/ });
    await expect(sheet).toHaveAttribute('data-inset', 'true');
    await userEvent.click(within(sheet).getByRole('button', { name: 'Approve' }));
    await expect(await within(sheet).findByText('Approved')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog', { name: /Notifications/ })).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('button', { name: /Account and status for Sami Okafor/ }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'Away' }));
    await expect(await canvas.findByRole('button', { name: 'Account and status for Sami Okafor: Away' })).toBeVisible();
    // The sidebar search filters pages and counts the matches.
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: "Today's Page" })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('progressbar', { name: "Today's word goal" })).toHaveAttribute('aria-valuenow', '640');
    await userEvent.click(nav.getByRole('button', { name: 'Search journal pages' }));
    const palette = await body.findByRole('dialog', { name: 'Search Journal' });
    await userEvent.type(within(palette).getByRole('combobox'), 'them');
    await expect(within(palette).getByRole('status')).toHaveTextContent('1 result');
    await userEvent.click(within(palette).getByRole('option', { name: /Themes/ }));
    await waitFor(() => expect(body.queryByRole('dialog', { name: 'Search Journal' })).not.toBeInTheDocument());
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).toBeNull());
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Themes' })).toHaveAttribute('aria-current', 'page');
    await closeNavigation(canvasElement);
  }
};

export const CrawlerControl = {
  name: 'Capture console · icon rail, capture queue tabs and expandable run feeds',
  ...pattern('crawler-control', 'A web-capture console for a reading library: an icon rail with section tooltips, help, settings and curator profile menus beside a Digest, Queue, Shelves and Issues panel. Queue shows the run distribution, capture stats and collapsible Scheduled, Active, Paused and Blocked lists; each active source expands (one at a time) into its pages, quota and timestamped run feed. The header search filters active sources and has a scope menu, followed by preferences, Ask Library and a primary Capture URL action; a sort menu orders the runs. In a narrow frame the rail and panel open together as one sheet and the labels fold to icons.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    // The header search filters the active queue.
    await userEvent.type(main.getByRole('searchbox', { name: 'Search sources' }), 'design');
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Expand Design blogs detail' })).toBeVisible();
    await expect(nav.queryByRole('button', { name: /Essays feed detail/ })).not.toBeInTheDocument();
    await closeNavigation(canvasElement);
    await userEvent.clear(main.getByRole('searchbox', { name: 'Search sources' }));
    nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('button', { name: 'Crawlers' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Sources' }));
    await expect(nav.getByRole('button', { name: 'Sources' })).toHaveAttribute('aria-current', 'page');
    // One run feed is open at a time.
    await expect(nav.getByRole('button', { name: 'Collapse City archive detail' })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(nav.getByRole('button', { name: 'Expand Essays feed detail' }));
    await expect(nav.getByRole('button', { name: 'Collapse Essays feed detail' })).toHaveAttribute('aria-expanded', 'true');
    await expect(nav.getByRole('button', { name: 'Expand City archive detail' })).toHaveAttribute('aria-expanded', 'false');
    await expect(nav.getByText('Summarizing')).toBeInTheDocument();
    await userEvent.click(nav.getByRole('button', { name: 'Expand scheduled' }));
    await expect(await nav.findByText(/Shelf D/)).toBeVisible();
    await userEvent.click(nav.getByRole('button', { name: 'Sort runs' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: 'By Name' }));
    await waitFor(() => {
      const rows = nav.getAllByRole('button', { name: /^(Expand|Collapse) .+ detail$/ }).map((button) => button.getAttribute('aria-label'));
      expect(rows[0]).toMatch(/City archive/);
    });
    await userEvent.click(nav.getByRole('tab', { name: 'Issues' }));
    await expect(await nav.findByText('Issues Shown Inline')).toBeVisible();
    await userEvent.click(nav.getByRole('tab', { name: 'Queue' }));
    await userEvent.click(nav.getByRole('button', { name: /Open profile for Ines Duarte/ }));
    await expect(await body.findByRole('menuitem', { name: /Sign-In Security/ })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await closeNavigation(canvasElement);
  }
};

export const SourceNetwork = {
  name: 'Source tile rail · workspace tabs, section tiles and a status-badged source tree',
  ...pattern('source-network', 'A knowledge-source console: Sources, Readers and Activity workspace tabs swap a grid of section tiles and the tree below it (subscriptions, archives, reading queues and feed formats; reading circles; capture streams) with counts, status badges, inline Add, Review and Manage actions and indent guides, and arrow-key navigation from the Gaudi Tree. A sync-status line sits at the sidebar foot and the account menu beside the header search. The collapse button folds the sidebar to an icon strip with tooltips; ⌘F / Ctrl+F focuses the search while focus is in the window. In a narrow frame the sidebar opens as a sheet from the header.'),
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
    await expect(nav.getByRole('treeitem', { name: /^Unread/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(nav.getByRole('treeitem', { name: /^Blogs/ }));
    await expect(nav.getByRole('treeitem', { name: /^Blogs/ })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(await nav.findByRole('treeitem', { name: /^Cities/ }));
    await expect(nav.getByRole('treeitem', { name: /^Cities/ })).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(nav.getByRole('button', { name: 'Feeds' }));
    await expect(nav.getByRole('button', { name: 'Feeds' })).toHaveAttribute('aria-current', 'page');
    // Workspace tabs swap the tiles and the tree.
    await userEvent.click(nav.getByRole('tab', { name: 'Readers' }));
    await expect(await nav.findByRole('treeitem', { name: /^Reading Circles/ })).toBeVisible();
    await expect(nav.getByRole('button', { name: 'Members' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.getByRole('status')).toHaveTextContent('All sources synced');
    if (docked) {
      await userEvent.click(canvas.getByRole('button', { name: 'Collapse navigation' }));
      await waitFor(() => expect(docked).toHaveAttribute('data-state', 'collapsed'));
      await userEvent.click(canvas.getByRole('button', { name: 'Sessions' }));
      await expect(canvas.getByRole('button', { name: 'Sessions' })).toHaveAttribute('aria-current', 'page');
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
