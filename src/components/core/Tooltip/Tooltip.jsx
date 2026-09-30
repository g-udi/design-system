'use client';

import { Tooltip as TooltipRoot, TooltipContent, TooltipProvider, TooltipTrigger } from './parts/tooltip.jsx';

/** The child must forward its ref and have an accessible name of its own. */
export default function Tooltip({
  children,
  content,
  side = 'top',
  delayDuration = 300,
  open,
  defaultOpen,
  onOpenChange
}) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {/* Above the convenience Dialog's layer, so hints inside a dialog stay visible. */}
        <TooltipContent side={side} sideOffset={6} collisionPadding={12} className='z-[calc(var(--ds-z-overlay)+20)] max-w-[min(20rem,calc(100vw-1.5rem))] wrap-anywhere'>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
