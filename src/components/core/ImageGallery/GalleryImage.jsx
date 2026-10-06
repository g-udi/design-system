'use client';

import { useState } from 'react';
import Icon from '../Icon/index.js';

// Key by source at each call site so a replacement can recover from a failed image.
export default function GalleryImage({ src, alt = '', ...props }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <span className='ds-gallery-image-error' role='img' aria-label={alt || 'Image unavailable'}>
    <Icon name='Image' decorative />
    <span>Image unavailable</span>
  </span>;
  return <img {...props} src={src} alt={alt} onError={() => setFailed(true)} />;
}
