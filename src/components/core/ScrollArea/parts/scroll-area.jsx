// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui';
function ScrollArea({ className, children, ...props }) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot='scroll-area'
      className={cn('ds-part-scroll-area relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot='scroll-area-viewport'
        tabIndex={0}
        role='region'
        aria-label={props['aria-label'] || 'Scrollable content'}
        className='ds-part-scroll-area-viewport size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ui-ring/50 focus-visible:outline-1'
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
function ScrollBar({ className, orientation = 'vertical', ...props }) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot='scroll-area-scrollbar'
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        'ds-part-scroll-area-scrollbar flex touch-none p-px transition-colors select-none',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot='scroll-area-thumb'
        className='ds-part-scroll-area-thumb relative flex-1 bg-ui-border'
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
}
export { ScrollArea, ScrollBar };
