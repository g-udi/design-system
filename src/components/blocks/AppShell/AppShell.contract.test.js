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
