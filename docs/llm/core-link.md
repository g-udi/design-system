# Link

> Core/Link · core · `@gaudi/design-system/core/Link`

Link centralizes navigation semantics for internal, anchor, and external links.

## Import

```js
import Link from '@gaudi/design-system/core/Link';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `default`, `linkTones`, `linkVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | — | no | Visible link label. |
| `href` | `internal \| anchor \| external URL` | — | no | Internal routes use Next Link; anchors and external URLs use native anchors. |
| `prefetch` | `boolean` | `true` | no | Next.js prefetch behavior for internal links. |
| `variant` | `inline \| muted \| nav \| bare` | `inline` | no | Text link style: inline takes tone, muted is secondary gray, nav is strong gray turning blue on hover, bare inherits the parent color. |
| `tone` | `accent \| attention \| danger \| discovery \| info \| neutral \| success \| warning` | `neutral` | no | Color family of the inline variant. Default is black/gray and turns blue on hover. muted, nav, and bare have fixed colors and ignore tone. |
| `className` | `string` | — | no | Root class override. |

## Variants

- `variant`: `inline`, `muted`, `nav`, `bare`
- `tone`: `accent`, `attention`, `danger`, `discovery`, `info`, `neutral`, `success`, `warning`

## Usage

```jsx
import { Link } from '@gaudi/design-system';

<Link href='/blog' variant='inline' tone='blue'>Read the blog</Link>
```

## Accessibility

Link renders Next links for internal URLs, anchors for fragments, and safe external anchors with noopener noreferrer.

## Examples

- Playground (Storybook `core-link--playground`)
- Link Types (Storybook `core-link--link-types`)
- Variants and tones (Storybook `core-link--variants`)

## README

A link moves the reader to another page, a section of this page, or another site. Use `Button` with `href` when the link should look like an action.

```jsx
import { Link } from '@gaudi/design-system';

<Link href='/blog/publications' tone='accent'>publications</Link>
```

- `variant`: `inline` for links in prose (default), `muted` for secondary links such as "Edit this page", `nav` for navigation, and `bare` to inherit the parent colour.
- `tone` colours `inline` links by meaning: `accent`, `neutral` (default), `danger`, `success`, `warning`, `info`, `attention`, `discovery`. Older hue names (`blue`, `gray`, `red`…) still work.
- Internal paths use client navigation, external URLs open in a new tab with `rel="noopener noreferrer"`, and a missing `href` renders plain text.
