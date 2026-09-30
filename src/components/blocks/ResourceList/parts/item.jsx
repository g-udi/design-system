// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
import { Separator } from '../../../core/Separator/parts/separator.jsx';
function ItemGroup({ className, ...props }) {
  return (
    <div
      role='group'
      data-slot='item-group'
      className={cn(
        'ds-part-item-group group/item-group flex w-full flex-col',
        className
      )}
      {...props}
    />
  );
}
function ItemSeparator({ className, ...props }) {
  return (
    <Separator
      data-slot='item-separator'
      orientation='horizontal'
      className={cn('ds-part-item-separator', className)}
      {...props}
    />
  );
}
const itemVariants = cva(
  'ds-part-item group/item flex w-full flex-wrap items-center transition-colors duration-100 outline-none focus-visible:border-ui-ring focus-visible:ring-[3px] focus-visible:ring-ui-ring/50 [a]:transition-colors',
  {
    variants: {
      variant: {
        default: 'ds-part-item-variant-default',
        outline: 'ds-part-item-variant-outline',
        muted: 'ds-part-item-variant-muted'
      },
      size: {
        default: 'ds-part-item-size-default',
        sm: 'ds-part-item-size-sm',
        xs: 'ds-part-item-size-xs'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);
function Item({
  as: Element = 'div',
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : Element;
  return (
    <Comp
      data-slot='item'
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  );
}
const itemMediaVariants = cva(
  'ds-part-item-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'ds-part-item-media-variant-default',
        icon: 'ds-part-item-media-variant-icon',
        image: 'ds-part-item-media-variant-image'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);
function ItemMedia({ className, variant = 'default', ...props }) {
  return (
    <div
      data-slot='item-media'
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  );
}
function ItemContent({ className, ...props }) {
  return (
    <div
      data-slot='item-content'
      className={cn(
        'ds-part-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none',
        className
      )}
      {...props}
    />
  );
}
function ItemTitle({ className, ...props }) {
  return (
    <div
      data-slot='item-title'
      className={cn(
        'ds-part-item-title line-clamp-1 flex w-fit items-center',
        className
      )}
      {...props}
    />
  );
}
function ItemDescription({ className, ...props }) {
  return (
    <p
      data-slot='item-description'
      className={cn(
        'ds-part-item-description line-clamp-2 font-normal [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-ui-primary',
        className
      )}
      {...props}
    />
  );
}
function ItemActions({ className, ...props }) {
  return (
    <div
      data-slot='item-actions'
      className={cn('ds-part-item-actions flex items-center', className)}
      {...props}
    />
  );
}
function ItemHeader({ className, ...props }) {
  return (
    <div
      data-slot='item-header'
      className={cn(
        'ds-part-item-header flex basis-full items-center justify-between',
        className
      )}
      {...props}
    />
  );
}
function ItemFooter({ className, ...props }) {
  return (
    <div
      data-slot='item-footer'
      className={cn(
        'ds-part-item-footer flex basis-full items-center justify-between',
        className
      )}
      {...props}
    />
  );
}
export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter
};
