'use client';
import { useId, useState } from 'react';
import { useTimeout } from '@gaudi/design-system/hooks/state/use-timeout';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import { Label } from '@gaudi/design-system/core/Field';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Sortable,
  SortableItem,
  SortableItemHandle
} from '@gaudi/design-system/core/Sortable';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const defaultItems = [
  { id: '1', title: 'Outline the essay' },
  { id: '2', title: 'Collect reader questions' },
  { id: '3', title: 'Choose the cover image' },
  { id: '4', title: 'Schedule the post' },
  { id: '5', title: 'Share it in the newsletter' }
];
export function Pattern() {
  const toastId = useId();
  const [items, setItems] = useState(defaultItems);
  const [pending, setPending] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  useTimeout(() => {
    if (pending.fail) {
      setItems(pending.previous);
      toast.error('Could not save the new order. Restored.', { id: toastId, toasterId: toastId });
    } else {
      toast.success(`Saved "${pending.title}" at position ${pending.position}`, { id: toastId, toasterId: toastId });
    }
    setPending(null);
  }, pending ? 700 : null);
  const handleValueCommit = (next, meta) => {
    if (pending) return;
    setPending({ previous: meta.previousValue, title: next[meta.overIndex].title, position: meta.overIndex + 1, fail: simulateFailure });
    toast.loading('Saving order...', { id: toastId, toasterId: toastId });
  };
  return (
    <>
      <ToastProvider id={toastId} />
    <div className='mx-auto grid w-full max-w-xl gap-3'>
      <Label className='gap-2'><Switch checked={simulateFailure} onCheckedChange={setSimulateFailure} disabled={Boolean(pending)} />Simulate a failed save</Label>
      <Sortable
        value={items}
        onValueChange={setItems}
        onValueCommit={handleValueCommit}
        getItemValue={(item) => item.id}
        strategy='vertical'
        className='space-y-2'
      >
        {items.map((item, index) => (
          <SortableItem key={item.id} value={item.id} disabled={Boolean(pending)}>
            <div className='bg-ui-background border-ui-border flex items-center gap-3 rounded-md border px-3 py-2'>
              <SortableItemHandle className='text-ui-muted-foreground hover:text-ui-foreground'>
                <RegistryIcon lucide='GripVerticalIcon' className='size-4' />
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
    </>
  );
}
