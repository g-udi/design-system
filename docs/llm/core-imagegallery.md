# ImageGallery

> Core/ImageGallery · core · `@gaudi/design-system/core/ImageGallery`

A responsive masonry or grid collection with an accessible image viewer. A one-item collection is a full-width, click-to-expand image.

## Import

```js
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `ImageGallery`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `images` | `Array<{ id, src, alt, caption?, thumbnailSrc?, width?, height? }>` | `[]` | no | Prepared images with unique, stable string IDs. src is the full image; thumbnailSrc optionally supplies a smaller preview. width and height reserve the thumbnail aspect ratio; a different ratio crops the preview. The viewer always contains the full image. |
| `label` | `string` | `Image gallery` | no | Accessible name of the gallery region. |
| `layout` | `masonry \| grid` | `masonry` | no | Masonry keeps each thumbnail ratio and reads down each column. Grid reads across rows and crops thumbnails to 4:3. |
| `columns` | `{ mobile?, tablet?, desktop? }` | `{ mobile: 1, tablet: 2, desktop: 3 }` | no | Positive integer column counts at gallery widths below 640px, from 640px, and from 1024px. A single image always occupies one full-width column. |
| `showCaptions` | `boolean` | `true` | no | Shows captions below thumbnails. The viewer always shows the active caption or alternative text. |
| `selectedId` | `string \| null` | `uncontrolled` | no | Controls or initializes the viewer selection. null closes it; selecting a thumbnail, navigating, swiping, and closing request a change. Controlled hosts remain authoritative. An ID absent from images closes the viewer. |
| `defaultSelectedId` | `string \| null` | `null` | no | Controls or initializes the viewer selection. null closes it; selecting a thumbnail, navigating, swiping, and closing request a change. Controlled hosts remain authoritative. An ID absent from images closes the viewer. |
| `onSelectedIdChange` | `(id) => void` | — | no | Controls or initializes the viewer selection. null closes it; selecting a thumbnail, navigating, swiping, and closing request a change. Controlled hosts remain authoritative. An ID absent from images closes the viewer. |
| `disabled` | `boolean` | `false` | no | Disables thumbnail activation and hides the viewer while true, retaining the selection. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `layout`: `masonry`, `grid`

## Usage

```jsx
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';

<ImageGallery images={[{ id: 'lavender', src: '/static/images/art/0.svg', alt: 'Lavender gradient artwork', caption: 'A study in lavender and light', width: 1200, height: 675 }]} />
```

## Accessibility

Thumbnails are named buttons. Enter or Space opens the viewer. Arrow keys move between images (respecting direction), Home and End select the first and last images, and Escape closes. Touch supports swiping and browser pinch zoom. Dialog contains focus and restores the opener, or the gallery region if that opener was removed or disabled. Reduced motion removes animated slide movement.

## Notes

- Provide useful alt text; captions add visible context. Offscreen slides are hidden from assistive technology. Navigation stops at either end and disappears for a single image.
- Images load lazily, with the selected full image loaded eagerly. Failed sources show an accessible placeholder; replace thumbnailSrc (or src when no thumbnail is supplied) to recover a preview, and src to recover the full image. Empty collections show an explicit empty state.
- Use one image in images for an expandable article figure. No separate single-image wrapper is needed. Existing MDX/Image and MDX/ImageModal share the same viewer while preserving their APIs.
- The Shadix UI gallery informed the masonry and expansion behavior. The implementation uses Gaudi Dialog, Carousel, Button and Icon; it does not load remote demo resources.

## Examples

- Playground (Storybook `core-imagegallery--playground`)
- Single expandable image (Storybook `core-imagegallery--single`)
- Controlled grid (Storybook `core-imagegallery--controlled`)
- Empty & unavailable images (Storybook `core-imagegallery--recovery`)

## Related

`blocks-navigation`, `mdx-image`, `mdx-imagemodal`, `core-dialog`, `core-carousel`, `core-button`, `core-icon`

## README

A masonry or grid collection whose images open in a shared viewer. Pass one item for a full-width, click-to-expand image; the same component handles both uses.

```jsx
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';

