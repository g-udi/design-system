'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '../../../../src/components/core/Sortable/parts/sortable-extended.jsx';
import { toast } from 'sonner';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const defaultItems = [
  {
    id: '1',
    title: 'Product Demo',
    description: 'Main product image',
    type: 'image',
    size: '2.4 MB'
  },
  {
    id: '2',
    title: 'Product Specification',
    description: 'Technical details document',
    type: 'document',
    size: '1.2 MB'
  },
  {
    id: '3',
    title: 'Product Demo Video',
    description: 'How to use the product',
    type: 'video',
    size: '15.7 MB'
  },
  {
    id: '4',
    title: 'Product Audio Guide',
    description: 'Audio instructions',
    type: 'audio',
    size: '8.3 MB'
  },
  {
    id: '5',
    title: 'Product Specification',
    description: 'Additional product view',
    type: 'image',
    size: '3.1 MB'
  }
];
const getTypeIcon = (type) => {
  switch (type) {
    case 'image':
      return <RegistryIcon lucide='ImageIcon' className='h-4 w-4' />;
    case 'document':
      return <RegistryIcon lucide='FileTextIcon' className='h-4 w-4' />;
    case 'audio':
      return <RegistryIcon lucide='MusicIcon' className='h-4 w-4' />;
    case 'video':
      return <RegistryIcon lucide='VideoIcon' className='h-4 w-4' />;
  }
};
const getTypeColor = (type) => {
  switch (type) {
    case 'image':
      return 'primary-light';
    case 'document':
      return 'success-light';
    case 'audio':
      return 'destructive-light';
    case 'video':
      return 'info-light';
  }
};
export function Pattern() {
  const [items, setItems] = useState(defaultItems);
  const handleValueChange = (newItems) => {
    setItems(newItems);
    toast.success('Items reordered successfully!', {
      description: newItems
        .map((item, index) => `${index + 1}. ${item.title}`)
        .join(', ')
    });
  };
  const getItemValue = (item) => item.id;
  return (
    <div className='mx-auto w-full max-w-xl space-y-4'>
      <Sortable
        value={items}
        onValueChange={handleValueChange}
        getItemValue={getItemValue}
        strategy='vertical'
        className='space-y-2'
      >
        {items.map((item) => (
          <SortableItem key={item.id} value={item.id}>
            <div
              className='bg-ui-background border-ui-border hover:bg-ui-accent/50 rounded-md flex cursor-pointer items-center gap-3 border px-3 py-2 transition-colors'
              onClick={() => {}}
            >
              <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground'>
                <RegistryIcon lucide='GripVerticalIcon' className='h-4 w-4' />
              </SortableItemHandle>

              <div className='text-ui-muted-foreground flex items-center gap-2'>
                {getTypeIcon(item.type)}
              </div>

              <div className='min-w-0 flex-1'>
                <h4 className='truncate text-sm font-medium'>{item.title}</h4>
                <p className='text-ui-muted-foreground truncate text-xs'>
                  {item.description}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <Badge variant={getTypeColor(item.type)}>{item.type}</Badge>
                <span className='text-ui-muted-foreground text-xs'>
                  {item.size}
                </span>
              </div>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}
