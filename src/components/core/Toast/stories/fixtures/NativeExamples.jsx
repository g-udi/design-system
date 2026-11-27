import { useEffect, useId } from 'react';
import { useTimeout } from '@gaudi/design-system/hooks/state/use-timeout';
import Button from '@gaudi/design-system/core/Button';
import { Item, ItemContent, ItemDescription, ItemGroup, ItemTitle } from '@gaudi/design-system/core/Item';
import ToastProvider, { toast } from '@gaudi/design-system/core/Toast';
export const saved = { title: 'Draft saved', description: 'Your latest changes are ready for review.' };

// The Playground owns a named toaster, so its stack never leaks into the other examples on the page.
function useDemoToasts() {
const toasterId = useId();
const pinned = { toasterId, duration: Infinity };
const stack = {
  saved: () => toast.success(saved.title, { ...pinned, id: `${toasterId}-saved`, description: saved.description }),
  export: () => toast.error('Export interrupted', {
    ...pinned,
    id: `${toasterId}-export`,
    description: 'Your draft is still saved.',
    action: {
      label: 'Retry',
      onClick: (event) => {
        // Keep the toast and update it in place instead of letting Sonner dismiss it.
        event.preventDefault();
        toast.success('Export restarted', { ...pinned, id: `${toasterId}-export`, description: 'We will email you the PDF.', action: null });
      }
    }
  }),
  publish: () => toast.loading('Publishing to 3 channels', { ...pinned, id: `${toasterId}-publish`, description: 'Blog, newsletter and RSS.' })
};
const showStack = () => Object.values(stack).forEach((show) => show());
useTimeout(showStack, 0);
useEffect(() => () => { for (const kind of ['saved', 'export', 'publish']) toast.dismiss(`${toasterId}-${kind}`); }, [toasterId]);
return { toasterId, stack };
}

export function PlaygroundDemo({ position = 'bottom-right', expand = true, closeButton = true, ...props } = {}) {
  const args = { position, expand, closeButton, ...props };
  const { toasterId, stack } = useDemoToasts();
  return (
    // `transform` makes the frame the containing block, so the fixed toaster is positioned inside it.
    <div className='relative h-96 overflow-hidden rounded-lg border border-border bg-surface [transform:translateZ(0)]'>
      <div className='flex flex-wrap items-center gap-2 border-b border-border px-3 py-2'>
        <span className='me-auto text-sm font-medium'>Quarterly report</span>
        <Button size='sm' variant='outline' tone='neutral' onClick={stack.saved}>Save draft</Button>
        <Button size='sm' variant='outline' tone='neutral' onClick={stack.export}>Export</Button>
        <Button size='sm' onClick={stack.publish}>Publish</Button>
      </div>
      <ItemGroup aria-label='Report outline'>
        <Item size='sm'>
          <ItemContent>
            <ItemTitle>Readership</ItemTitle>
            <ItemDescription>The field notes series drew the most returning readers this quarter.</ItemDescription>
          </ItemContent>
        </Item>
        <Item size='sm'>
          <ItemContent>
            <ItemTitle>Next issue</ItemTitle>
            <ItemDescription>Feature the archive interviews in the summer newsletter.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
      <ToastProvider id={toasterId} {...args} />
    </div>
  );
}
