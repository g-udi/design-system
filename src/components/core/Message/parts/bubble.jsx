import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
function BubbleGroup({ className, ...props }) {
  return (
    <div
      data-slot='bubble-group'
      className={cn('ds-part-bubble-group flex min-w-0 flex-col', className)}
      {...props}
    />
  );
}
const bubbleVariants = cva(
  'ds-part-bubble group/bubble relative flex w-fit min-w-0 flex-col',
  {
    variants: {
      variant: {
        default: 'ds-part-bubble-variant-default',
        secondary: 'ds-part-bubble-variant-secondary',
        muted: 'ds-part-bubble-variant-muted',
        tinted: 'ds-part-bubble-variant-tinted',
        outline: 'ds-part-bubble-variant-outline',
        ghost: 'ds-part-bubble-variant-ghost',
        destructive: 'ds-part-bubble-variant-destructive'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
function Bubble({ variant = 'default', align = 'start', className, ...props }) {
  return (
    <div
      data-slot='bubble'
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  );
}
function BubbleContent({ asChild = false, className, ...props }) {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      data-slot='bubble-content'
      className={cn(
        'ds-part-bubble-content w-fit max-w-full min-w-0 overflow-hidden wrap-break-word [button]:text-left [button,a]:transition-colors',
        className
      )}
      {...props}
    />
  );
}
const bubbleReactionsVariants = cva(
  'ds-part-bubble-reactions absolute z-10 flex w-fit items-center justify-center',
  {
    variants: {
      side: {
        top: 'ds-part-bubble-reactions-side-top',
        bottom: 'ds-part-bubble-reactions-side-bottom'
      },
      align: {
        start: 'ds-part-bubble-reactions-align-start',
        end: 'ds-part-bubble-reactions-align-end'
      }
    },
    defaultVariants: {
      side: 'bottom',
      align: 'end'
    }
  }
);
function BubbleReactions({
  side = 'bottom',
  align = 'end',
  className,
  ...props
}) {
  return (
    <div
      data-slot='bubble-reactions'
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  );
}
export { BubbleGroup, Bubble, BubbleContent, BubbleReactions };
