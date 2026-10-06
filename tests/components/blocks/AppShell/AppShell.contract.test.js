import assert from 'node:assert/strict';
import test from 'node:test';
import { loadComponent, renderComponent } from '../../../support/renderComponent.js';

test('AppShell preserves its server-rendered public contract', async () => {
  const html = await renderComponent(
    new URL('../../../../src/components/blocks/AppShell/AppShell.jsx', import.meta.url),
    { brand: 'Notebook', navigation: 'Navigation links', children: 'Content' }
  );
  assert.match(html, /<main/);
  assert.match(html, /Skip to content/);
  assert.match(html, /aria-label="Workspace navigation"/);
});

test('sidebar skeleton widths match across independent server renders', async () => {
  const { createElement } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { SidebarMenuSkeleton } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/Sidebar.jsx', import.meta.url));
  const first = renderToStaticMarkup(createElement(SidebarMenuSkeleton, { showIcon: true }));
  const second = renderToStaticMarkup(createElement(SidebarMenuSkeleton, { showIcon: true }));
  assert.equal(first, second);
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
  } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/Sidebar.jsx', import.meta.url));
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
  const url = new URL('../../../../src/components/blocks/AppShell/AppShell.jsx', import.meta.url);
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
  const { SidebarProvider, SidebarTrigger } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/Sidebar.jsx', import.meta.url));
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
  const { useMediaQuery } = await import('../../../../src/hooks/environment/use-media-query.js');
  const Probe = ({ fallback }) => h('span', null, String(useMediaQuery('(min-width: 1024px)', fallback)));
  assert.equal(renderToStaticMarkup(h(Probe, { fallback: true })), '<span>true</span>');
  assert.equal(renderToStaticMarkup(h(Probe, { fallback: false })), '<span>false</span>');
});

test('AppShellFrame presents a shell as a bounded app window and sidebar parts fill it', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  // One bundle, so the frame context is shared by the frame and the sidebar parts.
  const { AppShellFrame, AppShellPanel, AppShellHeader, AppShellBody, SidebarProvider, Sidebar, SidebarTrigger } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/index.js', import.meta.url));
  const html = renderToStaticMarkup(
    h(AppShellFrame, { height: 600, label: 'Example app' },
      h(SidebarProvider, { shortcut: false },
        h(Sidebar, { collapsible: 'icon' }, 'Navigation'),
        h(AppShellPanel, null, h(AppShellHeader, { bordered: true }, h(SidebarTrigger), 'Crumbs'), h(AppShellBody, null, 'Body'))
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
  // The header toggle names the action and reports the state.
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /Toggle Sidebar/);
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
  const { AppShellPlaceholderGrid, AppShellPlaceholder } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/stories/fixtures/AppShellPlaceholder.jsx', import.meta.url));
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
  const { AppShellNav, SidebarProvider } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/index.js', import.meta.url));
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

test('a resizable sidebar takes its width from the provider and names its edge handle', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AppShellFrame, SidebarProvider, Sidebar, SidebarResizeHandle } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/index.js', import.meta.url));
  const html = renderToStaticMarkup(
    h(AppShellFrame, null, h(SidebarProvider, { shortcut: false, defaultWidth: 248 }, h(Sidebar, { collapsible: 'icon' }, 'Chats', h(SidebarResizeHandle, { min: 224, max: 384 }))))
  );
  assert.match(html, /--sidebar-width:248px/);
  assert.match(html, /role="separator" tabindex="0" aria-label="Resize sidebar" aria-orientation="vertical" aria-valuemin="224" aria-valuemax="384"/);
  // Without a width the sidebar keeps its default.
  const fixed = renderToStaticMarkup(h(SidebarProvider, { shortcut: false }, h(Sidebar, null, 'Nav')));
  assert.match(fixed, /--sidebar-width:16rem/);
});

test('the chat and thread placeholders draw a bare conversation, with or without a composer', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AppShellPlaceholderGrid } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/stories/fixtures/AppShellPlaceholder.jsx', import.meta.url));
  const chat = renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'chat', variant: 'bare' }));
  assert.match(chat, /data-kind="conversation" data-variant="bare"/);
  assert.match(chat, /ds-app-shell-placeholder-thread/);
  assert.match(chat, /ds-app-shell-placeholder-composer/);
  const thread = renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'thread', variant: 'bare' }));
  assert.match(thread, /data-kind="thread"/);
  assert.doesNotMatch(thread, /ds-app-shell-placeholder-composer/);
});

test('AppShellNav renders people, bare counts, a hover quick action and a group label action', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AppShellNav, SidebarProvider, SidebarGroupAction } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/index.js', import.meta.url));
  const items = [
    { id: 'inbox', label: 'Inbox', icon: 'Inbox', badge: { label: 3, variant: 'plain' } },
    { id: 'me', label: 'Nina Park', suffix: '(You)', avatar: '/avatars/person-20.svg', presence: 'success' }
  ];
  const html = renderToStaticMarkup(
    h(SidebarProvider, { shortcut: false },
      h(AppShellNav, {
        label: 'Mail',
        items,
        value: 'inbox',
        quickAction: (item) => ({ label: `Pin ${item.label}`, icon: 'Pin', onSelect: () => {} }),
        actions: () => 'Menu',
        action: h(SidebarGroupAction, { 'aria-label': 'Create label' }, '+')
      })
    )
  );
  assert.match(html, /data-variant="plain"[^>]*>3</);
  assert.match(html, /data-slot="app-shell-nav-avatar"/);
  assert.match(html, /bg-success/);
  assert.match(html, /> \(You\)</);
  assert.match(html, /aria-label="Pin Nina Park"/);
  assert.match(html, /aria-label="Actions for Inbox"/);
  assert.match(html, /aria-label="Create label"/);
});

