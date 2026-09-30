// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cva } from 'class-variance-authority';
import { cn } from '../../../../utilities/cn/index.js';
import { Slot } from 'radix-ui';
import { default as Button } from '../../Button/index.js';
const attachmentVariants = cva(
  'ds-part-attachment group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border bg-ui-card text-ui-card-foreground transition-colors has-[>a,>button]:hover:bg-ui-muted/50 data-[state=error]:border-ui-destructive/30 data-[state=idle]:border-dashed',
  {
    variants: {
      size: {
        default: 'ds-part-attachment-size-default',
        sm: 'ds-part-attachment-size-sm',
        xs: 'ds-part-attachment-size-xs'
      },
      orientation: {
        horizontal: 'ds-part-attachment-orientation-horizontal items-center',
        vertical: 'ds-part-attachment-orientation-vertical flex-col'
      }
    }
  }
);
function Attachment({
  className,
  state = 'done',
  size = 'default',
  orientation = 'horizontal',
  ...props
}) {
  return (
    <div
      data-slot='attachment'
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  );
}
const attachmentMediaVariants = cva(
  'ds-part-attachment-media relative flex aspect-square shrink-0 items-center justify-center overflow-hidden group-data-[state=error]/attachment:bg-ui-destructive/10 group-data-[state=error]/attachment:text-ui-destructive [&_svg]:pointer-events-none',
  {
    variants: {
      variant: {
        icon: 'ds-part-attachment-media-variant-icon',
        image:
          'ds-part-attachment-media-variant-image *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover'
      }
    },
    defaultVariants: {
      variant: 'icon'
    }
  }
);
function AttachmentMedia({ className, variant = 'icon', ...props }) {
  return (
    <div
      data-slot='attachment-media'
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  );
}
function AttachmentContent({ className, ...props }) {
  return (
    <div
      data-slot='attachment-content'
      className={cn(
        'ds-part-attachment-content max-w-full min-w-0 flex-1',
        className
      )}
      {...props}
    />
  );
}
function AttachmentTitle({ className, ...props }) {
  return (
    <span
      data-slot='attachment-title'
      className={cn(
        'ds-part-attachment-title block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer',
        className
      )}
      {...props}
    />
  );
}
function AttachmentDescription({ className, ...props }) {
  return (
    <span
      data-slot='attachment-description'
      className={cn(
        'ds-part-attachment-description block min-w-0 truncate text-ui-muted-foreground group-data-[state=error]/attachment:text-ui-destructive',
        'max-w-full',
        className
      )}
      {...props}
    />
  );
}
function AttachmentActions({ className, ...props }) {
  return (
    <div
      data-slot='attachment-actions'
      className={cn(
        'ds-part-attachment-actions flex shrink-0 items-center',
        className
      )}
      {...props}
    />
  );
}
function AttachmentAction({ className, variant, size = 'icon-xs', ...props }) {
  return (
    <Button
      data-slot='attachment-action'
      variant={variant ?? 'ghost'}
      size={size}
      className={cn('ds-part-attachment-action', className)}
      {...props}
    />
  );
}
function AttachmentTrigger({ className, asChild = false, type, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot='attachment-trigger'
      type={asChild ? void 0 : (type ?? 'button')}
      className={cn(
        'ds-part-attachment-trigger absolute inset-0 z-10 outline-none',
        className
      )}
      {...props}
    />
  );
}
function AttachmentGroup({ className, ...props }) {
  return (
    <div
      data-slot='attachment-group'
      className={cn(
        'ds-part-attachment-group flex min-w-0 scroll-fade-x snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start',
        className
      )}
      {...props}
    />
  );
}
export {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
  AttachmentTrigger
};