<ImageGallery
  label='Coastal photographs'
  images={[
    {
      id: 'north-coast',
      src: '/images/north-coast.jpg',
      thumbnailSrc: '/images/north-coast-small.jpg',
      alt: 'Waves breaking against a rocky coastline',
      caption: 'The north coast',
      width: 1200,
      height: 800
    }
  ]}
/>
```

Use local, host-supplied assets. Gaudi's examples use local files and do not fetch third-party demo resources.

### API

| Prop | Default | Contract |
| --- | --- | --- |
| `images` | `[]` | Array of `{ id, src, alt, caption?, thumbnailSrc?, width?, height? }`. Supply unique, stable string IDs and meaningful alternative text. |
| `label` | `'Image gallery'` | Accessible name of the gallery region; distinguish multiple galleries on a page. |
| `layout` | `'masonry'` | `'masonry'` preserves thumbnail ratios; `'grid'` crops thumbnails to 4:3. |
| `columns` | `{ mobile: 1, tablet: 2, desktop: 3 }` | Positive integer column counts. Each omitted field keeps its default. One image always uses one full-width column. |
| `showCaptions` | `true` | Shows captions below thumbnails. The viewer always shows the active caption, alternative text, or `'Image preview'`. |
| `selectedId` | `undefined` | Controlled selection. A matching ID opens the viewer; `null` closes it. |
| `defaultSelectedId` | `null` | Initial selection when uncontrolled. |
| `onSelectedIdChange` | — | Receives the requested ID, or `null` when closing. |
| `disabled` | `false` | Disables thumbnail activation and hides the viewer while preserving selection. |
| `className`, `style` | — | Applied to the gallery region. Other DOM props also pass to this outer element. |

`src` supplies the full image. `thumbnailSrc`, when present, supplies only the preview. Provide both `width` and `height` to reserve the thumbnail's aspect ratio; a source with a different ratio is cropped to fit. Without dimensions, masonry uses the loaded image's natural ratio. The viewer contains the full image without cropping.

Columns respond to the **gallery container width**: `mobile` below 640px, `tablet` from 640px, and `desktop` from 1024px. Masonry reads down each column before moving to the next; grid reads across rows. Keyboard and viewer navigation follow the supplied `images` order.

### Controlled selection

```jsx
import { useState } from 'react';
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';

function Gallery({ images, disabled = false }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <ImageGallery
      images={images}
      selectedId={selectedId}
      onSelectedIdChange={setSelectedId}
      disabled={disabled}
    />
  );
}
```

Thumbnail activation, navigation buttons, keyboard navigation, swiping, and closing request selection changes. The controlled host must accept a request by updating `selectedId`; it can also refuse or replace it. An ID absent from `images` hides the viewer without clearing the stored selection. Disabling behaves the same way: re-enabling reopens the retained image if it still exists. Set `selectedId` to `null` when the host wants to clear it permanently.

### Interaction and recovery

- Thumbnails are named buttons. Enter or Space opens the viewer and focuses Close. Left/Right arrows navigate with the current text direction; Home/End select the first/last image. Navigation stops at either end, and previous/next controls are omitted for a single image.
- Escape, Close, or the backdrop requests dismissal. Dialog contains focus and restores the opener when it remains connected and enabled; otherwise, it falls back to the gallery region. Offscreen slides are hidden from assistive technology, and the active caption is announced politely.
- Carousel owns touch swiping. Browser pinch zoom remains available; there are no separate zoom controls. Reduced motion removes animated slide movement and the expansion hint's transition.
- Thumbnails and inactive full images use lazy loading; the selected full image loads eagerly. Failed sources show an accessible `Image unavailable` placeholder. Replace the effective preview source (`thumbnailSrc || src`) to recover a thumbnail, or `src` to recover a full image. An empty collection displays `No images to display.`

### Shared ownership

ImageGallery composes Gaudi's Dialog, Carousel, Button, and Icon, using the existing neutral themes, radius tokens (4px by default), and density scale. The masonry and expansion behavior was informed by Shadix UI.

The existing MDX `Image` and `ImageModal` APIs share this viewer through the MDX adapter. The Core entry exports only `ImageGallery`; use a one-item collection for a standalone expandable image. The shared lightbox is private.
