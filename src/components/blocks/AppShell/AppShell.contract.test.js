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
