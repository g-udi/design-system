'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { toast } from 'sonner';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Product media: drag a row by its handle to set the display order; the switch
// inside each row stays clickable without starting a drag.
const defaultItems = [
  { id: '1', title: 'Product photo', description: 'Main listing image', type: 'image', size: '2.4 MB', visible: true },
  { id: '2', title: 'Specification sheet', description: 'Technical details', type: 'document', size: '1.2 MB', visible: true },
  { id: '3', title: 'Demo video', description: 'How to set it up', type: 'video', size: '15.7 MB', visible: true },
  { id: '4', title: 'Audio guide', description: 'Spoken instructions', type: 'audio', size: '8.3 MB', visible: false },
  { id: '5', title: 'Side view', description: 'Additional angle', type: 'image', size: '3.1 MB', visible: true }
];
const types = {
  image: { icon: 'ImageIcon', variant: 'primary-light' },
  document: { icon: 'FileTextIcon', variant: 'success-light' },
  video: { icon: 'VideoIcon', variant: 'info-light' },
  audio: { icon: 'MusicIcon', variant: 'warning-light' }
};

export function Pattern() {
  const [items, setItems] = useState(defaultItems);
  const reorder = (next) => {
    setItems(next);
    toast.success('Media reordered', {
      description: next.map((item, index) => `${index + 1}. ${item.title}`).join(', ')
    });
  };
  const toggle = (id) =>
    setItems((current) => current.map((item) => (item.id === id ? { ...item, visible: !item.visible } : item)));
  const shown = items.filter((item) => item.visible).length;
  return (
    <div className='mx-auto w-full max-w-lg'>
      <Frame spacing='xs'>
        <FrameHeader>
          <FrameTitle>Product media</FrameTitle>
          <FrameDescription>{shown} of {items.length} shown on the listing, top first.</FrameDescription>
        </FrameHeader>
        <Sortable
          value={items}
          onValueChange={reorder}
          getItemValue={(item) => item.id}
          strategy='vertical'
          className='space-y-0.5'
        >
          {items.map((item, index) => (
            <SortableItem key={item.id} value={item.id}>
              <FramePanel className='p-0!'>
                <div className='flex items-center gap-2 px-2 py-1.5'>
                  <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground'>
                    <RegistryIcon lucide='GripVerticalIcon' className='size-4' />
                  </SortableItemHandle>
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-md bg-ui-muted text-ui-muted-foreground'>
                    <RegistryIcon lucide={types[item.type].icon} className='size-4' />
                  </span>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-medium'>
                      {item.title}
                      {index === 0 && (
                        <Badge variant='primary-light' size='xs' className='ms-1.5 align-middle'>Cover</Badge>
                      )}
                    </p>
                    <p className='truncate text-xs text-ui-muted-foreground'>{item.description} · {item.size}</p>
                  </div>
                  <Badge variant={types[item.type].variant} size='sm' className='hidden sm:inline-flex'>{item.type}</Badge>
                  <Switch aria-label={`Show ${item.title}`} checked={item.visible} onCheckedChange={() => toggle(item.id)} />
                </div>
              </FramePanel>
            </SortableItem>
          ))}
        </Sortable>
      </Frame>
    </div>
  );
}
