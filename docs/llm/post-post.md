# Post

> Post/Post · post · `@gaudi/design-system/post/Post`

An article summary linking to a full post.

## Import

```js
import Post from '@gaudi/design-system/post/Post';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `frontMatter` | `Article metadata` | `{}` | no | Title, prepared href, date, subtitle and category { id, label, href }. String categories remain unlinked labels; absent hrefs never create a route. |
| `locale` | `string` | — | no | Date formatting locale. |
| `titleAs` | `ElementType` | `h3` | no | Heading element appropriate to the surrounding list. |

## Usage

```jsx
import { Post } from '@gaudi/design-system';

<Post frontMatter={frontMatter} />
```

## Accessibility

Use a meaningful linked title and an appropriate heading level. Content and routing remain application-owned.

## Examples

- Playground (Storybook `post-post--playground`)
