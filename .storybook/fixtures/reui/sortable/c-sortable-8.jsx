// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
  { id: '1', title: 'Draft the release notes' },
  { id: '2', title: 'Review open pull requests' },
  { id: '3', title: 'Update the changelog' },
  { id: '4', title: 'Cut the release tag' },
  { id: '5', title: 'Announce on the blog' }
];
function persistOrder(_meta) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.25) {
        reject(new Error('Network error'));
      } else {
        resolve();
      }
    }, 700);
  });
}
export function Pattern() {
  const [items, setItems] = useState(defaultItems);
  const handleValueCommit = (next, meta) => {
    const previous = meta.previousValue;
    const moved = next[meta.overIndex];
    toast.promise(persistOrder(meta), {
      loading: 'Saving order...',
      success: () => `Saved "${moved.title}" at position ${meta.overIndex + 1}`,
      error: () => {
        setItems(previous);
        return 'Could not save the new order. Restored.';
      }
    });
  };
  return (
    <div className='mx-auto w-full max-w-xl p-6'>
      <Sortable
        value={items}
        onValueChange={setItems}
        onValueCommit={handleValueCommit}
        getItemValue={(item) => item.id}
        strategy='vertical'
        className='space-y-2'
      >
        {items.map((item, index) => (
          <SortableItem key={item.id} value={item.id}>
            <div className='bg-ui-background border-ui-border flex items-center gap-3 rounded-md border p-3'>
              <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground'>
                <RegistryIcon lucide='GripVerticalIcon' className='h-4 w-4' />
              </SortableItemHandle>
              <Badge variant='outline' className='tabular-nums'>
                {index + 1}
              </Badge>
              <span className='min-w-0 flex-1 truncate text-sm font-medium'>
                {item.title}
              </span>
            </div>
          </SortableItem>
        ))}
      </Sortable>
    </div>
  );
}
