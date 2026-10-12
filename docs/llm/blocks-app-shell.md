# App Shell

> Blocks/App Shell · blocks · `@gaudi/design-system/blocks/AppShell`

Application frames: a simple AppShell (rail or top bar, header, content, detail rail and status bar) and the Sidebar parts for collapsible icon rails, floating and inset sidebars, nested groups, secondary panels and right-hand inspectors.

## Import

```js
import AppShell from '@gaudi/design-system/blocks/AppShell';
// also: import { … } from '@gaudi/design-system/blocks';
```

Exports: `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellNotifications`, `AppShellPanel`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarRail`, `SidebarResizeHandle`, `SidebarSeparator`, `SidebarTrigger`, `default`, `useAppShellFrame`, `useSidebar`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `brand / navigation / header / footer` | `ReactNode` | — | no | Shell slots built from Gaudi components; footer sits at the foot of the rail. |
| `layout` | `sidebar \| topbar` | `sidebar` | no | A navigation rail, or brand and navigation in the header for sidebar-free apps. |
| `aside` | `ReactNode` | — | no | A complementary detail rail beside the content; it stacks below the content under xl. |
| `asideLabel` | `string` | `Details` | no | A complementary detail rail beside the content; it stacks below the content under xl. |
| `statusBar` | `ReactNode` | — | no | A status strip under the content, for sync state, counts or environment. |
| `navigationLabel` | `string` | `Workspace navigation` | no | Navigation landmark name. |
| `menuLabel / skipLabel` | `string` | `Open navigation / Skip to content` | no | Mobile trigger and skip-link labels. |
| `SidebarProvider.storageKey` | `string` | — | no | Restores and saves the expanded state in localStorage, after mount. |
| `SidebarProvider.shortcut` | `string \| false` | `b` | no | The ⌘/Ctrl key that toggles the sidebar; false turns it off. |
| `SidebarProvider.labels` | `{ expanded, collapsed, toggle }` | `English copy` | no | Announcements when the sidebar toggles, and the trigger name. |
| `Sidebar.variant` | `sidebar \| floating \| inset` | `sidebar` | no | Sidebar style, how it collapses and which edge it docks to; collapsed-row tooltips open toward the other edge. |
| `collapsible` | `offcanvas \| icon \| none` | `offcanvas` | no | Sidebar style, how it collapses and which edge it docks to; collapsed-row tooltips open toward the other edge. |
| `side` | `left \| right` | `inline start (left in LTR, right in RTL)` | no | Sidebar style, how it collapses and which edge it docks to; collapsed-row tooltips open toward the other edge. |
| `SidebarTrigger.label` | `string` | `Toggle Sidebar` | no | Trigger name and a tooltip showing the shortcut. |
| `tooltip` | `boolean` | `true` | no | Trigger name and a tooltip showing the shortcut. |
| `SidebarMenuButton.tooltip` | `string \| TooltipContent props` | — | no | Names the item on the collapsed icon rail. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `layout`: `sidebar`, `topbar`
- `collapsible`: `offcanvas`, `icon`, `none`
- `side`: `left`, `right`

## Usage

```jsx
import AppShell from '@gaudi/design-system/blocks/AppShell';

<AppShell brand={brand} navigation={navigation} header={header} aside={inspector}>
  <h1>Workspace overview</h1>
  {content}
