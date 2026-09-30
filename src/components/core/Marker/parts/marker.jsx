import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
const markerVariants = cva(
  'ds-part-marker group/marker relative flex w-full items-center',
  {
    variants: {
      variant: {
        default: 'ds-part-marker-variant-default',
        separator: 'ds-part-marker-variant-separator',
        border: 'ds-part-marker-variant-border'
      }
    }
  }
);
function Marker({ className, variant = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='marker'
      data-variant={variant}
      className={cn(markerVariants({ variant, className }))}
      {...props}
    />
  );
}
function MarkerIcon({ className, ...props }) {
  return (
    <span
      data-slot='marker-icon'
      aria-hidden='true'
      className={cn('ds-part-marker-icon shrink-0', className)}
      {...props}
    />
  );
}
function MarkerContent({ className, ...props }) {
  return (
    <span
      data-slot='marker-content'
      className={cn(
        'ds-part-marker-content min-w-0 wrap-break-word',
        className
      )}
      {...props}
    />
  );
}
export { Marker, MarkerIcon, MarkerContent, markerVariants };
