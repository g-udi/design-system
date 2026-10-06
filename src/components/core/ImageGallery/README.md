# ImageGallery

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

## API

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

## Controlled selection

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

## Interaction and recovery

- Thumbnails are named buttons. Enter or Space opens the viewer and focuses Close. Left/Right arrows navigate with the current text direction; Home/End select the first/last image. Navigation stops at either end, and previous/next controls are omitted for a single image.
- Escape, Close, or the backdrop requests dismissal. Dialog contains focus and restores the opener when it remains connected and enabled; otherwise, it falls back to the gallery region. Offscreen slides are hidden from assistive technology, and the active caption is announced politely.
- Carousel owns touch swiping. Browser pinch zoom remains available; there are no separate zoom controls. Reduced motion removes animated slide movement and the expansion hint's transition.
- Thumbnails and inactive full images use lazy loading; the selected full image loads eagerly. Failed sources show an accessible `Image unavailable` placeholder. Replace the effective preview source (`thumbnailSrc || src`) to recover a thumbnail, or `src` to recover a full image. An empty collection displays `No images to display.`

## Shared ownership

ImageGallery composes Gaudi's Dialog, Carousel, Button, and Icon, using the existing neutral themes, radius tokens (4px by default), and density scale. The masonry and expansion behavior was informed by Shadix UI.

The existing MDX `Image` and `ImageModal` APIs share this viewer through the MDX adapter. The Core entry exports only `ImageGallery`; use a one-item collection for a standalone expandable image. The shared lightbox is private.
