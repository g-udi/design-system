# AspectRatio

> Core/AspectRatio · core · `@gaudi/design-system/core/AspectRatio`

Keep media at a stable aspect ratio as its container resizes.

## Import

```js
import { AspectRatio } from '@gaudi/design-system/core/AspectRatio';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `AspectRatio`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ratio` | `number` | `1` | no | Width divided by height; use 16 / 9 for landscape media. |
| `children` | `ReactNode` | — | no | Content composed from the exported parts. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Usage

```jsx
import { AspectRatio } from '@gaudi/design-system/core/AspectRatio';

<AspectRatio ratio={16 / 9}>
  <img src={cover.src} alt={cover.alt} className='h-full w-full object-cover' />
</AspectRatio>
```

## Accessibility

Supply alternative text for images and accessible names for embedded media.

## Examples

- Playground (Storybook `core-aspectratio--playground`)

Curated patterns:

- Common ratios — registry item `@gaudi/aspect-ratio-common-ratios` (uses `AspectRatio`)

## README

Keeps media at a fixed width-to-height ratio as its container resizes, so images and video do not shift the layout while they load.

```jsx
import { AspectRatio } from '@gaudi/design-system';

<AspectRatio ratio={16 / 9} className='overflow-hidden rounded-lg border'>
  <img src='/images/art/0.svg' alt='' className='size-full object-cover' />
</AspectRatio>
```

`ratio` is width divided by height (default `1`). Give related media, such as thumbnails in one row, the same ratio.
