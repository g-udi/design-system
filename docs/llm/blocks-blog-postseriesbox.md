# PostSeriesBox

> Blocks/Blog/PostSeriesBox · post · `@gaudi/design-system/post/PostSeriesBox`

List the articles in a series and identify the current entry.

## Import

```js
import PostSeriesBox from '@gaudi/design-system/post/PostSeriesBox';
// also: import { … } from '@gaudi/design-system/post';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `series` | `Article metadata[]` | — | no | Prepared { id, title, href, series, order? } entries in reading order. No routes or completion state are inferred. |
| `currentId` | `string \| number` | — | no | Current article stable ID, including zero. Position in the supplied series drives the progress display. |
| `classNames` | `Record<string, string>` | `{}` | no | Slot classes. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { PostSeriesBox } from '@gaudi/design-system';

<PostSeriesBox series={seriesPosts} currentId='components' />
```

## Accessibility

Identify the current article and use descriptive links for other entries.

## Examples

- Playground (Storybook `post-postseriesbox--playground`)
