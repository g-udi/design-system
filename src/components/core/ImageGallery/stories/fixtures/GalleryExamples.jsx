import { useState } from 'react';
import { ImageGallery } from '@gaudi/design-system/core/ImageGallery';
import Button from '@gaudi/design-system/core/Button';

export const images = [
  { id: 'lavender', src: '/static/images/art/0.svg', alt: 'Lavender abstract composition', caption: '01 — Lavender study', width: 1200, height: 900 },
  { id: 'blue', src: '/static/images/art/1.svg', alt: 'Peach and pink color study', caption: '02 — Peach bloom', width: 900, height: 1100 },
  { id: 'warm', src: '/static/images/art/2.svg', alt: 'Aqua and blue color study', caption: '03 — Cool light', width: 1200, height: 800 },
  { id: 'green', src: '/static/images/art/3.svg', alt: 'Green and yellow color study', caption: '04 — Quiet structure', width: 1000, height: 1000 },
  { id: 'rose', src: '/static/images/art/4.svg', alt: 'Rose and amber color study', caption: '05 — Soft edges', width: 1200, height: 800 },
  { id: 'amber', src: '/static/images/art/5.svg', alt: 'Lavender and indigo color study', caption: '06 — In balance', width: 1200, height: 900 }
];

export function GalleryPlayground(args) {
  return <div className='mx-auto w-full max-w-6xl'>
    <ImageGallery images={images} {...args} />
  </div>;
}

export function SingleImage() {
  return <div className='mx-auto w-full max-w-2xl'>
    <ImageGallery label='Article illustration' images={[{
      ...images[0], caption: 'Lavender gradient study. Select the image to expand it.', width: 1200, height: 675
    }]} />
  </div>;
}

export function ControlledGallery() {
  const [selectedId, setSelectedId] = useState(null);
  return <div className='mx-auto grid w-full max-w-3xl gap-3'>
    <div className='flex flex-wrap items-center gap-3'>
      <Button variant='outline' size='sm' onClick={() => setSelectedId('warm')}>Open cool light</Button>
      <p className='text-sm text-text-muted'>Open any image, then use the arrow keys or swipe to browse.</p>
    </div>
    <ImageGallery images={images.slice(0, 3)} layout='grid' selectedId={selectedId} onSelectedIdChange={setSelectedId} />
  </div>;
}

export function GalleryRecovery() {
  const [source, setSource] = useState('/static/images/gallery-missing.svg');
  return <div className='mx-auto grid w-full max-w-xl gap-4'>
    <ImageGallery label='Empty collection' images={[]} />
    <ImageGallery label='Source preview' images={[{ id: 'preview', src: source, alt: 'Source preview', caption: 'A failed image retains its label and space.', width: 1200, height: 800 }]} />
    <Button variant='outline' size='sm' onClick={() => setSource('/static/images/art/2.svg')}>Replace image</Button>
  </div>;
}
