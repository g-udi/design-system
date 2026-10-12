'use client';
import { useState } from 'react';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '@gaudi/design-system/core/Card';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '@gaudi/design-system/core/Sortable';
import { cn } from '@gaudi/design-system/utilities/cn';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// A media library on the grid strategy. The featured tile spans two cells, and
// each handle appears on hover so the thumbnails stay clean.
const defaultImages = [
  { id: '1', src: '/static/images/art/0.svg', name: 'hero-banner.jpg', dimensions: '1920×1080', size: '2.4 MB', featured: true },
  { id: '2', src: '/static/images/art/1.svg', name: 'product-shot.png', dimensions: '800×600', size: '1.8 MB' },
  { id: '3', src: '/static/images/art/2.svg', name: 'team-photo.jpg', dimensions: '1200×800', size: '3.2 MB' },
  { id: '4', src: '/static/images/art/3.svg', name: 'logo-dark.svg', dimensions: '240×60', size: '12 KB' },
  { id: '5', src: '/static/images/art/4.svg', name: 'og-image.png', dimensions: '1200×630', size: '890 KB' },
  { id: '6', src: '/static/images/art/5.svg', name: 'detail-shot.jpg', dimensions: '1024×1024', size: '1.1 MB' },
  { id: '7', src: '/static/images/art/6.svg', name: 'lifestyle.jpg', dimensions: '1600×900', size: '2.9 MB' }
];

export function Pattern() {
  const [images, setImages] = useState(defaultImages);
  return (
    <div className='mx-auto w-full max-w-lg'>
      <Frame spacing='xs'>
        <FrameHeader>
          <FrameTitle>Media library</FrameTitle>
          <FrameDescription>Drag to set the display order</FrameDescription>
        </FrameHeader>
        <FramePanel className='p-2!'>
          <Sortable
            value={images}
            onValueChange={setImages}
            getItemValue={(item) => item.id}
            strategy='grid'
            className='grid grid-cols-3 gap-2'
          >
            {images.map((image) => (
              <SortableItem key={image.id} value={image.id} className={cn(image.featured && 'col-span-2 row-span-2')}>
                <figure className='group relative grid h-full content-start gap-1.5 rounded-lg border border-ui-border bg-ui-background p-1.5'>
                  <img
                    src={image.src}
                    alt={image.name}
                    className={cn('w-full rounded-md object-cover', image.featured ? 'h-44' : 'h-16')}
                  />
                  <SortableItemHandle className='absolute top-2.5 end-2.5 rounded-md bg-ui-background/90 p-0.5 text-ui-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-ui-foreground focus-visible:opacity-100'>
                    <RegistryIcon lucide='GripVerticalIcon' className='size-3.5' />
                  </SortableItemHandle>
                  <figcaption className='min-w-0 px-0.5'>
                    <p className='flex items-center gap-1.5 text-xs font-medium'>
                      <span className='truncate'>{image.name}</span>
                      {image.featured && <Badge variant='warning-light' size='xs'>Featured</Badge>}
                    </p>
                    <p className='truncate text-xs text-ui-muted-foreground'>{image.dimensions} · {image.size}</p>
                  </figcaption>
                </figure>
              </SortableItem>
            ))}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  );
}
