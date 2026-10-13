# TableOfContents

> Blocks/Blog/TableOfContents · post · `@gaudi/design-system/post/TableOfContents`

Responsive article navigation with active sections, expandable heading branches, and an optional diagram and table index. Reuses Scrollspy, Collapsible, Link and the shared expansion hook.

## Import

```js
import TableOfContents from '@gaudi/design-system/post/TableOfContents';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `toc` | `Array<{ id, url?, value, depth?, children? }>` | `[]` | no | Prepared heading IDs and labels. Nest children to describe the hierarchy; top-level count controls initial expansion regardless of heading depth. |
| `contentRef` | `RefObject<HTMLElement>` | — | no | Article to index. Defaults to the first article on the page. |
| `targetRef` | `RefObject<HTMLElement>` | — | no | Document or nested scroll viewport used by shared Scrollspy. Omit for document scrolling. |
| `offset` | `number` | `24` | no | Space above the selected heading for sticky navigation or decorative edges. |
| `smooth` | `boolean` | `true` | no | Smooth section navigation; respects reduced motion. |
| `indexVisuals` | `boolean` | `true` | no | Index captioned diagrams and tables in the article. Image and video figures are excluded. |
| `className` | `string` | — | no | Root layout classes. Sticky placement and mobile disclosure belong to the surrounding layout. |
| `aria-label` | `string` | `Table of contents` | no | Accessible navigation name when several contents lists share a page. |

## Usage

```jsx
import TableOfContents from '@gaudi/design-system/post/TableOfContents';

<TableOfContents toc={toc} contentRef={articleRef} targetRef={readingViewportRef} offset={24} />
```

## Accessibility

Uses real links and marks the active heading with aria-current. Branch toggles have descriptive names and aria-expanded. Modified link clicks remain native; section navigation respects reduced motion and does not steal focus. Hidden branches keep their targets indexed and expand when a descendant becomes active.

## Examples

- Playground (Storybook `post-tableofcontents--playground`)
- Four or fewer sections (Storybook `post-tableofcontents--compact-toc`)

## Related

`core-scrollspy`, `core-link`, `blocks-blog-article`, `mdx-image`

## README

Use this block for article headings, nested sections, and optional captioned diagrams and tables. It shares Scrollspy tracking and navigation, Link behavior, Collapsible controls, ScrollArea containment, and the expansion hook with the rest of Gaudi.

```jsx
import TableOfContents from '@gaudi/design-system/post/TableOfContents';

<TableOfContents
  toc={toc}
  contentRef={articleRef}
  targetRef={readingViewportRef}
  offset={24}
/>
```

Prepare entries as `{ id, value, url?, depth?, children? }`. Nest `children` to describe expandable branches; flat lists still use `depth` for indentation. Four or fewer top-level entries expand initially, regardless of their heading depth. Larger lists follow the active branch; readers can toggle every branch independently. Closed branches retain their tracking targets and reveal an active descendant.

Omit `targetRef` for document scrolling. Pass the article's actual viewport ref for bounded reading layouts; use the same ref for ReadingIndicator and other Scrollspy navigation. `offset` accounts for sticky headers or decorative edges. `smooth` defaults to true and respects reduced motion. Scrollspy owns scroll listeners and active-section tracking; this block does not create separate heading observers.

`contentRef` scopes visual indexing to one article. Captioned diagrams and tables receive stable anchors; photo, video, and code figures are excluded. Set `indexVisuals={false}` to show only headings. Long labels wrap, and a shared ScrollArea contains longer lists.

The block is visible at every screen width. The surrounding ArticleContentLayout owns sticky placement and the mobile contents disclosure. Use `aria-label` to name navigation when several lists share a page. Real links preserve modified clicks; active links use `aria-current="location"`, and branch toggles expose `aria-expanded` without moving focus.
