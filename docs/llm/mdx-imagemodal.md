# ImageModal

> MDX/ImageModal · mdx · `@gaudi/design-system/mdx/ImageModal`

A focused view of an article image with a caption and dismiss action.

## Import

```js
import ImageModal from '@gaudi/design-system/mdx/ImageModal';
// also: import { … } from '@gaudi/design-system/mdx';
```

Exports: `default`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `isOpen` | `boolean` | — | no | Controlled modal visibility. |
| `onClose` | `() => void` | — | no | Close request from the modal. |
| `src / alt` | `string` | — | no | Image source and descriptive alternative text. |
| `caption` | `ReactNode` | — | no | Supporting image context. |

## Usage

```jsx
<ImageModal src='/static/images/art/0.svg' alt='Lavender gradient artwork' />
```

## Accessibility

Provide alternative text, preserve focus containment and return focus to the image trigger on dismissal.

## Examples

- Playground (Storybook `mdx-imagemodal--playground`)

## Related

`mdx-image`
