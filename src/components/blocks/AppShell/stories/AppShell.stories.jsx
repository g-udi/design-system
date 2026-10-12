import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { useState } from 'react';
import AppShell from '../AppShell';
import { AppShellFrame, AppShellNav, SidebarProvider } from '../index.js';
import Button from '../../../core/Button/index.js';
import { AppShellPlaceholderGrid } from './fixtures/AppShellPlaceholder.jsx';
import { desktopSidebar, expectFramed, expectHeaderToggle, openNavigation } from './AppShell.story-steps.js';

const docs = getComponentDocs('Blocks/App Shell');
const pattern = patternStories(
  'app-shell', import.meta.url,
  import.meta.glob('./fixtures/app-shell/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/app-shell/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default {
  title: 'Blocks/App Shell', id: 'blocks-application-appshell',
  component: AppShell,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => LibraryRail })
    }
  }
};

// The main example: the other app-shell compositions follow in AppShellPatterns.stories.jsx.
export const LibraryRail = {
  name: 'Icon rail · library switcher, nested collections and a reader menu',
  ...pattern('library-rail', 'A reading library in an app window with a collapsible icon rail: a library switcher, Library pages with an Inbox count and nested Collections and Notes sections, a collapsible Sources group whose sync states are spoken beside status dots and whose row menus sync or unsubscribe a feed, footer links and a reader menu. The header holds the breadcrumbs and a Capture action. The sidebar icon before the breadcrumbs folds it to icons with tooltips (nested sections open beside the rail); in a narrow frame the sidebar opens as a sheet inside the window. Skeleton blocks stand in for the reading view.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await expectFramed(canvasElement);
    const main = within(canvas.getByRole('main'));
    let nav = await openNavigation(canvasElement);
    await expect(nav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    // Collections remembers its last view while Home is the current page.
    await expect(nav.getByRole('link', { name: 'Highlights' })).toHaveAttribute('data-active', 'true');
    await expect(nav.getByRole('link', { name: 'Highlights' })).not.toHaveAttribute('aria-current');
    await userEvent.click(nav.getByRole('button', { name: 'Notes' }));
    await userEvent.click(await nav.findByRole('link', { name: 'Literature Notes' }));
    await waitFor(() => expect(main.getByText('Literature Notes')).toBeVisible());
    nav = await openNavigation(canvasElement);
    const notes = nav.getByRole('button', { name: 'Notes' });
    if (notes.getAttribute('aria-expanded') !== 'true') await userEvent.click(notes);
    await expect(await nav.findByRole('link', { name: 'Literature Notes' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(nav.getByRole('button', { name: 'Actions for Web Clipper' }));
    await userEvent.click(await body.findByRole('menuitem', { name: 'Unsubscribe' }));
    await waitFor(() => expect(nav.queryByRole('link', { name: /^Web Clipper/ })).not.toBeInTheDocument());
    await userEvent.click(nav.getByRole('button', { name: 'Library: Personal Library' }));
    await userEvent.click(await body.findByRole('menuitemradio', { name: /Reading Circle/ }));
    // Choosing a library can close the phone sheet; wait for it to settle, then reopen it.
    await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile][data-state="closed"]')).toBeNull());
    nav = await openNavigation(canvasElement);
    await waitFor(() => expect(nav.getByRole('button', { name: 'Library: Reading Circle' })).toBeVisible());
    // The phone sheet also carries data-state; only a docked sidebar collapses.
    const docked = desktopSidebar(canvasElement);
    const sidebar = docked?.dataset.mobile ? null : docked;
    if (sidebar) {
      const trigger = await expectHeaderToggle(canvasElement);
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
      const account = canvas.getByRole('button', { name: 'Account: Leila Haddad' });
      const avatar = account.querySelector('[data-slot="avatar"]');
      await waitFor(() => {
        const buttonBox = account.getBoundingClientRect();
        const avatarBox = avatar.getBoundingClientRect();
        expect(avatarBox.left).toBeGreaterThanOrEqual(buttonBox.left);
        expect(avatarBox.right).toBeLessThanOrEqual(buttonBox.right);
        expect(Math.abs((avatarBox.left + avatarBox.right) - (buttonBox.left + buttonBox.right))).toBeLessThan(1);
        expect(Math.abs((avatarBox.top + avatarBox.bottom) - (buttonBox.top + buttonBox.bottom))).toBeLessThan(1);
      });
      account.focus();
      await userEvent.keyboard('{Enter}');
      await expect(await body.findByRole('menuitem', { name: /^Profile/ })).toBeVisible();
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(account).toHaveFocus());
      await userEvent.click(canvas.getByRole('button', { name: 'Collections' }));
      await userEvent.click(await body.findByRole('menuitem', { name: 'Saved for Later' }));
      await waitFor(() => expect(main.getByText('Saved for Later')).toBeVisible());
      await userEvent.click(trigger);
      await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'expanded'));
    } else {
      await userEvent.keyboard('{Escape}');
    }
  }
};

export const LoadingLayouts = {
  name: 'Loading layouts',
  args: { preset: 'dashboard', variant: 'dashed', animated: false },
  argTypes: {
    preset: { control: 'select', options: ['dashboard', 'grid', 'split', 'list', 'chat', 'thread', 'stack', 'tiles', 'board', 'quad'] },
    variant: { control: 'select', options: ['dashed', 'solid', 'bare'] },
    animated: { control: 'boolean' }
  },
  parameters: { docs: { description: { story: 'Example-only loading layouts composed from Core Skeleton. Applications compose Skeleton around their own content; these presets are not package exports.' } } },
  render: (args) => <div className='@container min-h-96 w-full'><AppShellPlaceholderGrid {...args} /></div>
};

