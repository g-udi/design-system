'use client';
import { cn } from '../../../utilities/cn/index.js';
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
    <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
  );
}
function TooltipContent({ className, sideOffset = 0, children, ...props }) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot='tooltip-content'
        sideOffset={sideOffset}
        className={cn(
          'ds-part-tooltip-content z-[calc(var(--ds-z-overlay)+1)] w-fit max-w-[min(20rem,var(--radix-tooltip-content-available-width))] origin-(--radix-tooltip-content-transform-origin) bg-ui-foreground text-ui-background',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className='ds-part-tooltip-arrow z-[calc(var(--ds-z-overlay)+1)] translate-y-[calc(-50%_-_2px)] bg-ui-foreground fill-ui-foreground' />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
