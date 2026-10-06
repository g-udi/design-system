import { p, className, definition } from '../../../../../docs/components/referenceProps.js';

export default {
  'Core/ImageGallery': {
    ...definition('A responsive masonry or grid collection with an accessible image viewer. A one-item collection is a full-width, click-to-expand image.', [
      p('images', 'Array<{ id, src, alt, caption?, thumbnailSrc?, width?, height? }>', '[]', 'Prepared images with unique, stable string IDs. src is the full image; thumbnailSrc optionally supplies a smaller preview. width and height reserve the thumbnail aspect ratio; a different ratio crops the preview. The viewer always contains the full image.'),
      p('label', 'string', 'Image gallery', 'Accessible name of the gallery region.'),
      p('layout', 'masonry | grid', 'masonry', 'Masonry keeps each thumbnail ratio and reads down each column. Grid reads across rows and crops thumbnails to 4:3.'),
      p('columns', '{ mobile?, tablet?, desktop? }', '{ mobile: 1, tablet: 2, desktop: 3 }', 'Positive integer column counts at gallery widths below 640px, from 640px, and from 1024px. A single image always occupies one full-width column.'),
      p('showCaptions', 'boolean', 'true', 'Shows captions below thumbnails. The viewer always shows the active caption or alternative text.'),
      p('selectedId / defaultSelectedId / onSelectedIdChange', 'string | null / string | null / (id) => void', 'uncontrolled / null / —', 'Controls or initializes the viewer selection. null closes it; selecting a thumbnail, navigating, swiping, and closing request a change. Controlled hosts remain authoritative. An ID absent from images closes the viewer.'),
      p('disabled', 'boolean', 'false', 'Disables thumbnail activation and hides the viewer while true, retaining the selection.'),
      className
    ], 'Thumbnails are named buttons. Enter or Space opens the viewer. Arrow keys move between images (respecting direction), Home and End select the first and last images, and Escape closes. Touch supports swiping and browser pinch zoom. Dialog contains focus and restores the opener, or the gallery region if that opener was removed or disabled. Reduced motion removes animated slide movement.', [
      'Provide useful alt text; captions add visible context. Offscreen slides are hidden from assistive technology. Navigation stops at either end and disappears for a single image.',
      'Images load lazily, with the selected full image loaded eagerly. Failed sources show an accessible placeholder; replace thumbnailSrc (or src when no thumbnail is supplied) to recover a preview, and src to recover the full image. Empty collections show an explicit empty state.',
      'Use one image in images for an expandable article figure. No separate single-image wrapper is needed. Existing MDX/Image and MDX/ImageModal share the same viewer while preserving their APIs.',
      'The Shadix UI gallery informed the masonry and expansion behavior. The implementation uses Gaudi Dialog, Carousel, Button and Icon; it does not load remote demo resources.'
    ]),
    usage: "import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';\n\n<ImageGallery images={[{ id: 'lavender', src: '/static/images/art/0.svg', alt: 'Lavender gradient artwork', caption: 'A study in lavender and light', width: 1200, height: 675 }]} />"
  }
};