</AppShell>
```

## Accessibility

Preserve the skip link and main landmark (it leaves the tab order while a modal is open), and name each navigation and complementary region. Mark the current page with aria-current. The mobile drawer keeps focus inside while open and restores it on close; the trigger reports aria-expanded and its shortcut, and toggles are announced politely.

## Examples

- Loading layouts (Storybook `blocks-application-appshell--loading-layouts`)
- Link destinations and callback pages (Storybook `blocks-application-appshell--link-destinations`)
- Native shell · responsive navigation (Storybook `blocks-application-appshell--responsive-navigation`)

Curated patterns:

- Capture console · icon rail, capture queue tabs and expandable run feeds — registry item `@gaudi/app-shell-crawler-control` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `GaudiLogo`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `RegistryIcon`, `Separator`, `Sidebar`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useSidebar`)
- Dual sidebar · digest inbox, reading-plan panel and an author directory — registry item `@gaudi/app-shell-digest-inbox` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Calendar`, `CheckboxRoot`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `ProgressRoot`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useAppShellFrame`, `useSidebar`)
- Finance dashboard · grouped sidebar, search and reports — registry item `@gaudi/app-shell-finance-dashboard` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `BarChart`, `Button`, `CardContent`, `CardRoot`, `Command`, `CommandEmpty`, `CommandFooter`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `DashboardGrid`, `DashboardPanel`, `DataTable`, `Dialog`, `DialogContent`, `DialogDescription`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DialogTrigger`, `EmptyState`, `GaudiBrand`, `GaudiLogo`, `Kbd`, `RegistryIcon`, `Select`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarProvider`, `SidebarTrigger`, `useHotkey`)
- Icon rail · library switcher, nested collections and a reader menu — registry item `@gaudi/app-shell-library-rail` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `useSidebar`)
- Newsletter reader · library and topics sidebar, issue list, reading pane and a reading-tools rail — registry item `@gaudi/app-shell-newsletter-reader` (uses `AppShellFrame`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DialogClosePrimitive`, `DialogContent`, `DialogDescription`, `DialogFooter`, `DialogHeader`, `DialogRoot`, `DialogTitle`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `EmailInput`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `Field`, `FieldInput`, `FieldLabel`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroupAction`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarTrigger`, `Textarea`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useSidebar`)
- Mini icon rail · research notebooks with per-section pages and view tabs — registry item `@gaudi/app-shell-notebook-tabs` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarBadge`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarGroupAction`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuItem`, `SidebarProvider`, `SidebarSeparator`, `SidebarTrigger`, `SkeletonRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useSidebar`)
- Inset icon rail · per-section navigation, site, publication and environment switchers — registry item `@gaudi/app-shell-publishing-console` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarGroup`, `AvatarImage`, `AvatarRoot`, `Badge`, `BreadcrumbItemPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `Kbd`, `ProgressRoot`, `RegistryIcon`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useAppShellFrame`, `useHotkey`, `useSidebar`)
- Floating sidebar · header ⌘K search, reading queue and shelf switcher — registry item `@gaudi/app-shell-reading-desk` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandShortcut`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `GaudiBrand`, `GaudiLogo`, `Kbd`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarSeparator`, `SidebarTrigger`, `SkeletonRoot`, `useHotkey`, `useSidebar`)
- Floating sidebar · library research assistant with answer modes, sources and cited replies — registry item `@gaudi/app-shell-research-assistant` (uses `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `ChatBubble`, `ChatBubbleContent`, `ChatMessage`, `ChatMessageAvatar`, `ChatMessageContent`, `ChatMessageParts`, `ChatModelSelect`, `ChatPromptComposer`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `EmptyState`, `GaudiBrand`, `GaudiLogo`, `InputGroupButton`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `ToggleGroupItem`, `ToggleGroupRoot`, `useSidebar`)
- Inset sidebar · study progress rings, reading goal and a header notifications feed — registry item `@gaudi/app-shell-research-projects` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarImage`, `AvatarRoot`, `Badge`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `GaudiBrand`, `GaudiLogo`, `Kbd`, `PopoverContentPrimitive`, `PopoverPrimitive`, `PopoverTriggerPrimitive`, `ProgressRing`, `ProgressRoot`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useAppShellFrame`, `useHotkey`, `useSidebar`)
- Source tile rail · workspace tabs, section tiles and a status-badged source tree — registry item `@gaudi/app-shell-source-network` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `GaudiBrand`, `GaudiLogo`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `Kbd`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarProvider`, `SkeletonRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `Tree`, `TreeItem`, `TreeItemLabel`, `useAppShellFrame`, `useHotkey`, `useSidebar`)
- Resizable sidebar · reading-group study threads, notes tab and a header tutor picker — registry item `@gaudi/app-shell-study-chat` (uses `AppShellBody`, `AppShellFrame`, `AppShellHeader`, `AppShellNav`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `ChatModelSelect`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandShortcut`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubContent`, `DropdownMenuSubTrigger`, `DropdownMenuTrigger`, `GaudiBrand`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarResizeHandle`, `SidebarSeparator`, `SidebarTrigger`, `SkeletonRoot`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useSidebar`)
- Library top bar · circle and collection switchers, grouped routes and an apps grid — registry item `@gaudi/app-shell-topbar-collections` (uses `AppShellBody`, `AppShellFrame`, `AppShellNav`, `AppShellNotifications`, `AppShellPanel`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `BreadcrumbItemPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `GaudiBrand`, `ProgressRoot`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useSidebar`)
- Journal top bar · section pills, sidebar page search and an inset notifications sheet — registry item `@gaudi/app-shell-topbar-journal` (uses `AppShellBody`, `AppShellFrame`, `AppShellNav`, `AppShellNotifications`, `AppShellPanel`, `AvatarBadge`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `DropdownMenuCheckboxItemPrimitive`, `DropdownMenuContent`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `GaudiLogo`, `ProgressRoot`, `RegistryIcon`, `Sheet`, `SheetContent`, `SheetDescription`, `SheetHeader`, `SheetTitle`, `SheetTrigger`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarHeader`, `SidebarProvider`, `SidebarTrigger`, `SkeletonRoot`, `TooltipContent`, `TooltipRoot`, `TooltipTrigger`, `useAppShellFrame`, `useSidebar`)
- Documentation sub-menus — registry item `@gaudi/sidebar-docs-submenus` (uses `AppShellFrame`, `AppShellHeader`, `Collapsible`, `CollapsibleContent`, `CollapsibleTrigger`, `GaudiBrand`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarGroup`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInput`, `SidebarInset`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSub`, `SidebarMenuSubButton`, `SidebarMenuSubItem`, `SidebarProvider`, `SidebarTrigger`, `cn`)
- Search, loading and no-result states — registry item `@gaudi/sidebar-filter-states` (uses `AppShellFrame`, `Button`, `CardContent`, `CardHeader`, `CardRoot`, `CardTitle`, `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInset`, `SidebarMenu`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarMenuSkeleton`, `SidebarProvider`, `SidebarSeparator`, `SidebarTrigger`, `cn`)
- Collapsible icon rail — registry item `@gaudi/sidebar-icon-rail` (uses `AppShellFrame`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Button`, `GaudiBrand`, `GaudiLogo`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInset`, `SidebarMenu`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarRail`, `SidebarTrigger`, `TooltipProvider`)
- Details panel on the right — registry item `@gaudi/sidebar-inspector` (uses `AppShellFrame`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuTrigger`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarTrigger`)
- Workspace switcher — registry item `@gaudi/sidebar-workspace-switcher` (uses `AppShellFrame`, `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `BreadcrumbItemPrimitive`, `BreadcrumbLinkPrimitive`, `BreadcrumbListPrimitive`, `BreadcrumbPagePrimitive`, `BreadcrumbRoot`, `BreadcrumbSeparatorPrimitive`, `Button`, `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `DropdownMenuContent`, `DropdownMenuGroup`, `DropdownMenuItemPrimitive`, `DropdownMenuLabelPrimitive`, `DropdownMenuRoot`, `DropdownMenuSeparatorPrimitive`, `DropdownMenuShortcut`, `DropdownMenuTrigger`, `GaudiBrand`, `GaudiLogo`, `RegistryIcon`, `Sidebar`, `SidebarContent`, `SidebarFooter`, `SidebarGroup`, `SidebarGroupAction`, `SidebarGroupContent`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarInset`, `SidebarMenu`, `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuButton`, `SidebarMenuItem`, `SidebarProvider`, `SidebarSeparator`, `SidebarTrigger`)

