// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
const badgeVariants = cva(
  'ds-part-badge group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap focus-visible:border-ui-ring focus-visible:ring-[3px] focus-visible:ring-ui-ring/50 aria-invalid:border-ui-destructive aria-invalid:ring-ui-destructive/20 dark:aria-invalid:ring-ui-destructive/40 [&>svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'ds-part-badge-variant-default',
        secondary: 'ds-part-badge-variant-secondary',
        destructive: 'ds-part-badge-variant-destructive',
        outline: 'ds-part-badge-variant-outline',
        ghost: 'ds-part-badge-variant-ghost',
        link: 'ds-part-badge-variant-link'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
function Badge({ className, variant = 'default', asChild = false, ...props }) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot='badge'
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}
export { Badge, badgeVariants };