export const LinkDestinations = {
  name: 'Link destinations and callback pages',
  parameters: { docs: { description: { story: 'Explicit href values retain native navigation in expanded lists and collapsed menus. Items without href select a host-owned page; modifier-clicks keep native link behavior.' } } },
  render: function LinkDestinationsExample() {
    const [expanded, setExpanded] = useState(true);
    const [value, setValue] = useState('local');
    return <div className='grid w-full max-w-md gap-3'>
      <Button variant='outline' onClick={() => setExpanded((open) => !open)}>Toggle navigation rail</Button>
      <SidebarProvider open={expanded} onOpenChange={setExpanded} shortcut={false} className='min-h-0'>
        <AppShellNav value={value} onValueChange={setValue} items={[
          { id: 'destination', label: 'Destination link', href: '#app-shell-destination' },
          { id: 'local', label: 'Local page' },
          { id: 'projects', label: 'Projects', defaultOpen: true, items: [{ id: 'team', label: 'Team destination', href: '#app-shell-team' }] }
        ]} />
      </SidebarProvider>
      <output data-testid='selected-page' className='text-sm'>Selected: {value}</output>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const view = canvasElement.ownerDocument.defaultView;
    const navigations = [];
    const observeNavigation = (event) => {
      const link = event.target.closest('a');
      if (!link) return;
      navigations.push({ href: link.getAttribute('href'), prevented: event.defaultPrevented });
      event.preventDefault(); // Keep the test runner in its iframe after observing native behavior.
    };
    view.document.addEventListener('click', observeNavigation);
    try {
      await userEvent.click(canvas.getByRole('link', { name: 'Destination link' }));
      await expect(navigations.at(-1)).toEqual({ href: '#app-shell-destination', prevented: false });
      await expect(canvas.getByTestId('selected-page')).toHaveTextContent('Selected: destination');
      await userEvent.click(canvas.getByRole('link', { name: 'Local page' }));
      await expect(navigations.at(-1)).toEqual({ href: '#local', prevented: true });
      await expect(canvas.getByTestId('selected-page')).toHaveTextContent('Selected: local');
      await userEvent.click(canvas.getByRole('button', { name: 'Toggle navigation rail' }));
      const projectsMenu = canvas.queryByRole('button', { name: 'Projects' });
      if (projectsMenu?.getAttribute('aria-haspopup') === 'menu') {
        await userEvent.click(projectsMenu);
        await userEvent.click(await body.findByRole('menuitem', { name: 'Team destination' }));
      } else {
        await userEvent.click(canvas.getByRole('link', { name: 'Team destination' }));
      }
      await expect(navigations.at(-1)).toEqual({ href: '#app-shell-team', prevented: false });
      await expect(canvas.getByTestId('selected-page')).toHaveTextContent('Selected: team');
    } finally {
      view.document.removeEventListener('click', observeNavigation);
    }
  }
};


export const ResponsiveNavigation = {
  name: 'Native shell · responsive navigation',
  args: { layout: 'sidebar' },
  argTypes: { layout: { control: 'select', options: ['sidebar', 'topbar'] } },
  render: function ResponsiveNavigationExample(args) {
    const [narrow, setNarrow] = useState(false);
    return <div className='grid w-full grid-cols-1 gap-3'>
      <Button variant='outline' className='justify-self-start' onClick={() => setNarrow((value) => !value)}>{narrow ? 'Use wide window' : 'Use narrow window'}</Button>
      <div style={{ width: narrow ? 360 : '100%', maxWidth: '100%' }}>
        <AppShellFrame height={420}>
          <AppShell {...args} brand='Notebook' header='Workspace' navigation={<Button asChild variant='ghost'><a href='#workspace-home'>Home</a></Button>}>
            <h2 id='workspace-home' className='text-lg font-semibold'>Workspace overview</h2>
            <p className='text-sm text-text-muted'>The same navigation adapts to this window’s width.</p>
          </AppShell>
        </AppShellFrame>
      </div>
    </div>;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Use narrow window' }));
    const menu = await canvas.findByRole('button', { name: 'Open navigation' });
    await userEvent.click(menu);
    await waitFor(() => expect(body.getByRole('dialog', { name: 'Workspace navigation' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(menu).toHaveFocus());
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { page } = await import('vitest/browser');
      const original = { width: window.innerWidth, height: window.innerHeight };
      try {
        await page.viewport(1280, original.height);
        await userEvent.click(menu);
        await waitFor(() => expect(body.getByRole('dialog', { name: 'Workspace navigation' })).toBeVisible());
        // The host resizes the window while its drawer is open.
        canvasElement.querySelector('[data-slot="app-shell-frame"]').parentElement.style.width = '100%';
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
        await waitFor(() => expect(canvas.getByRole('link', { name: 'Home' })).toHaveFocus());
      } finally {
        canvasElement.querySelector('[data-slot="app-shell-frame"]').parentElement.style.width = '360px';
        await page.viewport(original.width, original.height);
      }
    }
  }
};
