'use client';
import { Fragment, useId, useRef, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { cn } from '../../../utilities/cn/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../core/DropdownMenu/DropdownMenuPrimitives.jsx';
import { InputGroupButton } from '../../core/Input/InputGroup.jsx';
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from '../../core/Popover/PopoverPrimitives.jsx';
import { Switch } from '../../core/Switch/SwitchPrimitives.jsx';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { ChatEffortSlider } from '../ChatEffortSlider/ChatEffortSlider.jsx';
import { ChatModelIcon } from './ChatModelSelect.jsx';
import { Toggle } from '../../core/ToggleGroup/Toggle.jsx';
import { AnimatedIcon } from '../../../icons/AnimatedIcon.jsx';
import Tooltip from '../../core/Tooltip/Tooltip.jsx';

/** A named tool toggle that reveals its label on keyboard focus or selection. */
function ChatPromptToggle({ icon, label, pressed: pressedProp, defaultPressed = false, onPressedChange, disabled = false, className }) {
  const [pressed, setPressed] = useControllableState({ value: pressedProp, defaultValue: defaultPressed, onChange: onPressedChange });
  const [engaged, setEngaged] = useState(false);
  return (
    <Tooltip content={label}>
      <Toggle
        pressed={pressed}
        onPressedChange={setPressed}
        disabled={disabled}
        aria-label={label}
        data-slot='prompt-toggle'
        className={cn('ds-part-prompt-toggle aria-pressed:hover:bg-accent-subtle aria-pressed:hover:text-accent', className)}
        onPointerEnter={(event) => { if (event.pointerType !== 'touch') setEngaged(true); }}
        onPointerLeave={() => setEngaged(false)}
        onFocus={() => setEngaged(true)}
        onBlur={() => setEngaged(false)}
      >
        <span data-slot='prompt-toggle-icon'>
          <AnimatedIcon name={icon} size='sm' active={!disabled && (engaged || pressed)} />
        </span>
        <span data-slot='prompt-toggle-label' aria-hidden='true'><span><span>{label}</span></span></span>
      </Toggle>
    </Tooltip>
  );
}

const DEFAULT_ATTACH_ITEMS = [
  { value: 'file', label: 'Upload files', icon: 'Paperclip', accept: '' },
  { value: 'photo', label: 'Add photos', icon: 'Image', accept: 'image/*' }
];

/**
 * The composer's "+" menu. `items` are `{ value, label, icon?, description?, shortcut?, accept?,
 * capture?, multiple?, disabled?, separator? }`: an item with `accept` (an empty string takes any file)
 * opens the file picker and reports `onAttach(files, item)`; other items call `onSelect(item)`, such as
 * "Add from Drive" or "Take a screenshot". `separator` draws a line before the item. The default items
 * upload files and add photos.
 */
function ChatPromptAttachMenu({ items = DEFAULT_ATTACH_ITEMS, onAttach, onSelect, label = 'Add attachments', align = 'start', disabled = false, className }) {
  const input = useRef(null);
  const [picking, setPicking] = useState(null);
  const pick = (item) => {
    if (disabled || item.disabled) return;
    if (item.accept === undefined) {
      onSelect?.(item);
      return;
    }
    setPicking(item);
    const node = input.current;
    if (!node) return;
    node.accept = item.accept;
    node.multiple = item.multiple ?? true;
    if (item.capture) node.setAttribute('capture', item.capture);
    else node.removeAttribute('capture');
    node.click();
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <InputGroupButton size='icon-sm' aria-label={label} disabled={disabled} data-slot='prompt-attach-menu' className={cn('ds-part-prompt-attach-menu', className)}>
            <RegistryIcon lucide='Plus' />
          </InputGroupButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align} collisionPadding={8} className='w-[min(15rem,calc(100vw-1rem))]'>
          {items.map((item) => (
            <Fragment key={item.value}>
              {item.separator ? <DropdownMenuSeparator /> : null}
              <DropdownMenuItem disabled={disabled || item.disabled} onSelect={() => pick(item)} className='items-start gap-2'>
                {item.icon ? <ChatModelIcon icon={item.icon} className='mt-0.5' /> : null}
                <span className='grid min-w-0 flex-1'>
                  <span>{item.label}</span>
                  {item.description ? <span className='text-text-muted text-xs'>{item.description}</span> : null}
                </span>
                {item.shortcut ? <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut> : null}
              </DropdownMenuItem>
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        ref={input}
        type='file'
        disabled={disabled}
        hidden
        tabIndex={-1}
        aria-hidden='true'
        onChange={(event) => {
          if (!disabled && event.target.files?.length) onAttach?.([...event.target.files], picking);
          event.target.value = '';
        }}
      />
    </>
  );
}

/**
 * Prompt options behind one icon button in the composer toolbar: an effort level (pass `effort` and
 * `onEffortChange`, with `effortLevels` for your own steps) and switches for `options`
 * `{ value, label, description?, icon? }`, such as web search or tools. `values` / `defaultValues` /
 * `onValuesChange(values, changed)` hold the switches as `{ [value]: boolean }`. The trigger names how
 * many options are on and shows a dot while any are. `children` add more controls under the switches.
 */
function ChatPromptSettings({
  options = [],
  values: valuesProp,
  defaultValues = {},
  onValuesChange,
  effort,
  defaultEffort,
  onEffortChange,
  effortLevels,
  effortLabel = 'Effort',
  label = 'Options',
  description,
  align = 'start',
  side,
  disabled = false,
  className,
  contentClassName,
  children
}) {
  const [values, setValues] = useControllableState({ value: valuesProp, defaultValue: defaultValues });
  const id = useId();
  const active = options.filter((option) => values[option.value]);
  const toggle = (value, checked) => {
    if (disabled) return;
    const next = { ...values, [value]: checked };
    setValues(next);
    onValuesChange?.(next, value);
  };
  const showEffort = effort !== undefined || defaultEffort !== undefined || onEffortChange;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroupButton
          size='icon-sm'
          disabled={disabled}
          aria-label={active.length ? `${label}, ${active.map((option) => option.label).join(', ')} on` : label}
          data-slot='prompt-settings'
          data-active={active.length ? true : undefined}
          className={cn('ds-part-prompt-settings relative', className)}
        >
          <RegistryIcon lucide='SlidersHorizontal' />
          {active.length ? <span aria-hidden='true' className='bg-accent absolute end-1 top-1 size-1.5 rounded-full' /> : null}
        </InputGroupButton>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        collisionPadding={8}
        aria-labelledby={`${id}-title`}
        className={cn('w-[min(18rem,calc(100vw-1rem))] gap-3', contentClassName)}
      >
        <PopoverHeader>
          <PopoverTitle id={`${id}-title`}>{label}</PopoverTitle>
          {description ? <PopoverDescription>{description}</PopoverDescription> : null}
        </PopoverHeader>
        {showEffort ? (
          <ChatEffortSlider value={effort} defaultValue={defaultEffort} onValueChange={onEffortChange} levels={effortLevels} label={effortLabel} disabled={disabled} className='max-w-none' />
        ) : null}
        {options.length ? (
          <ul className={cn('grid gap-1', showEffort && 'border-t pt-2')}>
            {options.map((option) => (
              <li key={option.value} className='flex items-start gap-2 py-1'>
                {option.icon ? <ChatModelIcon icon={option.icon} className='text-text-muted mt-0.5 size-4' /> : null}
                <label htmlFor={`${id}-${option.value}`} className='grid min-w-0 flex-1 cursor-pointer gap-0.5'>
                  <span className='text-sm'>{option.label}</span>
                  {option.description ? <span className='text-text-muted text-xs'>{option.description}</span> : null}
                </label>
                <Switch
                  id={`${id}-${option.value}`}
                  size='sm'
                  checked={Boolean(values[option.value])}
                  disabled={disabled || option.disabled}
                  aria-label={option.label}
                  onCheckedChange={(checked) => toggle(option.value, checked)}
                  className='mt-0.5'
                />
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </PopoverContent>
    </Popover>
  );
}

export { ChatPromptAttachMenu, ChatPromptSettings, ChatPromptToggle };
