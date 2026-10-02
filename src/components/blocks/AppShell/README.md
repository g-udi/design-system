# App Shell

## Patterns

The app-shell examples (`Blocks/App Shell` → `AppShellPattern1…13`) recreate the reui application shells at <https://reui.io/blocks/application/app-shell> in Gaudi code. reui blocks are Pro: match the design and behaviour from the live previews (`https://reui.io/preview/base/app-shell-<n>`), never their source. Every example follows these conventions so parallel work stays consistent.

**Files and names**

- Fixture `.storybook/fixtures/patterns/app-shell/c-app-shell-<n>.jsx` (n = 1–13, in reui's order) exports `Pattern`. It imports Gaudi parts by relative path (`src/components/...`, `src/icons/RegistryIcon.jsx`, `src/hooks/...`); Storybook rewrites them to public `@gaudi/design-system/...` imports for the copyable source. New part files need entries in `.storybook/fixtures/patterns/public-names.json`.
- Story `export const AppShellPattern<n> = { name, ...pattern(<n>, description), play }` in `AppShellPatterns.stories.jsx`, in numeric order. `name` is `Topology · key features` (for example `Icon rail · workspace switcher, nested nav and user menu`); the description says what the reader can do and how it behaves in a narrow frame.
- Each story has a play test built from the shared helpers at the top of the stories file: `expectFramed`, `openNavigation` (the docked sidebar, or the phone sheet opened from the header) and `desktopSidebar`. Test the current page (`aria-current`), at least one menu, nested navigation, and collapse/expand when the sidebar is docked. The vitest browser is phone sized, so tests must pass in both layouts.
- Add the example to `.storybook/fixtures/patterns/coverage.json` (`name`, `title`, `description`, `file`, `sha256` of the fixture bytes, `storyId` `blocks-application-appshell--app-shell-pattern-<n>`), update the app-shell count and total in `PATTERN-COVERAGE.md`, then run `pnpm catalogue:sync`.

**Visual vocabulary** (reuse these parts; do not restyle them per fixture)

- `AppShellFrame` is the root of every example: the bordered app window on the shared card radius, 48rem tall (40rem on phones), with internal scrolling. Use `surface='muted'` (default) when the content sits in an inset panel and `surface='default'` for floating sidebars on a plain page.
- `SidebarProvider` → `Sidebar` (`collapsible='icon'` for rails, `variant='floating'` for cards) → `AppShellPanel` (the `main` landmark; `inset` by default, `inset={false}` beside a floating sidebar). `AppShellHeader` holds the trigger (render `SidebarTrigger` there when `useSidebar().isMobile`), breadcrumb and actions; `AppShellBody` holds the page.
- `AppShellNav` renders sidebar groups from data: icons or status dots, count `badge`, inline `tag`, live `indicator`, nested `items` (collapsible, a flyout menu on the icon rail, remembered section view), `collapsible` group labels, `hideOnRail`, and `actions` row menus. Use `itemClassName` for topology-specific active rows (for example raised rows on a floating card).
- `AppShellNav` also takes `item.leading` (a custom mark such as a `ProgressRing` or a presence avatar; speak its value through `status`) and `action` (a `SidebarGroupAction` at the end of the group label). Rows with a count badge keep their label clear of it.
- `SidebarRail handle` is the edge grip that folds into a chevron and toggles the rail. Several shells share the docs page, so give at most one of them the ⌘B shortcut (`shortcut={false}` on the others).
- Where reui shows empty placeholder areas, use `AppShellPlaceholderGrid` with a preset (`dashboard`: 3 small + 1 large; `grid`: 3 × 2 + 1 wide; `split`: 2/3 + 1/3 then a table; `list`: one table) and `variant='dashed'` or `'solid'` to match the reference, or compose `AppShellPlaceholder` cards (`kind` `stat`, `chart`, `table`, `text`; `size` `sm`, `md`, `lg`). They are static Gaudi Skeletons in bordered cards; add a preset or kind to `parts/placeholder.jsx` rather than drawing new placeholders in a fixture.
- Chat, mail and resizable shells (7–9) add: `SidebarProvider defaultWidth` with `SidebarResizeHandle` (a focusable separator on the edge: drag, arrow keys, Home/End, double-click resets), the `chat` and `thread` placeholder presets with `variant='bare'` for an unloaded conversation, and `AppShellNav` people rows (`avatar`, `presence`, `suffix`), bare counts (`badge: { label, variant: 'plain' }`), a hover `quickAction` beside the row menu and a `action`. Chat shells compose the Chat parts (`ChatModelSelect` with model `icon`/`details`, `PromptComposer actions`, `ChatWelcome suggestionsVariant='cards'`).
- Overlays: menus and tooltips portal to the page; the phone sidebar sheet opens inside the frame. Command palettes (`CommandDialog`) open over the page.
- Gaudi tokens only: semantic colours (`bg-success`, `text-text-muted`…), `rounded-(--ds-radius-control)` / `--ds-radius-card` for tiles and cards (circles only for dots and avatars), registry icons through `RegistryIcon`, brand marks from `src/icons/brands`, real portraits from `https://randomuser.me/api/portraits/...` for avatars, and the shared hooks (`useHotkey` for ⌘K).
- Check each example at 320, 390, 768, 1024, 1280 and 1600 px in light and dark: the frame border is visible inside the preview, nothing overflows the page, and the rail, nested navigation, menus and phone sheet work.

## Overview

Application frames at three levels:

- **`AppShell`**: a simple responsive workspace with a navigation rail (or a top bar), a mobile navigation sheet, a header, the content landmark, a skip link, an optional detail rail and an optional status bar. It stays in document flow.
- **Sidebar parts** (`SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, `SidebarRail`, menus, groups and sub-menus): for richer shells, such as a rail that collapses to icons, floating and inset sidebars, nested groups with badges and row menus, secondary panels, and right-hand inspectors. On phones the sidebar becomes a Sheet drawer.
- **Frame parts** (`AppShellFrame`, `AppShellPanel`, `AppShellHeader`, `AppShellBody`, `AppShellNav`, `AppShellPlaceholderGrid`): present either kind of shell as an app window inside a page, a marketing section or a documentation preview.

## Usage

```jsx
import AppShell, { AppShellFrame } from '@gaudi/design-system/blocks/AppShell';

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

// Inside a page, present the shell as an app window.
<AppShellFrame>
  <AppShell brand='Gaudi' navigation={navigation}>…</AppShell>
</AppShellFrame>
```

```jsx
import {
  AppShellBody, AppShellFrame, AppShellHeader, AppShellNav, AppShellPanel, AppShellPlaceholderGrid,
  Sidebar, SidebarContent, SidebarProvider, SidebarRail
} from '@gaudi/design-system/blocks/AppShell';

<AppShellFrame>
  <SidebarProvider storageKey='gaudi-sidebar'>
    <Sidebar collapsible='icon'>
      <SidebarContent role='navigation' aria-label='Workspace'>
        <AppShellNav label='Platform' items={pages} value={page} onValueChange={setPage} />
      </SidebarContent>
      <SidebarRail handle />
    </Sidebar>
    <AppShellPanel>
      <AppShellHeader>{breadcrumb}</AppShellHeader>
      <AppShellBody>
        <AppShellPlaceholderGrid preset='dashboard' />
      </AppShellBody>
    </AppShellPanel>
  </SidebarProvider>
</AppShellFrame>
```

## Frame

`AppShellFrame` draws a bordered window on `--ds-radius-card` with clipped overflow and a fixed height (`height`, 48rem by default and 40rem below 640px; the CSS variables `--ds-app-shell-frame-height` and `--ds-app-shell-frame-height-compact` also set it). Content scrolls inside: `AppShellPanel` (and the simple `AppShell` workspace) scroll on their own, and the sidebar is positioned against the frame instead of the viewport. The frame measures itself, and sidebar parts switch to the phone layout when the frame, not the viewport, is narrower than `compactBelow` (640px). The phone sheet portals into the frame, so it opens inside the window. Menus, tooltips and dialogs still portal to the page.

## API

| Prop / export                             | Type                       | Contract                                                                                   |
| ----------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| `brand / navigation / header / footer`    | ReactNode                  | Supplied slot content; the host owns route state and active links.                         |
| `layout`                                  | `sidebar` / `topbar`       | A navigation rail, or brand and navigation in the header.                                  |
| `aside / asideLabel`                      | ReactNode / string         | A named complementary rail beside the content; stacks below it under xl.                   |
| `statusBar`                               | ReactNode                  | A status strip under the content.                                                          |
| `children`                                | ReactNode                  | Page content inside the shell main landmark.                                               |
| `navigationLabel / menuLabel / skipLabel` | string                     | Localized accessible labels.                                                               |
| `className`                               | string                     | Root composition; the desktop rail begins at 1024px.                                       |
| `AppShellFrame.height / compactBelow`     | string or number / number  | Window height (48rem; 40rem on phones) and the frame width for the phone layout (640).     |
| `AppShellFrame.surface / label`           | `muted` / `default`; string | The window surface, and an optional region name.                                          |
| `AppShellPanel.inset`                     | boolean                    | A bordered panel set into the frame (default), or flush beside a floating sidebar.         |
| `AppShellHeader.bordered`                 | boolean                    | A rule under the sticky panel header.                                                      |
| `AppShellNav`                             | items, value, …            | Data-driven sidebar group; see the Patterns section and the component docs.                |
| `AppShellPlaceholderGrid.preset / variant`| string                     | `dashboard`, `grid`, `split`, `list`; `dashed` or `solid` skeleton cards (static).         |
| `SidebarProvider.storageKey`              | string                     | Restores and saves the expanded state in localStorage after mount.                         |
| `SidebarProvider.shortcut`                | string / false             | The ⌘/Ctrl key that toggles the sidebar (`b`); `false` turns it off.                       |
| `SidebarProvider.labels`                  | object                     | `expanded`, `collapsed` announcements, the `toggle` trigger name, `collapse`/`expand` rail. |
| `Sidebar.variant / collapsible / side`    | string                     | `sidebar`, `floating` or `inset`; `offcanvas`, `icon` or `none`; edge.                     |
| `SidebarRail.handle`                      | boolean                    | A visible, focusable edge grip with a tooltip instead of the pointer-only strip.           |
| `SidebarTrigger.label / tooltip`          | string / boolean           | Trigger name, and a tooltip with the shortcut keys.                                        |
| `SidebarMenuButton.tooltip`               | string / object            | Names the item on the collapsed icon rail.                                                 |

## Accessibility

Keep the skip link and the main landmark, and name each navigation and complementary region. Mark the current page with `aria-current` (`AppShellNav` does; a remembered section view is only highlighted). The trigger reports `aria-expanded` and `aria-keyshortcuts`, the rail handle names the action it performs ("Collapse sidebar" / "Expand sidebar") and reports `aria-expanded`, and expanding or collapsing is announced politely. On phones the sidebar is a Sheet that traps focus and returns it to the trigger, and choosing a page closes it. Collapsed icon rails name every item with a tooltip, and nested sections open as menus. Status dots carry a spoken `status`; placeholder grids are decorative and hidden from assistive technology, and their skeletons do not animate.

When several shells share a page (as in these docs), turn the shortcut off on all but one, because each provider listens on the window.

## Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
