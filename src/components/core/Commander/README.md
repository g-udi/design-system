# Commander

The site-wide command launcher: navigation, full-text search across posts, projects, thoughts, publications and tags, contact links and a theme switch. Open it from a visible trigger such as `MenuSearch`, or with ⌘K / Ctrl+K.

## Usage

```jsx
import { useState } from 'react';
import { Commander, MenuSearch } from '@gaudi/design-system';

const [open, setOpen] = useState(false);
const navigation = [{ id: 'library', title: 'Library', href: '/library' }];
const posts = [{ id: 'release', title: 'Release notes', href: '/articles/release-notes' }];

<MenuSearch setOpen={setOpen} />
<Commander open={open} setOpen={setOpen} navigation={navigation} posts={posts} />
```

## API

| Prop                                            | Type                     | Contract                                                              |
| ----------------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `open / setOpen`                                | boolean / function       | Controlled visibility; ⌘K / Ctrl+K toggles it through `setOpen`.      |
| `navigation`                                   | Array                    | Prepared destinations; defaults to an empty list.                    |
| `posts / projects / thoughts / publications / tags` | Array                | Each non-empty collection adds a page and full-text results.          |
| `social`                                        | Array                    | Contact entries; defaults to the links in the site metadata.          |
| `restoreFocusRef`                               | Ref                      | Where focus returns when the element that opened the launcher is gone. |

Each destination or collection entry supplies a stable `id` (`slug` is a fallback), a `title`, and an explicit `href` or `onClick`. `disabled` prevents selection and `closeOnSelect={false}` keeps the launcher open for an action. Prepared titles, categories, subtitles, IDs and destinations are preserved, including empty and zero values. Collection names group entries; they do not construct routes. Home, Blog and About links must be supplied through `navigation` when the application uses those destinations.

## Composition

Commander is built on the Command parts it exports: `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`, `CommandFooter` and `CommandDialog`. Use them for inline palettes or your own command dialog; `CommandInput` renders its children at the end of the search row.

## Accessibility

The search field is a combobox that controls a listbox. Arrow keys, Home and End move the selection, Enter runs it, and Escape leaves a sub-page before it closes the launcher. Focus returns to the trigger on close.

Inline and popover `Command` compositions use the semantic surface, text, border, and selected-item colors. A surrounding Popover or Dialog owns its outer frame. `CommandDialog` and `Commander` retain the dedicated launcher palette.
