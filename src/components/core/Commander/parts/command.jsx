// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { Command as CommandPrimitive } from 'cmdk';
import { cn } from '../../../../utilities/cn/index.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '../../Dialog/parts/dialog.jsx';
import { InputGroup, InputGroupAddon } from '../../Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import Kbd from '../../Kbd/Kbd.jsx';
function Command({ className, ...props }) {
  return (
    <CommandPrimitive
      data-slot='command'
      className={cn(
        'ds-part-command flex size-full flex-col overflow-hidden',
        className
      )}
      {...props}
    />
  );
}
function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = false,
  footer = <CommandFooter />,
  ...props
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className='sr-only'>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          'ds-part-command-dialog top-1/3 translate-y-0 overflow-hidden p-0',
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
        {footer}
      </DialogContent>
    </Dialog>
  );
}
function CommandInput({ className, ...props }) {
  return (
    <div
      data-slot='command-input-wrapper'
      className='ds-part-command-input-wrapper'
    >
      <InputGroup className='ds-part-command-input-group'>
        <CommandPrimitive.Input
          data-slot='command-input'
          className={cn(
            'ds-part-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <RegistryIcon
            lucide='SearchIcon'
            className='ds-part-command-input-icon'
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
function CommandList({ className, ...props }) {
  return (
    <CommandPrimitive.List
      data-slot='command-list'
      className={cn(
        'ds-part-command-list overflow-x-hidden overflow-y-auto',
        className
      )}
      {...props}
    />
  );
}
function CommandEmpty({ className, ...props }) {
  return (
    <CommandPrimitive.Empty
      data-slot='command-empty'
      className={cn('ds-part-command-empty', className)}
      {...props}
    />
  );
}
function CommandGroup({ className, ...props }) {
  return (
    <CommandPrimitive.Group
      data-slot='command-group'
      className={cn('ds-part-command-group', className)}
      {...props}
    />
  );
}
function CommandSeparator({ className, ...props }) {
  return (
    <CommandPrimitive.Separator
      data-slot='command-separator'
      aria-hidden='true'
      className={cn('ds-part-command-separator', className)}
      {...props}
    />
  );
}
function CommandItem({ className, children, ...props }) {
  return (
    <CommandPrimitive.Item
      data-slot='command-item'
      className={cn(
        'ds-part-command-item group/command-item data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children}
      <RegistryIcon
        lucide='CheckIcon'
        className='ds-part-command-item-indicator ml-auto hidden group-data-[checked=true]/command-item:block group-has-data-[slot=command-shortcut]/command-item:hidden'
      />
    </CommandPrimitive.Item>
  );
}
function CommandShortcut({ className, ...props }) {
  return (
    <span
      data-slot='command-shortcut'
      className={cn('ds-part-command-shortcut', className)}
      {...props}
    />
  );
}
/** Keyboard hints under the list, shared by CommandDialog and Commander. */
function CommandFooter({ className, ...props }) {
  return (
    <div
      data-slot='command-footer'
      className={cn('ds-part-command-footer', className)}
      {...props}
    >
      <span className='flex items-center gap-1.5'>
        <span className='inline-flex items-center gap-1'>
          <Kbd keys='up' size='sm' />
          <Kbd keys='down' size='sm' />
        </span>
        Navigate
      </span>
      <span className='hidden items-center gap-1.5 sm:flex'>
        <Kbd keys='enter' size='sm' />
        Select
      </span>
      <span className='ms-auto flex items-center gap-1.5'>
        <Kbd keys='escape' size='sm' />
        Close
      </span>
    </div>
  );
}
export {
  Command,
  CommandFooter,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator
};
