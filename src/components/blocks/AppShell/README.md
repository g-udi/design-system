# App Shell

Application frames at two levels:

- **`AppShell`**: a simple responsive workspace with a navigation rail (or a top bar), a mobile navigation sheet, a header, the content landmark, a skip link, an optional detail rail and an optional status bar. It stays in document flow.
- **Sidebar parts** (`SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, menus, groups and sub-menus): for richer shells, such as a rail that collapses to icons, floating and inset sidebars, nested groups with badges and row menus, secondary panels, and right-hand inspectors. On phones the sidebar becomes a Sheet drawer.

## Usage

```jsx
import AppShell from '@gaudi/design-system/blocks/AppShell';

<AppShell
  brand='Gaudi'
  navigation={navigation}
  header={<h1>Articles</h1>}
  aside={<IssueDetails />}
  statusBar={<span>All changes saved</span>}
>
  <DataTable columns={columns} rows={articles} searchable sortable pagination />
</AppShell>

// Sidebar-free apps put the brand and navigation in the header.
<AppShell layout='topbar' brand='Gaudi' navigation={sections} header={<UserMenu />}>…</AppShell>
```

```jsx
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from '@gaudi/design-system/blocks/AppShell';

<SidebarProvider storageKey='gaudi-sidebar'>
  <Sidebar collapsible='icon' variant='floating'>…</Sidebar>
  <SidebarInset>
    <header><SidebarTrigger /></header>
    …
  </SidebarInset>
</SidebarProvider>
```

## API

| Prop / export                             | Type                 | Contract                                                                 |
| ----------------------------------------- | -------------------- | ------------------------------------------------------------------------ |
| `brand / navigation / header / footer`    | ReactNode            | Supplied slot content; the host owns route state and active links.       |
| `layout`                                  | `sidebar` / `topbar` | A navigation rail, or brand and navigation in the header.                |
| `aside / asideLabel`                      | ReactNode / string   | A named complementary rail beside the content; stacks below it under xl. |
| `statusBar`                               | ReactNode            | A status strip under the content.                                        |
| `children`                                | ReactNode            | Page content inside the shell main landmark.                             |
| `navigationLabel / menuLabel / skipLabel` | string               | Localized accessible labels.                                             |
| `className`                               | string               | Root composition; the desktop rail begins at 1024px.                     |
| `SidebarProvider.storageKey`              | string               | Restores and saves the expanded state in localStorage after mount.       |
| `SidebarProvider.shortcut`                | string / false       | The ⌘/Ctrl key that toggles the sidebar (`b`); `false` turns it off.     |
| `SidebarProvider.labels`                  | object               | `expanded`, `collapsed` announcements and the `toggle` trigger name.    |
| `Sidebar.variant / collapsible / side`    | string               | `sidebar`, `floating` or `inset`; `offcanvas`, `icon` or `none`; edge.   |
| `SidebarTrigger.label / tooltip`          | string / boolean     | Trigger name, and a tooltip with the shortcut keys.                      |
| `SidebarMenuButton.tooltip`               | string / object      | Names the item on the collapsed icon rail.                               |

## Accessibility

Keep the skip link and the main landmark, and name each navigation and complementary region. Mark the current page with `aria-current`. The trigger reports `aria-expanded` and `aria-keyshortcuts`, and expanding or collapsing is announced politely. On phones the sidebar is a Sheet that traps focus and returns it to the trigger. Collapsed icon rails name every item with a tooltip.

When several shells share a page (as in these docs), turn the shortcut off on all but one, because each provider listens on the window.

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
