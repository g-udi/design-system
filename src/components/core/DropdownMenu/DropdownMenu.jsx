'use client';

import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem as DropdownMenuItemPart,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './parts/dropdown-menu.jsx';

export { DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator };

/** `destructive` is the convenience name for the part's `variant='destructive'`. */
export const DropdownMenuItem = ({ destructive, variant, ...props }) => (
  <DropdownMenuItemPart variant={destructive ? 'destructive' : variant} {...props} />
);

/** A trigger and its menu in one component, built on the DropdownMenu parts. */
export default function DropdownMenu({ trigger, children, align = 'end', ...props }) {
  return (
    <DropdownMenuRoot {...props}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      {/* Sized to its items rather than the trigger, and above the convenience Dialog's layer. */}
      <DropdownMenuContent
        align={align}
        sideOffset={6}
        collisionPadding={12}
        className='z-[calc(var(--ds-z-overlay)+10)] w-max max-w-[calc(100vw-1.5rem)] min-w-48'
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenuRoot>
  );
}
