# Navigation

The site header block: brand, the primary `NavigationMenu` (site links plus a two-block Blog panel of categories and recent posts, or a Categories panel on the supplied blog route), search, the theme switch and, below `lg`, a phone sheet. `LayoutContainer` renders it from `menuProps`; render `Menu` directly in a custom shell inside a `SiteConfigProvider`.

```jsx
import { Menu } from '@gaudi/design-system';

<Menu blogLink={blogLink} categories={categories} posts={posts} projects={projects} publications={publications} tags={tags} />
```

| Prop | Type | Contract |
| --- | --- | --- |
| `blogLink` | `{ href, title }` | Prepared destination that enables the blog panel and identifies its current route. |
| `categories` | `Array<{ id, href, title, description }>` | Prepared Blog panel, Categories panel and phone sheet destinations. |
| `posts` | `Array<{ id?, slug?, href, title, date }>` | The newest three become Recent posts; all are searchable. |
| `projects / publications / tags / thoughts` | `Array` | Command launcher search records. |
| `logo` | `ReactNode` | Replaces the default brand mark inside the home link. |

Site links come from SiteConfig `navigation.links` (`showInPath` / `hideInPath` filter them per route); the home link is named by the SiteConfig author or title.

The phone sheet and the brand mark are private parts. `MenuSearch`, the header's search entry, is exported for custom headers that open `Commander`. For the Blog panel on its own, compose `NavigationMenuDropdown` with `aside={<NavigationMenuAside … />}` (see Core/Navigation/NavigationMenu).

## Accessibility

One `Main navigation` landmark with real links; the current destination gets `aria-current="page"`. Panels open on click and close on Escape (focus returns to the trigger) or an outside click. The phone sheet is a named modal dialog that takes focus, isolates the page, closes on Escape or Close and returns focus to the menu button; searching from it closes the sheet before the launcher opens.

Supply `href` on searchable records as well as category and recent-post links. The header passes host navigation to Commander and does not construct content routes. Without `blogLink`, it renders the prepared primary links without a blog panel.

## Apple-style mega menu example

`Blocks/Navigation → Apple-style mega menu` composes the public `NavigationMenuRoot` parts with `Dialog`, `AccordionRoot`, `Button`, and `Icon`. Inspired by [Skiper 38](https://skiper-ui.com/v1/skiper38), it uses a full-width desktop panel, large primary links, quieter secondary groups, a short stagger, and a blurred backdrop. Hover, click, arrow keys, Escape, and outside dismissal work; reduced motion removes transitions.

Below 1024px, a modal menu contains expandable sections and its own scroll region, returning focus to its opener when closed. The example contains the overlay within its preview; an application can portal to the document instead. Demo navigation updates local content and calls `onNavigate({ title, href })`; wire the supplied hrefs to application routes. Copyable source includes the example styles. This is a header recipe, not another public component or a change to `Menu`.

## Scroll-merging header example

`Blocks/Navigation → Scroll-merging header` follows [Skiper 57](https://skiper-ui.com/v1/skiper57): a project breadcrumb row scrolls away while the section tabs move alongside the brand in one compact sticky header. It composes `ScrollArea`, `Tabs`, and `Breadcrumb` with `useScrollPosition`, `useElementSize`, and `usePrefersReducedMotion`. A single tab list retains selection and keyboard focus through the merge; narrow layouts scroll the tabs within the header. The measured row height keeps alignment correct at each spacing density.

The scroll demonstration is contained within its own workspace in Docs. Arrow keys, Home, and End navigate the local sample sections; `onSectionChange(value)` reports selection. The brand button returns the workspace to the top. Reduced motion uses the compact header throughout. Copyable source includes the styles and local sample data.
