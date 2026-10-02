import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../test-support/renderComponent.js';

test('AppShell preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('./AppShell.jsx', import.meta.url),
    { brand: 'Notebook', navigation: 'Navigation links', children: 'Content' }
  );
  assert.match(html, /<main/);
  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Workspace navigation"/);
});

test('Sidebar menu buttons only mark the active row with data-active', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const {
    SidebarProvider,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton
  } = await loadComponent(new URL('./parts/sidebar.jsx', import.meta.url));
  const html = renderToStaticMarkup(
    h(
      SidebarProvider,
      null,
      h(
        SidebarMenu,
        null,
        h(SidebarMenuItem, null, h(SidebarMenuButton, { isActive: true }, 'Inbox')),
        h(SidebarMenuItem, null, h(SidebarMenuButton, null, 'Drafts')),
        h(
          SidebarMenuSub,
          null,
          h(SidebarMenuSubItem, null, h(SidebarMenuSubButton, { isActive: true, href: '#a' }, 'Active child')),
          h(SidebarMenuSubItem, null, h(SidebarMenuSubButton, { href: '#b' }, 'Idle child'))
        )
      )
    )
  );
  assert.doesNotMatch(html, /data-active="false"/);
  assert.equal(html.match(/data-active="true"/g)?.length, 2);
  assert.match(html, /data-active="true"[^>]*>Inbox</);
  assert.match(html, /data-active="true"[^>]*>Active child</);
});

test('AppShell renders a top bar layout, a named detail rail and a status bar', async () => {
  const url = new URL('./AppShell.jsx', import.meta.url);
  const topbar = await renderComponent(url, { layout: 'topbar', brand: 'Gaudi', navigation: 'Sections', children: 'Content' });
  assert.match(topbar, /data-layout="topbar"/);
  assert.doesNotMatch(topbar, /ds-app-rail/);
  assert.match(topbar, /class="ds-app-topnav"/);
  const full = await renderComponent(url, { brand: 'Gaudi', navigation: 'Nav', aside: 'Details body', asideLabel: 'Issue details', statusBar: 'Synced', children: 'Content' });
  assert.match(full, /<aside aria-label="Issue details" class="ds-app-aside">Details body<\/aside>/);
  assert.match(full, /class="ds-app-status">Synced</);
  assert.match(full, /data-aside="true"/);
});

test('Sidebar trigger reports its state and shortcut, and toggles are announced', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { SidebarProvider, SidebarTrigger } = await loadComponent(new URL('./parts/sidebar.jsx', import.meta.url));
  const html = renderToStaticMarkup(h(SidebarProvider, { storageKey: 'test-sidebar' }, h(SidebarTrigger)));
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /aria-keyshortcuts="Meta\+B Control\+B"/);
  assert.match(html, /role="status" aria-live="polite"/);
  const quiet = renderToStaticMarkup(h(SidebarProvider, { shortcut: false, defaultOpen: false }, h(SidebarTrigger, { label: 'Show navigation' })));
  assert.doesNotMatch(quiet, /aria-keyshortcuts/);
  assert.match(quiet, /aria-expanded="false"/);
  assert.match(quiet, />Show navigation</);
});

test('useMediaQuery keeps the fallback during server rendering', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { useMediaQuery } = await import('../../../hooks/environment/use-media-query.js');
  const Probe = ({ fallback }) => h('span', null, String(useMediaQuery('(min-width: 1024px)', fallback)));
  assert.equal(renderToStaticMarkup(h(Probe, { fallback: true })), '<span>true</span>');
  assert.equal(renderToStaticMarkup(h(Probe, { fallback: false })), '<span>false</span>');
});

