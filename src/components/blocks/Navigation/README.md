# Navigation

The site header block: brand, the primary `NavigationMenu` (site links plus a two-block Blog panel of categories and recent posts, or a Categories panel on `/blog` routes), search, the theme switch and, below `lg`, a phone sheet. `LayoutContainer` renders it from `menuProps`; render `Menu` directly in a custom shell inside a `SiteConfigProvider`.

```jsx
import { Menu } from '@gaudi/design-system';

<Menu categories={categories} posts={posts} projects={projects} publications={publications} tags={tags} />
```

| Prop | Type | Contract |
| --- | --- | --- |
| `categories` | `Array<{ id, title, description }>` | Blog panel, Categories panel and phone sheet destinations (`/blog/categories/:id`). |
| `posts` | `Array<{ slug, title, date }>` | The newest three become Recent posts; all are searchable. |
| `projects / publications / tags / thoughts` | `Array` | Command launcher search records. |
| `logo` | `ReactNode` | Replaces the default brand mark inside the home link. |

Site links come from SiteConfig `navigation.links` (`showInPath` / `hideInPath` filter them per route); the home link is named by the SiteConfig author or title.

The phone sheet and the brand mark are private parts. `MenuSearch`, the header's search entry, is exported for custom headers that open `Commander`. For the Blog panel on its own, compose `NavigationMenuDropdown` with `aside={<NavigationMenuAside … />}` (see Core/Navigation/NavigationMenu).

## Accessibility

One `Main navigation` landmark with real links; the current destination gets `aria-current="page"`. Panels open on click and close on Escape (focus returns to the trigger) or an outside click. The phone sheet is a named modal dialog that takes focus, isolates the page, closes on Escape or Close and returns focus to the menu button; searching from it closes the sheet before the launcher opens.
