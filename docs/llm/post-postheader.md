# PostHeader

> Post/PostHeader · post · `@gaudi/design-system/post/PostHeader`

Article title, metadata, timestamps and supporting header controls.

## Import

```js
import PostHeader from '@gaudi/design-system/post/PostHeader';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `PostDate`, `PostReadingTime`, `PostTimestamps`, `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `frontMatter / siteMetadata` | `object` | `{}` | no | Article id, title, category and tags as { id, label, href }, prepared seriesPosts, and site locale. String category/tag labels remain unlinked. |
| `titleLevel` | `number` | `1` | no | Article heading level. |
| `tocControl` | `ReactNode` | — | no | Optional table-of-contents control. |
| `classNames` | `Record<string, string>` | `{}` | no | Header slot classes. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { PostHeader } from '@gaudi/design-system';

<PostHeader frontMatter={frontMatter} siteMetadata={siteMetadata} tocControl={tocControl} />
```

## Accessibility

Preserve one clear article heading and machine-readable dates.

## Examples

- Playground (Storybook `post-postheader--playground`)
- Prepared share and source actions (Storybook `post-postheader--sharing-actions`)