test('AppShellFrame presents a shell as a bounded app window and sidebar parts fill it', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  // One bundle, so the frame context is shared by the frame and the sidebar parts.
  const { AppShellFrame, AppShellPanel, AppShellHeader, AppShellBody, SidebarProvider, Sidebar, SidebarRail } = await loadComponent(new URL('./index.js', import.meta.url));
  const html = renderToStaticMarkup(
    h(AppShellFrame, { height: 600, label: 'Example app' },
      h(SidebarProvider, { shortcut: false },
        h(Sidebar, { collapsible: 'icon' }, 'Navigation', h(SidebarRail, { handle: true })),
        h(AppShellPanel, null, h(AppShellHeader, { bordered: true }, 'Crumbs'), h(AppShellBody, null, 'Body'))
      )
    )
  );
  assert.match(html, /role="region" aria-label="Example app" data-slot="app-shell-frame" data-surface="muted"/);
  assert.match(html, /--ds-app-shell-frame-height:600px/);
  // Inside a frame the wrapper fills the window instead of the viewport, and the rail is positioned against it.
  assert.match(html, /data-slot="sidebar-wrapper"[^>]*class="[^"]*\bh-full\b/);
  assert.doesNotMatch(html, /data-slot="sidebar-wrapper"[^>]*class="[^"]*min-h-svh/);
  assert.match(html, /data-slot="sidebar-container"[^>]*class="[^"]*\babsolute\b/);
  assert.doesNotMatch(html, /data-slot="sidebar-container"[^>]*class="[^"]*h-svh/);
  assert.match(html, /<main data-slot="app-shell-panel" data-inset="true"/);
  assert.match(html, /<header data-slot="app-shell-header" data-bordered="true"/);
  // The rail handle names the action it performs and reports the state.
  assert.match(html, /aria-label="Collapse sidebar" aria-expanded="true"/);
  const flush = renderToStaticMarkup(h(AppShellFrame, { surface: 'default' }, h(AppShellPanel, { inset: false }, 'Body')));
  assert.match(flush, /data-surface="default"/);
  assert.doesNotMatch(flush, /data-inset/);
  // Outside a frame the sidebar keeps its viewport behaviour.
  const bare = renderToStaticMarkup(h(SidebarProvider, { shortcut: false }, h(Sidebar, null, 'Navigation')));
  assert.match(bare, /min-h-svh/);
  assert.match(bare, /data-slot="sidebar-container"[^>]*class="[^"]*\bfixed\b/);
});

test('placeholder grids fill cards with static, decorative skeletons', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AppShellPlaceholderGrid, AppShellPlaceholder } = await loadComponent(new URL('./parts/placeholder.jsx', import.meta.url));
  const html = renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'grid', variant: 'solid' }));
  assert.match(html, /data-slot="app-shell-placeholder-grid" data-preset="grid" aria-hidden="true"/);
  assert.equal(html.match(/data-slot="app-shell-placeholder"/g)?.length, 7);
  assert.equal(html.match(/data-span="wide"/g)?.length, 1);
  assert.match(html, /data-variant="solid"/);
  assert.match(html, /class="ds-part-skeleton animate-none/);
  assert.doesNotMatch(html, /animate-pulse/);
  const animated = renderToStaticMarkup(h(AppShellPlaceholder, { kind: 'chart', animated: true }));
  assert.match(animated, /animate-pulse/);
  assert.match(animated, /motion-reduce:animate-none/);
  // Fixed shapes keep server and client markup identical.
  assert.equal(renderToStaticMarkup(h(AppShellPlaceholderGrid)), renderToStaticMarkup(h(AppShellPlaceholderGrid)));
});

test('AppShellNav marks the current page, remembers a section view and labels badges, tags and dots', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AppShellNav, SidebarProvider } = await loadComponent(new URL('./index.js', import.meta.url));
  const items = [
    { id: 'overview', label: 'Overview', icon: 'House' },
    { id: 'pipelines', label: 'Pipelines', icon: 'Zap', defaultOpen: true, defaultValue: 'deployments', items: [{ id: 'runs', label: 'Build Runs' }, { id: 'deployments', label: 'Deployments' }] },
    { id: 'observability', label: 'Observability', icon: 'Activity', badge: 14 },
    { id: 'api', label: 'API Gateway', dot: 'success', status: 'healthy', tag: 'Prod' }
  ];
  const html = renderToStaticMarkup(h(SidebarProvider, { shortcut: false }, h(AppShellNav, { label: 'Platform', items, value: 'overview', collapsible: true, hideOnRail: true })));
  assert.equal(html.match(/aria-current="page"/g)?.length, 1);
  assert.match(html, /href="#overview" aria-current="page"/);
  assert.match(html, /data-active="true"[^>]*><span>Deployments<\/span>/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, />14</);
  assert.match(html, />Prod</);
  assert.match(html, /class="sr-only">, healthy</);
  assert.match(html, /group-data-\[collapsible=icon\]:hidden/);
});
