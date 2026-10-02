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
