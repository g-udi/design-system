'use client';

import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useControllableState } from '../../../hooks/state/use-controllable-state.js';
import { Badge } from '../Pill/Badge.jsx';
import { cn } from '../../../utilities/cn';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger
} from './Combobox.jsx';

const EMPTY_OPTIONS = [];

// `options` wins; otherwise native `<option>` children become option objects.
const normalizeOptions = (children, options) => {
  if (options?.length) return options;
  return Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === 'option')
    .map((child) => ({ disabled: child.props.disabled, label: child.props.children, value: child.props.value ?? String(child.props.children ?? '') }));
};

const toValue = (incoming, multiple) => multiple
  ? Array.isArray(incoming) ? incoming : incoming == null || incoming === '' ? [] : [incoming]
  : Array.isArray(incoming) ? incoming[0] ?? null : incoming ?? null;

const matches = (option, query) => !query.trim() || `${option.textValue ?? option.label} ${option.description || ''}`.toLowerCase().includes(query.trim().toLowerCase());

/** Options-driven Select on the shared Combobox: one popup, focus and keyboard implementation. */
const Select = ({
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-labelledby': ariaLabelledBy,
  children,
  className,
  classNames = {},
  defaultOpen = false,
  defaultValue,
  disabled = false,
  emptyText = 'No options found.',
  invalid = false,
  id: suppliedId,
  loading = false,
  loadingText = 'Loading options…',
  multiple = false,
  name,
  onOpenChange,
  onSearchChange,
  onValueChange,
  options = EMPTY_OPTIONS,
  placeholder = 'Select option',
  searchable = false,
  searchPlaceholder = 'Search options...',
  value
}) => {
  const generatedId = useId();
  const triggerId = suppliedId || `${generatedId}-trigger`;
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const normalizedOptions = useMemo(() => normalizeOptions(children, options), [children, options]);
  const [storedValue, setValue] = useControllableState({ value, defaultValue });
  const currentValue = toValue(storedValue, multiple);
  const [open, setOpen] = useState(defaultOpen && !disabled);
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (!disabled || !open) return;
    setOpen(false);
    setQuery('');
    onOpenChange?.(false);
  }, [disabled, open, onOpenChange]);
  const selectedValues = multiple ? currentValue : currentValue == null ? [] : [currentValue];
  const selectedOptions = normalizedOptions.filter((option) => selectedValues.includes(option.value));
  const filteredOptions = normalizedOptions.filter((option) => matches(option, query));
  const status = loading ? loadingText : !filteredOptions.length ? emptyText : '';
  const selectedLabel = selectedOptions.length ? selectedOptions.map((option) => option.label).reduce((parts, label, index) => [...parts, index ? ', ' : '', label], []) : placeholder;

  return (
    <div className={cn('w-full min-w-0 max-w-xs', className, classNames.root)}>
      <Combobox
        items={normalizedOptions.map((option) => option.value)}
        filteredItems={loading ? [] : filteredOptions.map((option) => option.value)}
        itemToStringLabel={(item) => String(normalizedOptions.find((option) => option.value === item)?.textValue ?? normalizedOptions.find((option) => option.value === item)?.label ?? item)}
        multiple={multiple}
        value={currentValue}
        onValueChange={(next) => {
          if (disabled) return;
          const changed = multiple ? [...selectedValues, ...next].find((item) => selectedValues.includes(item) !== next.includes(item)) : next;
          setValue(next);
          onValueChange?.(next, normalizedOptions.find((option) => option.value === changed));
        }}
        disabled={disabled}
        name={disabled ? undefined : name}
        open={open && !disabled}
        onOpenChange={(open) => {
          if (disabled && open) return;
          setOpen(open);
          if (!open) setQuery('');
          onOpenChange?.(open);
        }}
        inputValue={query}
        onInputValueChange={(next, details) => {
          if (details.reason !== 'input-change' && details.reason !== 'input-clear') return;
          setQuery(next);
          onSearchChange?.(next);
        }}
        autoHighlight
        loopFocus={false}
      >
        <ComboboxTrigger
          id={triggerId}
          role='button'
          tabIndex={0}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-invalid={invalid || undefined}
          data-slot='select-trigger'
          data-size='default'
          className={cn('ds-part-select-trigger ds-motion-press flex w-full min-w-0 items-center justify-between text-left', classNames.trigger)}
        >
          <span className={cn('min-w-0 flex-1 truncate', classNames.value)}>{selectedLabel}</span>
          {multiple && selectedOptions.length ? <Badge variant='primary-light' size='sm'>{selectedOptions.length}</Badge> : null}
        </ComboboxTrigger>
        <ComboboxContent initialFocus={searchable ? searchRef : listRef} className={cn('min-w-0', classNames.content)}>
          {searchable ? (
            <ComboboxInput
              ref={searchRef}
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              showTrigger={false}
              className='w-full border-0 border-b rounded-none shadow-none'
            />
          ) : null}
          <ComboboxList ref={listRef} tabIndex={searchable ? -1 : 0} aria-label={`${ariaLabel || placeholder} options`} aria-busy={loading} className='max-h-64'>
            {loading ? null : filteredOptions.map((option) => (
              <ComboboxItem key={option.value} value={option.value} disabled={option.disabled} className={cn('pointer-coarse:min-h-11', classNames.option)}>
                <span className='min-w-0 break-words'>
                  {option.label}
                  {option.description ? <span className='block text-xs text-ui-muted-foreground'>{option.description}</span> : null}
                </span>
              </ComboboxItem>
            ))}
            {status ? <div role='option' aria-selected={false} aria-disabled='true' className='px-3 py-4 text-center text-sm text-ui-muted-foreground'>{status}</div> : null}
          </ComboboxList>
          <span role='status' className='sr-only'>{status}</span>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default Select;
