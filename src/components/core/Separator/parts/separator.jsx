// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Separator as SeparatorPrimitive } from 'radix-ui';
function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}) {
  return (
    <SeparatorPrimitive.Root
      data-slot='separator'
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-ui-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch',
        className
      )}
      {...props}
    />
  );
}
export { Separator };
