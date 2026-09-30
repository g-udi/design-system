'use client';
import * as React from 'react';
import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { cn } from '../../../../utilities/cn/index.js';
import { default as Button } from '../../Button/index.js';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '../../Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
const Combobox = ComboboxPrimitive.Root;
function ComboboxValue({ ...props }) {
  return <ComboboxPrimitive.Value data-slot='combobox-value' {...props} />;
}
function ComboboxTrigger({ className, children, ...props }) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot='combobox-trigger'
      aria-label='Show options'
      className={cn('ds-part-combobox-trigger', className)}
      {...props}
    >
      {children}
      <RegistryIcon
        lucide='ChevronDownIcon'
        className='ds-part-combobox-trigger-icon pointer-events-none'
      />
    </ComboboxPrimitive.Trigger>
  );
}
function ComboboxClear({ className, ...props }) {
  return (
    <ComboboxPrimitive.Clear
      data-slot='combobox-clear'
      aria-label='Clear selection'
      render={<InputGroupButton variant='ghost' size='icon-xs' />}
      className={cn('ds-part-combobox-clear', className)}
      {...props}
    >
      <RegistryIcon
        lucide='XIcon'
        className='ds-part-combobox-clear-icon pointer-events-none'
      />
    </ComboboxPrimitive.Clear>
  );
}
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}) {
  return (
    <InputGroup className={cn('ds-part-combobox-input w-auto', className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align='inline-end'>
        {showTrigger && (
          <InputGroupButton
            size='icon-xs'
            variant='ghost'
            asChild
            data-slot='input-group-button'
            className='group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent'
            disabled={disabled}
          >
            <ComboboxTrigger />
          </InputGroupButton>
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
}
function ComboboxContent({
  className,
  side = 'bottom',
  sideOffset = 6,
  align = 'start',
  alignOffset = 0,
  anchor,
  ...props
}) {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className='isolate z-50'
      >
        <ComboboxPrimitive.Popup
          data-slot='combobox-content'
          data-chips={!!anchor}
          className={cn(
            'ds-part-combobox-content ds-part-combobox-content-logical ds-part-menu-target ds-part-menu-translucent group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) data-[chips=true]:min-w-(--anchor-width)',
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}
function ComboboxList({ className, ...props }) {
  return (
    <ComboboxPrimitive.List
      data-slot='combobox-list'
      className={cn(
        'ds-part-combobox-list overflow-y-auto overscroll-contain',
        className
      )}
      {...props}
    />
  );
}
function ComboboxItem({ className, children, ...props }) {
  return (
    <ComboboxPrimitive.Item
      data-slot='combobox-item'
      className={cn(
        'ds-part-combobox-item relative flex w-full cursor-default items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={<span className='ds-part-combobox-item-indicator' />}
      >
        <RegistryIcon
          lucide='CheckIcon'
          className='ds-part-combobox-item-indicator-icon pointer-events-none'
        />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  );
}
function ComboboxGroup({ className, ...props }) {
  return (
    <ComboboxPrimitive.Group
      data-slot='combobox-group'
      className={cn('ds-part-combobox-group', className)}
      {...props}
    />
  );
}
function ComboboxLabel({ className, ...props }) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot='combobox-label'
      className={cn('ds-part-combobox-label', className)}
      {...props}
    />
  );
}
function ComboboxCollection({ ...props }) {
  return (
    <ComboboxPrimitive.Collection data-slot='combobox-collection' {...props} />
  );
}
function ComboboxEmpty({ className, ...props }) {
  return (
    <ComboboxPrimitive.Empty
      data-slot='combobox-empty'
      className={cn('ds-part-combobox-empty', className)}
      {...props}
    />
  );
}
function ComboboxSeparator({ className, ...props }) {
  return (
    <ComboboxPrimitive.Separator
      data-slot='combobox-separator'
      className={cn('ds-part-combobox-separator', className)}
      {...props}
    />
  );
}
function ComboboxChips({ className, ...props }) {
  return (
    <ComboboxPrimitive.Chips
      data-slot='combobox-chips'
      className={cn('ds-part-combobox-chips', className)}
      {...props}
    />
  );
}
function ComboboxChip({ className, children, showRemove = true, ...props }) {
  return (
    <ComboboxPrimitive.Chip
      data-slot='combobox-chip'
      className={cn(
        'ds-part-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant='ghost' size='icon-xs' />}
          className='ds-part-combobox-chip-remove'
          data-slot='combobox-chip-remove'
          aria-label='Remove selection'
        >
          <RegistryIcon
            lucide='XIcon'
            className='ds-part-combobox-chip-indicator-icon pointer-events-none'
          />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  );
}
function ComboboxChipsInput({ className, ...props }) {
  return (
    <ComboboxPrimitive.Input
      data-slot='combobox-chip-input'
      aria-label='Add selection'
      className={cn(
        'ds-part-combobox-chip-input min-w-16 flex-1 outline-none',
        className
      )}
      {...props}
    />
  );
}
function useComboboxAnchor() {
  return React.useRef(null);
}
export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor
};
