'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Dialog from '../Dialog/index.js';
import Button from '../Button/index.js';
import Icon from '../Icon/index.js';
import { CarouselRoot, CarouselContent, CarouselItem } from '../Carousel/index.js';
import { useDirection } from '../Direction/index.js';
import { usePrefersReducedMotion } from '../../../hooks/a11y/use-prefers-reduced-motion.js';
import { useLatestRef } from '../../../hooks/shared/use-latest-ref.js';
import { isTextEntryTarget } from '../../../hooks/shared/dom.js';
import GalleryImage from './GalleryImage.jsx';

function ImageViewer({ images, selectedId, onSelectedIdChange, closeRef, closeLabel, captionId }) {
  const [api, setApi] = useState(null);
  const direction = useDirection();
  const reducedMotion = usePrefersReducedMotion();
  const index = images.findIndex(image => image.id === selectedId);
  const image = images[index];
  const initialIndex = useRef(index);
  const current = useLatestRef({ images, selectedId, onSelectedIdChange });
  const syncing = useRef(false);

  useEffect(() => {
    if (!api) return;
    let frame;
    const sync = () => {
      const next = current.current.images.findIndex(item => item.id === current.current.selectedId);
      if (next < 0) return;
      syncing.current = true;
      api.scrollTo(next, true);
      syncing.current = false;
    };
    const select = () => {
      if (syncing.current) return;
      const next = current.current.images[api.selectedScrollSnap()];
      if (next) current.current.onSelectedIdChange(next.id);
      // Reconcile a swipe after React has accepted or refused a controlled change.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    api.on('select', select).on('reInit', sync);
    sync();
    return () => { cancelAnimationFrame(frame); api.off('select', select).off('reInit', sync); };
  }, [api, current]);

  useEffect(() => {
    if (!api || index < 0) return;
    syncing.current = true;
    api.scrollTo(index, reducedMotion);
    syncing.current = false;
  }, [api, index, reducedMotion]);

  const navigate = next => {
    if (images[next]) onSelectedIdChange(images[next].id);
  };
  return <CarouselRoot className='ds-image-viewer' setApi={setApi}
    aria-label='Image viewer' dir={direction} opts={{ startIndex: initialIndex.current, direction, duration: reducedMotion ? 0 : 25, watchFocus: false }}>
    <header className='ds-image-viewer-header'>
      <span>{images.length > 1 ? `${index + 1} / ${images.length}` : 'Image preview'}</span>
      <Button ref={closeRef} size='icon' variant='ghost' tone='neutral' aria-label={closeLabel} onClick={() => onSelectedIdChange(null)}><Icon name='X' decorative /></Button>
    </header>
    <CarouselContent className='ml-0'>
      {images.map((item, itemIndex) => <CarouselItem key={item.id} className='ds-image-viewer-slide pl-0' aria-label={`${itemIndex + 1} of ${images.length}`} aria-hidden={itemIndex !== index}>
        <GalleryImage key={item.src} src={item.src} alt={item.alt} loading={itemIndex === index ? 'eager' : 'lazy'} decoding='async' draggable={false} />
      </CarouselItem>)}
    </CarouselContent>
    <footer className='ds-image-viewer-footer'>
      <p id={captionId} aria-live='polite' aria-atomic='true'>{image?.caption || image?.alt || 'Image preview'}</p>
      {images.length > 1 && <div className='ds-image-viewer-navigation'>
        <Button size='icon' variant='outline' tone='neutral' aria-label='Previous image' disabled={index === 0} onClick={() => navigate(index - 1)}><Icon name='ChevronLeft' className='ds-part-rtl-flip' decorative /></Button>
        <Button size='icon' variant='outline' tone='neutral' aria-label='Next image' disabled={index === images.length - 1} onClick={() => navigate(index + 1)}><Icon name='ChevronRight' className='ds-part-rtl-flip' decorative /></Button>
      </div>}
    </footer>
  </CarouselRoot>;
}

// Shared by ImageGallery and the MDX ImageModal adapter; Dialog owns all modal behavior.
export default function ImageLightbox({ images, selectedId, onSelectedIdChange, restoreFocusRef, closeLabel = 'Close image viewer' }) {
  const closeRef = useRef(null);
  const captionId = useId();
  const direction = useDirection();
  const image = selectedId === null ? undefined : images.find(item => item.id === selectedId);
  return <Dialog variant='bare' open={Boolean(image)} onOpenChange={open => !open && onSelectedIdChange(null)}
    label={image?.alt || 'Image preview'} initialFocusRef={closeRef} restoreFocusRef={restoreFocusRef}
    contentProps={{ 'aria-labelledby': captionId, onKeyDownCapture: event => {
      if (event.defaultPrevented || isTextEntryTarget(event.target) || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const previous = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      const next = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      if (![previous, next, 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const index = images.findIndex(item => item.id === selectedId);
      const target = images[event.key === 'Home' ? 0 : event.key === 'End' ? images.length - 1 : index + (event.key === next ? 1 : -1)];
      if (target) onSelectedIdChange(target.id);
    } }} className='ds-image-lightbox'>
    {image && <ImageViewer {...{ images, selectedId, onSelectedIdChange, closeRef, closeLabel, captionId }} />}
  </Dialog>;
}
