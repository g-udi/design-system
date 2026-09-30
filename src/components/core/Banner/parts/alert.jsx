import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
const alertVariants = cva('ds-part-alert group/alert relative w-full', {
  variants: {
    variant: {
      default: 'ds-part-alert-variant-default',
      destructive: 'ds-part-alert-variant-destructive'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
});
function Alert({ className, variant, ...props }) {
  return (
    <div
      data-slot='alert'
      role='alert'
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
function AlertTitle({ className, ...props }) {
  return (
    <div
      data-slot='alert-title'
      className={cn(
        'ds-part-alert-title [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-ui-foreground',
        className
      )}
      {...props}
    />
  );
}
function AlertDescription({ className, ...props }) {
  return (
    <div
      data-slot='alert-description'
      className={cn(
        'ds-part-alert-description [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-ui-foreground',
        className
      )}
      {...props}
    />
  );
}
function AlertAction({ className, ...props }) {
  return (
    <div
      data-slot='alert-action'
      className={cn('ds-part-alert-action', className)}
      {...props}
    />
  );
}
export { Alert, AlertTitle, AlertDescription, AlertAction };
