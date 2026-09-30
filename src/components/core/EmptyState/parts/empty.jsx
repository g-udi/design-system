// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
function Empty({ className, ...props }) {
  return (
    <div
      data-slot='empty'
      className={cn(
        'ds-part-empty flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
        className
      )}
      {...props}
    />
  );
}
function EmptyHeader({ className, ...props }) {
  return (
    <div
      data-slot='empty-header'
      className={cn(
        'ds-part-empty-header flex max-w-sm flex-col items-center',
        className
      )}
      {...props}
    />
  );
}
const emptyMediaVariants = cva(
  'ds-part-empty-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'ds-part-empty-media-default',
        icon: 'ds-part-empty-media-icon'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
function EmptyMedia({ className, variant = 'default', ...props }) {
  return (
    <div
      data-slot='empty-icon'
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  );
}
function EmptyTitle({ className, ...props }) {
  return (
    <div
      data-slot='empty-title'
      className={cn('ds-part-empty-title ds-part-font-heading', className)}
      {...props}
    />
  );
}
function EmptyDescription({ className, ...props }) {
  return (
    <div
      data-slot='empty-description'
      className={cn(
        'ds-part-empty-description text-ui-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-ui-primary',
        className
      )}
      {...props}
    />
  );
}
function EmptyContent({ className, ...props }) {
  return (
    <div
      data-slot='empty-content'
      className={cn(
        'ds-part-empty-content flex w-full max-w-sm min-w-0 flex-col items-center text-balance',
        className
      )}
      {...props}
    />
  );
}
export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia
};
