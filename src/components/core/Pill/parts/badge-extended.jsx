import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
const badgeVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center w-fit border border-transparent font-medium whitespace-nowrap outline-none transition-shadow',
    'focus-visible:ring-2 focus-visible:ring-ui-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-3'
  ],
  {
    variants: {
      variant: {
        default: 'bg-ui-primary text-ui-primary-foreground',
        outline: 'border-ui-border bg-transparent dark:bg-ui-input/32',
        secondary: 'bg-ui-secondary text-ui-secondary-foreground',
        info: 'bg-info text-info-foreground',
        success: 'bg-success text-success-foreground',
        warning: 'bg-warning text-warning-foreground',
        destructive: 'bg-ui-destructive text-ui-destructive-foreground',
        focus: 'bg-ui-focus text-ui-focus-foreground',
        invert: 'bg-ui-invert text-ui-invert-foreground',
        'primary-light':
          'border-ui-primary/10 bg-ui-primary/10 text-ui-primary-strong dark:border-ui-primary/25 dark:bg-ui-primary/15 dark:text-ui-primary',
        'warning-light':
          'border-warning/15 bg-warning/10 text-ui-warning-ink dark:border-warning/25 dark:bg-warning/15 dark:text-ui-warning-ink',
        'success-light':
          'border-success/15 bg-success/10 text-ui-success-ink dark:border-success/25 dark:bg-success/15 dark:text-ui-success-ink',
        'info-light':
          'border-info/15 bg-info/10 text-ui-info-ink dark:border-info/25 dark:bg-info/15 dark:text-ui-info-ink',
        'destructive-light':
          'border-ui-destructive/15 bg-ui-destructive/10 text-ui-danger-ink dark:border-ui-destructive/25 dark:bg-ui-destructive/15 dark:text-ui-danger-ink',
        'invert-light':
          'border-ui-invert/15 bg-ui-invert/10 text-ui-foreground dark:border-ui-invert/45 dark:bg-ui-invert/15',
        'focus-light':
          'border-ui-focus/15 bg-ui-focus/10 text-ui-focus-ink dark:border-ui-focus/25 dark:bg-ui-focus/15',
        'primary-outline':
          'bg-ui-background border-ui-border text-ui-primary-strong dark:bg-ui-input/30',
        'warning-outline':
          'bg-ui-background border-ui-border text-ui-warning-ink dark:bg-ui-input/30',
        'success-outline':
          'bg-ui-background border-ui-border text-ui-success-ink dark:bg-ui-input/30',
        'info-outline':
          'bg-ui-background border-ui-border text-ui-info-ink dark:bg-ui-input/30',
        'destructive-outline':
          'bg-ui-background border-ui-border text-ui-danger-ink dark:bg-ui-input/30',
        'invert-outline':
          'bg-ui-background border-ui-border text-ui-foreground dark:bg-ui-input/30',
        'focus-outline':
          'bg-ui-background border-ui-border text-ui-focus-ink dark:bg-ui-input/30'
      },
      size: {
        xs: 'px-1 py-0.25 text-xs leading-none h-4 min-w-4 gap-1',
        sm: 'px-1 py-0.25 text-xs leading-none h-4.5 min-w-4.5 gap-1',
        default: 'px-1.25 py-0.5 text-xs h-5 min-w-5 gap-1',
        lg: 'px-1.5 py-0.5 text-xs h-5.5 min-w-5.5 gap-1',
        xl: 'px-2 py-0.75 text-sm h-6 min-w-6 gap-1.5'
      },
      /** Legacy radius names resolve to Gaudi's global corner token. */
      radius: {
        default: 'rounded-sm',
        full: 'rounded-control'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      radius: 'default'
    }
  }
);
function Badge({
  className,
  variant,
  size,
  radius,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot='badge'
      data-variant={variant || 'default'}
      className={cn(badgeVariants({ variant, size, radius, className }))}
      {...props}
    />
  );
}
export { Badge, badgeVariants };
