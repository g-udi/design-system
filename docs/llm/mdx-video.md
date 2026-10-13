# Video

> MDX/Video · mdx · `@gaudi/design-system/mdx/Video`

Video renders a video thumbnail that opens an embedded video in an accessible modal dialog.

Use Video inside MDX when an article needs a focused video walkthrough without embedding an always-loaded iframe in the page flow.

## Import

```js
import Video from '@gaudi/design-system/mdx/Video';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`, `videoAnimationStyles`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `videoSrc` | `YouTube embed URL or embeddable URL` | — | no | Source URL converted to an embeddable iframe URL when possible. |
| `thumbnailSrc` | `string` | — | no | Optional thumbnail image source. |
| `thumbnailAlt` | `string` | `Video thumbnail` | no | Accessible alt text for the thumbnail image or fallback thumbnail label. |
| `animationStyle` | `from-center \| from-bottom \| from-top \| from-left \| from-right \| fade \| top-in-bottom-out \| left-in-right-out` | `from-center` | no | Dialog entrance animation. |
| `title` | `string` | `Video` | no | Dialog heading and iframe title. |
| `ariaLabel` | `string` | `playLabel` | no | Accessible label for the thumbnail trigger. |
| `autoplay` | `boolean` | `true` | no | Adds autoplay to the iframe URL when the dialog opens. |
| `playLabel` | `string` | `Play video` | no | Fallback accessible label for the thumbnail trigger. |
| `className` | `string` | — | no | Thumbnail trigger class override. |
| `classNames` | `{ trigger, thumbnail, playWrapper, playButton, panel, title, video }` | — | no | Slot-level class overrides. |

## Variants

- `animationStyle`: `from-center`, `from-bottom`, `from-top`, `from-left`, `from-right`, `fade`, `top-in-bottom-out`, `left-in-right-out`

## Usage

```jsx
<Video
  animationStyle='from-center'
  videoSrc='/static/media/video-player.html'
  thumbnailSrc='/static/images/og-card.jpg'
  thumbnailAlt='Video preview'
  title='Video walkthrough'
/>
```

## Accessibility

Video uses a native button for the thumbnail trigger, an aria-modal dialog, Escape-to-close behavior, labelled close controls, and returns focus to the trigger when closed.

## Examples

- Playground (Storybook `mdx-video--playground`)

## Related

`core-dialog`
