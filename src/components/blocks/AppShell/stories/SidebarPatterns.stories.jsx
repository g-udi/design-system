import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { closeMobileNavigation, openNavigation } from './AppShell.story-steps.js';

const pattern = patternStories(
  'sidebar', import.meta.url,
  import.meta.glob('./fixtures/sidebar/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sidebar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/App Shell', id: 'blocks-application-appshell', tags: ['autodocs'], ...catalogueMeta('sidebar') };

async function auditSidebarState(context, state, prepare) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({
    ...context,
    id: `${context.id}--${state}`,
    beforeAuditWidth: async () => {
      const body = within(context.canvasElement.ownerDocument.body);
      if (body.queryByRole('menu')) {
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
      }
      await prepare(await openNavigation(context.canvasElement));
    },
  });
}

export const SidebarWorkspaceSwitcher = {
  name: 'Workspace switcher',
  ...pattern('workspace-switcher', 'Grouped navigation with count badges, row menus and a footer account menu.'),
  play: async (context) => {
    const { canvasElement } = context;
    let navigation = await openNavigation(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    navigation.getByRole('button', { name: 'Gaudi Workspace, Pro plan' }).focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.click(await body.findByRole('menuitem', { name: 'Personal' }));
    const switcher = navigation.getByRole('button', { name: 'Personal, Free plan' });
    await waitFor(() => expect(switcher).toHaveFocus());
    await closeMobileNavigation(canvasElement);
    await expect(within(canvasElement).getByRole('link', { name: 'Personal' })).toBeVisible();
    navigation = await openNavigation(canvasElement);
    const rowAction = navigation.getByRole('button', { name: 'Actions for Checkout API' });
    rowAction.focus();
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('menuitem', { name: 'Rename' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(rowAction).toHaveFocus());
    const account = navigation.getByRole('button', { name: /Nadira Rahimi/ });
    account.focus();
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('menuitem', { name: /Sign out/ })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(account).toHaveFocus());
    await auditSidebarState(context, 'workspace-picker', async (current) => {
      const trigger = current.getByRole('button', { name: 'Personal, Free plan' });
      if (trigger.getAttribute('aria-expanded') !== 'true') await userEvent.click(trigger);
      await expect(await body.findByRole('menuitem', { name: 'Personal' })).toBeVisible();
    });
  },
};
export const SidebarIconRail = {
  name: 'Collapsible icon rail',
  ...pattern('icon-rail', 'Labels give way to tooltips at 3rem, with a rail and a trigger to drive it.'),
  play: async ({ canvasElement }) => {
    if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
    const { page } = await import('vitest/browser');
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const original = { width: window.innerWidth, height: window.innerHeight };
    try {
      await page.viewport(390, original.height);
      await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-state]')).not.toBeInTheDocument());
      await userEvent.click(canvas.getByRole('button', { name: 'Toggle Sidebar', exact: true }));
      await waitFor(() => expect(body.getByRole('dialog')).toBeVisible());
      await page.viewport(1440, original.height);
      await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
      await page.viewport(390, original.height);
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Toggle Sidebar', exact: true })).toHaveAttribute('aria-expanded', 'false'));
      await expect(body.queryByRole('dialog')).not.toBeInTheDocument();
    } finally {
      await page.viewport(original.width, original.height);
    }
  }
};
export const SidebarDocsSubmenus = {
  name: 'Documentation sub-menus',
  ...pattern('docs-submenus', 'Searchable documentation navigation with nested sections, docked beside the article on desktop and opened from its header as a drawer in narrow frames.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.queryByRole('button', { name: 'Toggle documentation navigation' });
    if (trigger) {
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const drawer = await body.findByRole('dialog', { name: 'Documentation navigation' });
      await waitFor(() => expect(drawer).toBeVisible());
      await waitFor(() => expect(within(drawer).getByRole('textbox', { name: 'Search the documentation' })).toHaveFocus());
    }
    const search = canvas.getByRole('textbox', { name: 'Search the documentation' });
    await userEvent.type(search, 'virtual');
    await expect(canvas.getByRole('link', { name: 'Virtualisation' })).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Anatomy' })).not.toBeInTheDocument();
    await userEvent.clear(search);
    await expect(canvas.getByRole('link', { name: 'Anatomy' })).toBeVisible();
    if (trigger) {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(body.queryByRole('dialog', { name: 'Documentation navigation' })).not.toBeInTheDocument());
      await waitFor(() => expect(trigger).toHaveFocus());
      await expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await expect(canvas.getByRole('heading', { name: 'Sidebar anatomy' })).toBeVisible();
    }
  }
};
export const SidebarInspector = {
  name: 'Details panel on the right',
  ...pattern('inspector', 'A floating off-canvas panel with row actions, linked counts and a status badge.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar', exact: true });
    await openNavigation(canvasElement);
    if (canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')) await closeMobileNavigation(canvasElement);
    else await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const navigation = await openNavigation(canvasElement);
    const action = navigation.getByRole('button', { name: 'Actions for Teo Kalnins' });
    action.focus();
    await userEvent.keyboard('{Enter}');
    await expect(await body.findByRole('menuitem', { name: 'Make owner' })).toBeVisible();
    await expect(body.getByRole('menuitem', { name: 'Remove' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(action).toHaveFocus());
    await auditSidebarState(context, 'assignee-actions', async (current) => {
      const currentAction = current.getByRole('button', { name: 'Actions for Teo Kalnins' });
      if (currentAction.getAttribute('aria-expanded') !== 'true') await userEvent.click(currentAction);
      await expect(await body.findByRole('menuitem', { name: 'Make owner' })).toBeVisible();
    });
  },
};
export const SidebarFilterStates = {
  name: 'Search, loading and no-result states',
  ...pattern('filter-states', 'A filter field, skeleton rows while a refresh runs, and a real empty state.'),
  play: async (context) => {
    const { canvasElement } = context;
    const navigation = await openNavigation(canvasElement);
    const search = navigation.getByRole('textbox', { name: 'Filter projects' });
    await userEvent.type(search, 'edge');
    await expect(navigation.getByRole('link', { name: 'Edge cache' })).toBeVisible();
    await expect(navigation.queryByRole('link', { name: 'Mobile client' })).not.toBeInTheDocument();
    await userEvent.clear(search);
    await userEvent.type(search, 'no-such-project');
    await expect(navigation.getByText(/No projects match/)).toBeVisible();
    await auditSidebarState(context, 'no-results', async (current) => {
      await expect(current.getByText(/No projects match/)).toBeVisible();
    });
    const current = await openNavigation(canvasElement);
    await userEvent.click(current.getByRole('button', { name: 'Clear filter' }));
    await expect(current.getByRole('textbox', { name: 'Filter projects' })).toHaveValue('');
    await expect(current.getByRole('textbox', { name: 'Filter projects' })).toHaveFocus();
    await expect(current.getByRole('link', { name: 'Mobile client' })).toBeVisible();
    await userEvent.click(current.getByRole('button', { name: 'Refresh projects' }));
    const list = canvasElement.querySelector('[aria-busy]');
    await expect(list).toHaveAttribute('aria-busy', 'true');
    await expect(current.queryByRole('link', { name: 'Mobile client' })).not.toBeInTheDocument();
    await waitFor(() => expect(list).toHaveAttribute('aria-busy', 'false'), { timeout: 2000 });
    await expect(current.getByRole('link', { name: 'Mobile client' })).toBeVisible();
  },
};
