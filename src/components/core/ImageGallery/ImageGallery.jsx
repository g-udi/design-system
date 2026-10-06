'use client';

import { useRef } from 'react';
import Button from '../Button/index.js';
import Icon from '../Icon/index.js';
import { cn } from '../../../utilities/cn/index.js';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import GalleryImage from './GalleryImage.jsx';
import ImageLightbox from './ImageLightbox.jsx';

export function ImageGallery({
  images = [], label = 'Image gallery', layout = 'masonry', columns,
  showCaptions = true, disabled = false, selectedId, defaultSelectedId = null,
  onSelectedIdChange, className, style, ...props
}) {
  const [activeId, setActiveId] = useControllableState({ value: selectedId, defaultValue: defaultSelectedId, onChange: onSelectedIdChange });
  const galleryRef = useRef(null);
  return <div {...props} ref={galleryRef} role='region' aria-label={label} tabIndex={-1}
    className={cn('ds-image-gallery', className)} data-layout={layout} data-single={images.length === 1 || undefined}
    style={{ '--gallery-columns-mobile': columns?.mobile ?? 1, '--gallery-columns-tablet': columns?.tablet ?? 2, '--gallery-columns-desktop': columns?.desktop ?? 3, ...style }}>
    {images.length ? <div className='ds-image-gallery-items'>
      {images.map(image => <figure key={image.id} className='ds-image-gallery-item'>
        <Button variant='ghost' tone='neutral' className='ds-image-gallery-trigger h-auto min-h-0 p-0' disabled={disabled}
          aria-label={`Open image: ${image.alt || image.caption || 'Image preview'}`} aria-haspopup='dialog'
          onClick={() => setActiveId(image.id)} style={{ aspectRatio: image.width && image.height ? `${image.width} / ${image.height}` : undefined }}>
          <GalleryImage key={image.thumbnailSrc || image.src} src={image.thumbnailSrc || image.src} alt={image.alt}
            width={image.width} height={image.height} loading='lazy' decoding='async' />
          <span className='ds-image-gallery-expand' aria-hidden='true'><Icon name='Maximize2' decorative size='sm' /></span>
        </Button>
        {showCaptions && image.caption && <figcaption>{image.caption}</figcaption>}
      </figure>)}
    </div> : <p className='ds-image-gallery-empty'>No images to display.</p>}
    <ImageLightbox images={images} selectedId={disabled ? null : activeId} onSelectedIdChange={setActiveId} restoreFocusRef={galleryRef} />
  </div>;
}
