import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'sidebar', import.meta.url,
  import.meta.glob('./fixtures/sidebar/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sidebar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Blocks/App Shell', id: 'blocks-application-appshell', tags: ['autodocs'], ...catalogueMeta('sidebar') };

export const SidebarWorkspaceSwitcher = { name: 'Workspace switcher', ...pattern('workspace-switcher', 'Grouped navigation with count badges, row menus and a footer account menu.') };
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
export const SidebarInspector = { name: 'Details panel on the right', ...pattern('inspector', 'A floating off-canvas panel with row actions, linked counts and a status badge.') };
export const SidebarFilterStates = { name: 'Search, loading and no-result states', ...pattern('filter-states', 'A filter field, skeleton rows while a refresh runs, and a real empty state.') };
