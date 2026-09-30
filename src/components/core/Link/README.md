# Link

A link moves the reader to another page, a section of this page, or another site. Use `Button` with `href` when the link should look like an action.

```jsx
import { Link } from '@gaudi/design-system';

<Link href='/blog/publications' tone='accent'>publications</Link>
```

- `variant`: `inline` for links in prose (default), `muted` for secondary links such as "Edit this page", `nav` for navigation, and `bare` to inherit the parent colour.
- `tone` colours `inline` links by meaning: `accent`, `neutral` (default), `danger`, `success`, `warning`, `info`, `attention`, `discovery`. Older hue names (`blue`, `gray`, `red`…) still work.
- Internal paths use client navigation, external URLs open in a new tab with `rel="noopener noreferrer"`, and a missing `href` renders plain text.
