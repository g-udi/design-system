# CitationTracker

> MDX/CitationTracker · mdx · `@gaudi/design-system/mdx/CitationTracker`

Keep bibliography back-links associated with the last visited citation.

## Import

```js
import CitationTracker from '@gaudi/design-system/mdx/CitationTracker';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `Generated citation attributes` | `data-citation-popover / data-citation-keys / data-citation-key` | — | no | Metadata written by the consuming markdown pipeline. |
| `CitationTracker` | `Runtime component; no props` | — | no | Mount with the article runtime to track citation navigation. |

## Usage

```jsx
import { CitationTracker } from '@gaudi/design-system/mdx';

// Mount once alongside the host's generated article markup.
<CitationTracker />
```

## Accessibility

Use real citation and bibliography links with unique IDs. Back-links must return to a valid citation.

## Notes

- The consuming markdown pipeline creates citation markup. Gaudi handles its runtime behavior; do not author generated attributes by hand.

## Examples

- Playground (Storybook `mdx-citationtracker--playground`)