## Related

`blocks-navigation`

## README

### Patterns

The app-shell examples (`Blocks/App Shell`) are Gaudi compositions for knowledge, reading, research and finance workspaces: a library rail, a reading desk, research projects, a digest inbox, a publishing console, notebook tabs, a research assistant, a newsletter reader, study chat, two top-bar layouts (collections and journal), crawler control, a source network and a finance dashboard. The knowledge-work layouts were inspired by [reui](https://reui.io)'s [app-shell blocks](https://reui.io/blocks/application/app-shell); the names, content, data and structure are Gaudi's. Every example follows these conventions so parallel work stays consistent.

**Files and names**

- Fixture `src/components/blocks/AppShell/stories/fixtures/app-shell/app-shell-<slug>.jsx` exports `Pattern`; the slug is a short descriptive kebab-case name (for example `app-shell-library-rail`), never a number. Import Gaudi parts directly from public namespaces such as `@gaudi/design-system/blocks/AppShell`, `@gaudi/design-system/core/Button`, `@gaudi/design-system/icons/RegistryIcon`, and `@gaudi/design-system/hooks/interaction/use-hotkey`. Package self-reference lets the fixture and its copyable source share the same imports.
- Story `export const <Slug> = { name, ...pattern('<slug>', description), play }` lives in an owner-local story file: most patterns use `AppShellPatterns.stories.jsx`, the library rail is the primary story in `AppShell.stories.jsx`, and finance uses `FinanceDashboard.stories.jsx`. Keep the shared `Blocks/App Shell` title and owner ID. `name` is `Topology · key features` (for example `Icon rail · workspace switcher, nested nav and user menu`); the description says what the reader can do and how it behaves in a narrow frame.
- Each story has a play test built from `AppShell.story-steps.js` helpers: `expectFramed`, `openNavigation` (the docked sidebar, or the phone sheet opened from the header) and `desktopSidebar`. Cover the current page (`aria-current`), the example's actions, any menus or nested navigation, and collapse/expand when the sidebar is docked. The vitest browser is phone sized, so tests must pass in both layouts.
- Add the example to `src/docs/catalogue/coverage.json` (`name`, `title`, `description`, `file`, `sha256` of the fixture bytes, `storyId` `blocks-application-appshell--<slug>`), then run `pnpm catalogue:sync`.

**Visual vocabulary** (reuse these parts; do not restyle them per fixture)

- `AppShellFrame` is the root of every example: the bordered app window on the shared card radius, 48rem tall by default (40rem on phones), with internal scrolling. Use `surface='muted'` (default) when the content sits in an inset panel and `surface='default'` for a plain surface with a flush or floating sidebar.
- `SidebarProvider` → `Sidebar` (`collapsible='icon'` for rails, `variant='floating'` for cards) → `AppShellPanel` (the `main` landmark; `inset` by default, `inset={false}` for flush content). `AppShellHeader` holds breadcrumbs, search or actions. Place `SidebarTrigger` first in the header, or at the top inside `SidebarHeader` with a header trigger on phones; `AppShellBody` holds the page.
- `AppShellNav` follows explicit item `href` links; items without `href` invoke `onValueChange` without navigation. Modifier-clicks keep native link behavior. It renders sidebar groups from data: icons or status dots, count `badge`, inline `tag`, live `indicator`, nested `items` (collapsible, a flyout menu on the icon rail, remembered section view), `collapsible` group labels, `hideOnRail`, and `actions` row menus. Use `itemClassName` for topology-specific active rows (for example raised rows on a floating card).
- Collapsed `SidebarMenuButton` rows center their first visual and keep later children screen-reader-only. Portraits are capped at 24px to fit the rail; do not compensate with negative margins. Labels and account menus remain accessible.
- `AppShellNav` also takes `item.leading` (a custom mark such as a `ProgressRing` or a presence avatar; speak its value through `status`) and `action` (a `SidebarGroupAction` at the end of the group label). Rows with a count badge keep their label clear of it.
- Use `SidebarTrigger` at the top of the shell, inside the sidebar header or before the breadcrumbs. Keep the trigger visible and in the same place when collapsed; do not add a floating edge toggle or reserve a gutter for one. Several shells share the docs page, so give at most one of them the ⌘B shortcut (`shortcut={false}` on the others).
- Compose Core `Skeleton` for loading content. Rich placeholder layouts live only in `stories/fixtures/AppShellPlaceholder.jsx` and the Loading layouts story; they are example compositions, not package exports.
- The research-assistant, newsletter-reader and study-chat shells add: `SidebarProvider defaultWidth` with `SidebarResizeHandle` (a focusable separator on the edge: drag, arrow keys, Home/End, double-click resets), Core Skeleton compositions for an unloaded conversation, and `AppShellNav` people rows (`avatar`, `presence`, `suffix`), bare counts (`badge: { label, variant: 'plain' }`), a hover `quickAction` beside the row menu and a `action`. Chat shells compose the Chat parts (`ChatModelSelect` with model `icon`/`details`, `ChatPromptComposer actions`) and Core `EmptyState` with a labelled list of Core `Button` starter prompts in a responsive grid.
- More placeholder presets: `tiles` (3 × 3 block cards), `board` (tiles under a row of blank cards), `quad` (four short cards above a 2 × 2 grid) and `stack` (three metric tiles above a tall list), from the `block`, `blank`, `tile` and `rows` kinds.
- Top bars spanning the window: give `SidebarProvider` `className='flex-col'`, render the header first and put `Sidebar` and `AppShellPanel` in a `relative flex` row below it. `AppShellNotifications` is the bell and notifications sheet (`inset` floats it); `Sidebar` takes `mobileWidth`, `mobileClassName`, `mobileTitle` and `mobileDescription` for a wider or renamed phone sheet; `AppShellNav` takes `labelIcon` and `labelClassName` for route-group headings.
- Overlays: menus and tooltips portal to the page; the phone sidebar sheet opens inside the frame. Command palettes (`CommandDialog`) open over the page.
- Gaudi tokens only: semantic colours (`bg-success`, `text-text-muted`…), `rounded-(--ds-radius-control)` / `--ds-radius-card` for tiles and cards (circles only for dots and avatars), registry icons through `RegistryIcon`, brand marks from `src/icons/brands`, Gaudi's generated illustrations from Storybook's local `/avatars/...` assets for avatars, and the shared hooks (`useHotkey` for ⌘K).
- Check each example at 320, 390, 768, 1024, 1280 and 1600 px in light and dark: the frame border is visible inside the preview, nothing overflows the page, and the rail, nested navigation, menus and phone sheet work.

#### Finance dashboard example

[FinanceDashboard.stories.jsx](stories/FinanceDashboard.stories.jsx) presents the [finance dashboard fixture](stories/fixtures/app-shell/app-shell-finance-dashboard.jsx) as a copyable composition. It combines flat, labelled navigation groups and a compact search header with stacked revenue bars, report totals, visitor distribution, product sales and a customer table. The layout uses App Shell and Dashboard parts, `BarChart`, `DataTable` and Core controls; actions and selection use Gaudi's default accent, while charts inherit the standard chart palette. Success colours are reserved for positive changes and account or payment status.

Navigation switches local views, search finds pages and record details, role and plan filters update the customer table, and report, transaction and invoice tables offer CSV export. All figures and records are illustrative fixture data. Copy the story's public-import source into the consuming application, replace the sample data and `/avatars/` assets, and connect routing, services, permissions and persistence there. The fixture and its private helpers are examples, not package exports.

The frame is 62rem tall with a 40rem compact height and internal panel scrolling. Narrow frames use the sidebar sheet, stack the dashboard panels and filters, and keep horizontal table scrolling inside each table. Preserve the frame-scoped ⌘/Ctrl+K search shortcut so other examples on the page do not respond. Closing record details returns focus to the opening control, with the search button as the fallback when a search result has unmounted.

### Overview

Application frames at three levels:

- **`AppShell`**: a simple responsive workspace with a navigation rail (or a top bar), a mobile navigation sheet, a header, the content landmark, a skip link, an optional detail rail and an optional status bar. It stays in document flow.
- **Sidebar parts** (`SidebarProvider`, `Sidebar`, `SidebarInset`, `SidebarTrigger`, `SidebarRail`, menus, groups and sub-menus): for richer shells, such as a rail that collapses to icons, floating and inset sidebars, nested groups with badges and row menus, secondary panels, and right-hand inspectors. On phones the sidebar becomes a Sheet drawer.
- **Frame parts** (`AppShellFrame`, `AppShellPanel`, `AppShellHeader`, `AppShellBody`, `AppShellNav`): present either kind of shell as an app window inside a page, a marketing section or a documentation preview.

### Usage

```jsx
import AppShell, { AppShellFrame } from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';

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
  AppShellBody, AppShellFrame, AppShellHeader, AppShellNav, AppShellPanel,
  Sidebar, SidebarContent, SidebarProvider, SidebarTrigger
} from '@gaudi/design-system/blocks/AppShell';
import { SkeletonRoot as Skeleton } from '@gaudi/design-system/core/Skeleton';

<AppShellFrame>
  <SidebarProvider storageKey='gaudi-sidebar'>
    <Sidebar collapsible='icon'>
      <SidebarContent role='navigation' aria-label='Workspace'>
        <AppShellNav label='Library' items={pages} value={page} onValueChange={setPage} />
      </SidebarContent>
    </Sidebar>
    <AppShellPanel>
      <AppShellHeader><SidebarTrigger />{breadcrumb}</AppShellHeader>
      <AppShellBody>
        <Skeleton className='m-4 h-64' />
      </AppShellBody>
    </AppShellPanel>
  </SidebarProvider>
</AppShellFrame>
```

### Frame

`AppShellFrame` draws a bordered window on `--ds-radius-card` with clipped overflow and a fixed height (`height`, 48rem by default and 40rem below 640px; the CSS variables `--ds-app-shell-frame-height` and `--ds-app-shell-frame-height-compact` also set it). Content scrolls inside: `AppShellPanel` (and the simple `AppShell` workspace) scroll on their own, and the sidebar is positioned against the frame instead of the viewport. The frame measures itself, and sidebar parts switch to the phone layout when the frame, not the viewport, is narrower than `compactBelow` (640px). The phone sheet portals into the frame, so it opens inside the window. Menus, tooltips and dialogs still portal to the page.

### API

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
| `SidebarProvider.storageKey`              | string                     | Restores and saves the expanded state in localStorage after mount.                         |
| `SidebarProvider.shortcut`                | string / false             | The ⌘/Ctrl key that toggles the sidebar (`b`); `false` turns it off.                       |
| `SidebarProvider.labels`                  | object                     | `expanded`, `collapsed` announcements and the `toggle` trigger name. |
| `Sidebar.variant / collapsible / side`    | string                     | `sidebar`, `floating` or `inset`; `offcanvas`, `icon` or `none`; edge.                     |
| `SidebarTrigger.label / tooltip`          | string / boolean           | Trigger name, and a tooltip with the shortcut keys.                                        |
| `SidebarMenuButton.tooltip`               | string / object            | Names the item on the collapsed icon rail.                                                 |

### Accessibility

Keep the skip link and the main landmark, and name each navigation and complementary region. Mark the current page with `aria-current` (`AppShellNav` does; a remembered section view is only highlighted). The trigger reports `aria-expanded` and `aria-keyshortcuts`, and expanding or collapsing is announced politely. Keep the trigger at the top of the sidebar or before the breadcrumbs, including when collapsed. On phones the sidebar is a Sheet that traps focus and returns it to the trigger, and choosing a page closes it. Collapsed icon rails name every item with a tooltip, and nested sections open as menus. Status dots carry a spoken `status`; placeholder grids are decorative and hidden from assistive technology, and their skeletons do not animate.

When several shells share a page (as in these docs), turn the shortcut off on all but one, because each provider listens on the window.

### Ownership and verification

The host supplies data, translations, network calls, permissions and persistence. Gaudi owns layout, semantics and local interaction. Examples document working behavior and states, with Storybook interaction/axe checks and a server-rendering contract test alongside the component.
