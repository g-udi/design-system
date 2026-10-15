# Commander

The site-wide command launcher: full-text search across posts, projects, thoughts, publications and tags, contact links and a theme switch. Open it from a visible trigger such as `MenuSearch`, or with ⌘K / Ctrl+K.

## Usage

```jsx
import { useState } from 'react';
import { Commander, MenuSearch } from '@gaudi/design-system';

const [open, setOpen] = useState(false);
const posts = [{ id: 'release', title: 'Release notes', href: '/articles/release-notes' }];

<MenuSearch setOpen={setOpen} />
<Commander open={open} setOpen={setOpen} posts={posts} />
```

## API

| Prop                                            | Type                     | Contract                                                              |
| ----------------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `open / setOpen`                                | boolean / function       | Controlled visibility; ⌘K / Ctrl+K toggles it through `setOpen`.      |
| `posts / projects / thoughts / publications / tags` | Array                | Each non-empty collection adds a page and full-text results.          |
| `social`                                        | Array                    | Contact entries; defaults to the links in the site metadata.          |
| `restoreFocusRef`                               | Ref                      | Where focus returns when the element that opened the launcher is gone. |

Each destination or collection entry supplies a stable `id` (`slug` is a fallback), a `title`, and an explicit `href` or `onClick`. `disabled` prevents selection and `closeOnSelect={false}` keeps the launcher open for an action. Prepared titles, categories, subtitles, IDs and destinations are preserved, including empty and zero values. Collection names group entries; they do not construct routes.

## Composition

Commander is built on the Command parts it exports: `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`, `CommandFooter` and `CommandDialog`. Use them for inline palettes or your own command dialog; `CommandInput` renders its children at the end of the search row. Pass a button as `CommandDialog`'s `trigger` to connect opening, expanded state, and focus restoration to the same control, including when the dialog opens through a keyboard shortcut.

## Accessibility

The search field is a combobox that controls a listbox. Arrow keys, Home and End move the selection, Enter runs it, and Escape leaves a sub-page before it closes the launcher. Focus returns to the trigger on close.

Inline and popover `Command` compositions use the semantic surface, text, border, and selected-item colors. A surrounding Popover or Dialog owns its outer frame. `CommandDialog` and `Commander` retain the dedicated launcher palette.
