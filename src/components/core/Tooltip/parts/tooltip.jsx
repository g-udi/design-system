// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
function TooltipProvider({ delayDuration = 0, ...props }) {
  return (
    <TooltipPrimitive.Provider
      data-slot='tooltip-provider'
      delayDuration={delayDuration}
      {...props}
    />
  );
}
function Tooltip({ ...props }) {
  return <TooltipPrimitive.Root data-slot='tooltip' {...props} />;
}
function TooltipTrigger({ ...props }) {
  return (
    <TooltipPrimitive.Trigger
      data-slot='tooltip-trigger'
      aria-label='More information'
      {...props}
    />
  );
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot='tooltip-content'
        sideOffset={sideOffset}
        className={cn(
          'ds-part-tooltip-content z-50 w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) bg-ui-foreground text-ui-background',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className='ds-part-tooltip-arrow z-50 translate-y-[calc(-50%_-_2px)] bg-ui-foreground fill-ui-foreground' />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
