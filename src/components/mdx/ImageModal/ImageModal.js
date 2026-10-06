'use client';

import ImageLightbox from '../../core/ImageGallery/ImageLightbox.jsx';

/** The article image adapter shares its accessible viewer with Core/ImageGallery. */
export default function ImageModal({ isOpen, onClose, src, alt, caption }) {
  return <ImageLightbox images={src ? [{ id: src, src, alt, caption }] : []}
    selectedId={isOpen && src ? src : null} onSelectedIdChange={id => id === null && onClose?.()} closeLabel='Close modal' />;
}
