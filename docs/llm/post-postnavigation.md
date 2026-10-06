# PostNavigation

> Post/PostNavigation · post · `@gaudi/design-system/post/PostNavigation`

Previous and next article links at the end of a post.

## Import

```js
import PostNavigation from '@gaudi/design-system/post/PostNavigation';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `prev / next` | `Article metadata` | — | no | Prepared { id, title, href } articles. Entries without href are omitted; type changes labels only. |
| `headingLevel` | `number` | `2` | no | Heading level for navigation. |
| `type` | `string` | `Post` | no | Content type used by navigation labels. |

## Usage

```jsx
import { PostNavigation } from '@gaudi/design-system';

<PostNavigation prev={previousPost} next={nextPost} />
```

## Accessibility

Links name their destinations. Do not render empty links when one adjacent article is unavailable.

## Examples

- Playground (Storybook `post-postnavigation--playground`)
