# Image

> MDX/Image · mdx · `@gaudi/design-system/mdx/Image`

Image renders editorial MDX images with caption, dark-mode source, fallback source, and click-to-open modal behavior.

## Import

```js
import Image from '@gaudi/design-system/mdx/Image';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `src` | `string` | — | no | Primary image source. |
| `fallback` | `string` | — | no | Fallback image source used after load failure. |
| `darkSrc` | `string` | — | no | Optional image source shown in dark mode. |
| `alt` | `string` | `post-image` | no | Accessible alt text for informative images. |
| `caption` | `ReactNode` | — | no | Optional visible figure caption. |
| `width` | `number` | — | no | Image width for Next image rendering unless fill is supplied. |
| `height` | `number` | — | no | Image height for Next image rendering unless fill is supplied. |
| `fill` | `boolean` | `false` | no | Uses the parent box instead of explicit dimensions. |
| `sizes` | `string` | — | no | Responsive image sizes hint passed to Next image. |
| `className` | `string` | — | no | Image class override. |

## Usage

```jsx
<Image
  src='/static/images/art/0.svg'
  fallback='/static/images/art/1.svg'
  darkSrc='/static/images/art/5.svg'
  alt='Lavender gradient artwork'
  caption='A study in lavender and light.'
  width={420}
  height={236}
/>
```

## Accessibility

Image keeps article images semantic with alt text, figure captions, and a button trigger for the modal preview.

## States and recovery

- Provide a valid fallback source for editorial images that can fail independently of the article.
- Keep useful alt text available when both image sources fail; never replace the article with an empty frame.

## Examples

- Playground (Storybook `mdx-image--playground`)
- Fallback (Storybook `mdx-image--fallback`)
