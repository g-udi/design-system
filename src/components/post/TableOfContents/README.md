# TableOfContents

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
