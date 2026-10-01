'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { HoverCard as HoverCardPrimitive } from 'radix-ui';
function HoverCard({ ...props }) {
  return <HoverCardPrimitive.Root data-slot='hover-card' {...props} />;
}
function HoverCardTrigger({ ...props }) {
  return (
    <HoverCardPrimitive.Trigger data-slot='hover-card-trigger' {...props} />
  );
}
function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}) {
  return (
    <HoverCardPrimitive.Portal data-slot='hover-card-portal'>
      <HoverCardPrimitive.Content
        data-slot='hover-card-content'
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'ds-part-hover-card-content z-[calc(var(--ds-z-overlay)+1)] origin-(--radix-hover-card-content-transform-origin) outline-hidden',
          className
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  );
}
export { HoverCard, HoverCardTrigger, HoverCardContent };
