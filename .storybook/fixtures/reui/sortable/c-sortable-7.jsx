// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const defaultImages = [
  {
    id: '1',
    name: 'hero-banner.jpg',
    dimensions: '1920\xD71080',
    size: '2.4 MB'
  },
  {
    id: '2',
    name: 'product-shot.png',
    dimensions: '800\xD7600',
    size: '1.8 MB'
  },
  {
    id: '3',
    name: 'team-photo.jpg',
    dimensions: '1200\xD7800',
    size: '3.2 MB'
  },
  { id: '4', name: 'logo-dark.svg', dimensions: '240\xD760', size: '12 KB' },
  { id: '5', name: 'og-image.png', dimensions: '1200\xD7630', size: '890 KB' },
  { id: '6', name: 'favicon.ico', dimensions: '32\xD732', size: '4 KB' }
];
export function Pattern() {
  const [images, setImages] = useState(defaultImages);
  return (
    <div className='mx-auto w-full max-w-md'>
      <Frame spacing='xs'>
        <FrameHeader>
          <FrameTitle>Media Library</FrameTitle>
          <FrameDescription>Drag to reorder display priority</FrameDescription>
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
              <SortableItem key={image.id} value={image.id}>
                <div className='bg-ui-muted group rounded-lg relative flex flex-col items-center justify-center gap-2 border p-4'>
                  <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100'>
                    <RegistryIcon
                      lucide='GripVerticalIcon'
                      className='size-3.5'
                    />
                  </SortableItemHandle>
                  <RegistryIcon
                    lucide='ImageIcon'
                    className='text-ui-muted-foreground size-5'
                  />
                  <div className='w-full text-center'>
                    <p className='truncate text-xs font-medium'>{image.name}</p>
                    <p className='text-ui-muted-foreground text-xs'>
                      {image.dimensions} &middot; {image.size}
                    </p>
                  </div>
                </div>
              </SortableItem>
            ))}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  );
}
