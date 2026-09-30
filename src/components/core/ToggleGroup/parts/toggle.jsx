// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Toggle as TogglePrimitive } from 'radix-ui';
const toggleVariants = cva(
  'ds-part-toggle group/toggle inline-flex items-center justify-center whitespace-nowrap outline-none hover:bg-ui-muted focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'ds-part-toggle-variant-default',
        outline: 'ds-part-toggle-variant-outline'
      },
      size: {
        default: 'ds-part-toggle-size-default',
        sm: 'ds-part-toggle-size-sm',
        lg: 'ds-part-toggle-size-lg'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);
function Toggle({
  className,
  variant = 'default',
  size = 'default',
  ...props
}) {
  return (
    <TogglePrimitive.Root
      data-slot='toggle'
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}
export { Toggle, toggleVariants };
