'use client';
import { cn } from '../../../../utilities/cn/index.js';
import { Avatar as AvatarPrimitive } from 'radix-ui';
function Avatar({ className, size = 'default', ...props }) {
  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      data-size={size}
      className={cn(
        'ds-part-avatar group/avatar relative flex shrink-0 select-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-ui-border after:pointer-events-none after:mix-blend-darken dark:after:mix-blend-lighten',
        className
      )}
      {...props}
    />
  );
}
function AvatarImage({ className, ...props }) {
  return (
    <AvatarPrimitive.Image
      data-slot='avatar-image'
      alt=''
      className={cn(
        'ds-part-avatar-image aspect-square size-full object-cover',
        className
      )}
      {...props}
    />
  );
}
function AvatarFallback({ className, ...props }) {
  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn(
        'ds-part-avatar-fallback flex size-full items-center justify-center',
        className
      )}
      {...props}
    />
  );
}
function AvatarBadge({ className, ...props }) {
  return (
    <span
      data-slot='avatar-badge'
      className={cn(
        'ds-part-avatar-badge absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-blend-color ring-2 select-none',
        'group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden',
        'group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2',
        'group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2',
        className
      )}
      {...props}
    />
  );
}
function AvatarGroup({ className, ...props }) {
  return (
    <div
      data-slot='avatar-group'
      className={cn(
        'ds-part-avatar-group group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-ui-background',
        className
      )}
      {...props}
    />
  );
}
function AvatarGroupCount({ className, ...props }) {
  return (
    <div
      data-slot='avatar-group-count'
      role={props['aria-label'] ? 'img' : undefined}
      className={cn(
        'ds-part-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-ui-background',
        '',
        className
      )}
      {...props}
    />
  );
}
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge
};