test('shell composition additions: tile and list presets, a labelled route group and the notifications trigger', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { AppShellNav, AppShellNotifications, SidebarProvider } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/index.js', import.meta.url));
  const { AppShellPlaceholderGrid } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/stories/fixtures/AppShellPlaceholder.jsx', import.meta.url));
  const tiles = renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'tiles' }));
  assert.equal(tiles.match(/data-kind="block"/g)?.length, 9);
  const quad = renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'quad' }));
  assert.equal(quad.match(/data-span="half"/g)?.length, 4);
  assert.equal(renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'board' })).match(/data-kind="blank"/g)?.length, 3);
  assert.match(renderToStaticMarkup(h(AppShellPlaceholderGrid, { preset: 'stack' })), /data-kind="rows"/);
  const nav = renderToStaticMarkup(h(SidebarProvider, { shortcut: false }, h(AppShellNav, { label: 'Robot Fleet', labelIcon: 'Bot', items: [{ id: 'robots', label: 'Robots' }], value: 'robots' })));
  assert.match(nav, /data-slot="sidebar-group-label"[^>]*><svg/);
  const items = [
    { id: 'a', title: 'Dock 4 lost telemetry', unread: true },
    { id: 'b', title: 'Firmware rolled out', unread: true },
    { id: 'c', title: 'Audit shared' }
  ];
  const bell = renderToStaticMarkup(h(AppShellNotifications, { defaultItems: items }));
  assert.match(bell, /aria-label="Notifications, 2 unread"/);
  assert.match(bell, /aria-haspopup="dialog"/);
  const read = renderToStaticMarkup(h(AppShellNotifications, { defaultItems: items.map((item) => ({ ...item, unread: false })) }));
  assert.match(read, /aria-label="Notifications"/);
});

test('AppShellNav nests collapsible groups as ul > li only, and the skip link leaves the tab order under a modal', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { readFile } = await import('node:fs/promises');
  const { AppShellNav, SidebarProvider } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/index.js', import.meta.url));
  const items = [{ id: 'pipelines', label: 'Pipelines', icon: 'Zap', defaultOpen: true, items: [{ id: 'runs', label: 'Runs' }] }];
  const html = renderToStaticMarkup(h(SidebarProvider, { shortcut: false }, h(AppShellNav, { label: 'Platform', items, value: 'runs' })));
  // Every list's direct children are list items.
  for (const [, inner] of html.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/g)) {
    assert.doesNotMatch(inner.replace(/<li[\s\S]*?<\/li>/g, ''), /<(?!\/?li)[a-z]/);
  }
  assert.match(html, /<li[^>]*data-sidebar="menu-item"[^>]*>[\s\S]*<ul[^>]*data-slot="sidebar-menu-sub"[\s\S]*<li[^>]*data-slot="sidebar-menu-sub-item"/);
  const css = await readFile(new URL('../../../../src/components/blocks/AppShell/AppShell.css', import.meta.url), 'utf8');
  assert.match(css, /body\[data-scroll-locked\] \.ds-skip-link/);
  assert.doesNotMatch(css, /text-left|\bright-[0-9]|group-has-data-\[sidebar=menu-action\]\/menu-item:pr-8/);
});

test('Sidebar docks to the inline start: right in a right-to-left provider unless side is set', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const { DirectionProvider } = await loadComponent(new URL('../../../../src/components/core/Direction/index.js', import.meta.url));
  const { Sidebar, SidebarProvider } = await loadComponent(new URL('../../../../src/components/blocks/AppShell/Sidebar.jsx', import.meta.url));
  const render = (dir, props = {}) => renderToStaticMarkup(h(DirectionProvider, { dir }, h(SidebarProvider, { shortcut: false }, h(Sidebar, props, 'Nav'))));
  assert.match(render('ltr'), /data-side="left"/);
  assert.match(render('rtl'), /data-side="right"/);
  assert.match(render('rtl', { side: 'left' }), /data-side="left"/);
});


test('sidebar action controls do not implicitly submit enclosing forms', async () => {
  const { createElement: h } = await import('react');
  const { renderToStaticMarkup } = await import('react-dom/server');
  const api = await loadComponent(new URL('../../../../src/components/blocks/AppShell/Sidebar.jsx', import.meta.url));
  for (const name of ['SidebarTrigger', 'SidebarMenuButton', 'SidebarGroupAction', 'SidebarMenuAction', 'SidebarRail']) {
    const html = renderToStaticMarkup(h(api.SidebarProvider, { shortcut: false }, h(api[name])));
    assert.match(html, /<button[^>]*type="button"/, name);
  }
});
