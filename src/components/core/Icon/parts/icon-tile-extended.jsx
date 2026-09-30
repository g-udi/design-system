import { cva } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '../../../../utilities/cn/index.js';
const iconTileVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center align-middle',
    'size-(--icon-tile-size) rounded-(--icon-tile-radius)',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-(--icon-tile-icon-size)'
  ],
  {
    variants: {
      variant: {
        /** Plain bordered surface. The quiet default for list rows and toolbars. */
        outline: 'border border-ui-border bg-ui-background dark:bg-ui-input/32',
        /** Raised muted fill with a background-colored ring. Reads as a physical chip. */
        elevated:
          'border-2 border-ui-background bg-ui-muted text-ui-accent-foreground shadow-[0_1px_3px_0_rgb(0_0_0/0.14)] dark:border',
        /**
         * Tinted double container: an opacity-filled outer ring with no border
         * around a bordered inner card, all derived from `currentColor`. The
         * quiet, colorful sibling of `frame`. Retint with a text color class.
         */
        soft: [
          'isolate p-(--icon-tile-inset) text-ui-primary bg-current/10',
          'after:absolute after:-z-10 after:inset-(--icon-tile-inset)',
          'after:rounded-[calc(var(--icon-tile-radius)-var(--icon-tile-inset))]',
          'after:border after:border-current/20 after:bg-current/5'
        ],
        /** Filled tone with a contrasting glyph. Retint with `bg-*` + a text color. */
        solid: 'bg-ui-primary text-ui-primary-foreground',
        /** Double container - a muted ring around an inset card, matching Frame. */
        frame: [
          'isolate border border-ui-border bg-ui-muted/50 p-(--icon-tile-inset)',
          'after:absolute after:-z-10 after:inset-(--icon-tile-inset)',
          'after:rounded-[calc(var(--icon-tile-radius)-var(--icon-tile-inset))]',
          'after:border after:border-ui-border after:bg-ui-card after:shadow-xs'
        ]
      },
      size: {
        xs: '[--icon-tile-size:--spacing(6)] [--icon-tile-icon-size:--spacing(3.5)] [--icon-tile-inset:--spacing(0.5)]',
        sm: '[--icon-tile-size:--spacing(8)] [--icon-tile-icon-size:--spacing(4)] [--icon-tile-inset:--spacing(0.5)]',
        default:
          '[--icon-tile-size:--spacing(10)] [--icon-tile-icon-size:--spacing(4.5)] [--icon-tile-inset:--spacing(0.75)]',
        lg: '[--icon-tile-size:--spacing(12)] [--icon-tile-icon-size:--spacing(5.5)] [--icon-tile-inset:--spacing(0.75)]',
        xl: '[--icon-tile-size:--spacing(14)] [--icon-tile-icon-size:--spacing(7)] [--icon-tile-inset:--spacing(1)]'
      },
      /** `default`: the global corner radius, capped at a third of the tile so small tiles keep their shape. `full`: the control radius. */
      radius: {
        default: '[--icon-tile-radius:min(var(--radius-md),calc(var(--icon-tile-size)/3))]',
        full: '[--icon-tile-radius:var(--ds-radius-control)]'
      }
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
      radius: 'default'
    }
  }
);
function IconTile({
  className,
  variant = 'outline',
  size = 'default',
  radius = 'default',
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : 'span';
  return (
    <Comp
      data-slot='icon-tile'
      data-variant={variant}
      data-size={size}
      className={cn(iconTileVariants({ variant, size, radius, className }))}
      {...props}
    />
  );
}
export { IconTile, iconTileVariants };
