# Commander

> Core/Commander · core · `@gaudi/design-system/core/Commander`

Commander provides the site command palette with host-supplied destinations for navigation, content search, and theme actions.

Use Commander with a visible trigger such as MenuSearch. MenuSearch already includes the keyboard hint.

## Import

```js
import Commander from '@gaudi/design-system/core/Commander';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Command`, `CommandDialog`, `CommandEmpty`, `CommandFooter`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `open` | `boolean` | — | no | Controlled palette state. |
| `setOpen` | `(open: boolean) => void` | — | no | State setter used by the trigger, shortcut, keyboard handler, and close behavior. |
| `navigation` | `Array` | `[]` | no | Prepared destinations with id, title, href or onClick, and optional disabled. No built-in routes. |
| `posts` | `Array` | `[]` | no | Searchable post records with prepared id/slug, title and href or onClick. |
| `projects` | `Array` | `[]` | no | Searchable project records. |
| `publications` | `Array` | `[]` | no | Searchable publication records. |
| `tags` | `Array` | `[]` | no | Searchable tag records. |
| `thoughts` | `Array` | `[]` | no | Searchable thought records. |

## Usage

```jsx
import { useState } from 'react';
import { Button, Commander } from '@gaudi/design-system';

export function ContentSearch({ posts = [], projects = [], publications = [], tags = [], thoughts = [] }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Search content</Button>
      <Commander
        open={open}
        setOpen={setOpen}
        posts={posts}
        projects={projects}
        publications={publications}
        tags={tags}
        thoughts={thoughts}
      />
    </>
  );
}
```

## Accessibility

Commander is a keyboard-first overlay. Keep focus visible, support Escape close/back behavior, expose readable result labels, and make Cmd/Ctrl + K available without hiding the visible trigger.

## States and recovery

- Keep the query and current page intact when a search returns no results; offer a clear route back to all destinations.
- Escape closes the current level first, then the launcher, so keyboard users can recover without losing context.

## Examples

- Playground (Storybook `core-commander--playground`)
- Collection Pages (Storybook `core-commander--collection-pages`)

Curated patterns:

- Command dialog with groups and shortcuts — registry item `@gaudi/command-dialog-shortcuts` (uses `Button`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`, `RegistryIcon`)
- Inline palette — registry item `@gaudi/command-inline-palette` (uses `CardContent`, `CardRoot`, `Command`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `CommandShortcut`, `RegistryIcon`)
- Search everything — registry item `@gaudi/command-search-everything` (uses `AvatarFallback`, `AvatarImage`, `AvatarRoot`, `Badge`, `Button`, `Command`, `CommandDialog`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList`, `CommandSeparator`, `KbdRoot`, `RegistryIcon`)

## README

The site-wide command launcher: full-text search across posts, projects, thoughts, publications and tags, contact links and a theme switch. Open it from a visible trigger such as `MenuSearch`, or with ⌘K / Ctrl+K.

### Usage

```jsx
import { useState } from 'react';
import { Commander, MenuSearch } from '@gaudi/design-system';

const [open, setOpen] = useState(false);
const posts = [{ id: 'release', title: 'Release notes', href: '/articles/release-notes' }];

<MenuSearch setOpen={setOpen} />
<Commander open={open} setOpen={setOpen} posts={posts} />
```

### API

| Prop                                            | Type                     | Contract                                                              |
| ----------------------------------------------- | ------------------------ | --------------------------------------------------------------------- |
| `open / setOpen`                                | boolean / function       | Controlled visibility; ⌘K / Ctrl+K toggles it through `setOpen`.      |
| `posts / projects / thoughts / publications / tags` | Array                | Each non-empty collection adds a page and full-text results.          |
| `social`                                        | Array                    | Contact entries; defaults to the links in the site metadata.          |
| `restoreFocusRef`                               | Ref                      | Where focus returns when the element that opened the launcher is gone. |

Each destination or collection entry supplies a stable `id` (`slug` is a fallback), a `title`, and an explicit `href` or `onClick`. `disabled` prevents selection and `closeOnSelect={false}` keeps the launcher open for an action. Prepared titles, categories, subtitles, IDs and destinations are preserved, including empty and zero values. Collection names group entries; they do not construct routes.

### Composition

Commander is built on the Command parts it exports: `Command`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem`, `CommandEmpty`, `CommandSeparator`, `CommandShortcut`, `CommandFooter` and `CommandDialog`. Use them for inline palettes or your own command dialog; `CommandInput` renders its children at the end of the search row. Pass a button as `CommandDialog`'s `trigger` to connect opening, expanded state, and focus restoration to the same control, including when the dialog opens through a keyboard shortcut.

### Accessibility

The search field is a combobox that controls a listbox. Arrow keys, Home and End move the selection, Enter runs it, and Escape leaves a sub-page before it closes the launcher. Focus returns to the trigger on close.

Inline and popover `Command` compositions use the semantic surface, text, border, and selected-item colors. A surrounding Popover or Dialog owns its outer frame. `CommandDialog` and `Commander` retain the dedicated launcher palette.
