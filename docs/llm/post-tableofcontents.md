# TableOfContents

> Post/TableOfContents · post · `@gaudi/design-system/post/TableOfContents`

Tracks article headings and indexes diagrams and tables. Pass contentRef when several articles share the same page.

## Import

```js
import TableOfContents from '@gaudi/design-system/post/TableOfContents';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `toc` | `Array<{ id, url, value, depth, children }>` | `[]` | no | Heading IDs and labels from the article. |
| `contentRef` | `RefObject<HTMLElement>` | — | no | Article to index. Defaults to the first article on the page. |
| `className` | `string` | — | no | Layout and responsive visibility classes. |

## Usage

```jsx
import { TableOfContents } from '@gaudi/design-system';

<TableOfContents toc={toc} />
```

## Accessibility

Names the article navigation and preserves normal anchor behavior; the active heading is marked without stealing focus.

## Examples

- Playground (Storybook `post-tableofcontents--playground`)
- Four or fewer sections (Storybook `post-tableofcontents--compact-toc`)
