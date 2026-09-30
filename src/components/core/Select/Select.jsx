'use client';

import { Children, isValidElement, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import Icon from '../Icon';
import { Badge } from '../Pill/parts/badge-extended.jsx';
import { cn } from '../../../utilities/cn';

const EMPTY_OPTIONS = [];

// `options` wins; otherwise native `<option>` children become option objects.
const normalizeOptions = (children, options) => {
  if (options?.length) return options;

  return Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type === 'option')
    .map((child) => ({ disabled: child.props.disabled, label: child.props.children, value: child.props.value }));
};

const toValue = ({ defaultValue, multiple, value }) => {
  const incoming = value ?? defaultValue;

  if (multiple) {
    if (Array.isArray(incoming)) return incoming;

    return incoming ? [ incoming ] : [];
  }

  return Array.isArray(incoming) ? incoming[0] ?? '' : incoming ?? '';
};

const matches = (option, query) => {
  const needle = query.trim().toLowerCase();

  return !needle || `${option.textValue ?? option.label} ${option.description || ''}`.toLowerCase().includes(needle);
};

const firstEnabled = (list) => Math.max(0, list.findIndex((option) => !option.disabled));

/**
 * A listbox select with optional search and multiple selection. It shares the trigger, popup and item
 * styling of the `SelectTrigger`, `SelectContent` and `SelectItem` parts, so both read as one control.
 */
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
  const id = useId();
  const listboxId = `${id}-listbox`;
  const listboxLabel = `${ariaLabel || placeholder} options`;
  const triggerId = suppliedId || `${id}-trigger`;
  const listboxRef = useRef(null);
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const triggerRef = useRef(null);
  const isControlled = value !== undefined;
  const normalizedOptions = useMemo(() => normalizeOptions(children, options), [ children, options ]);
  const [ internalValue, setInternalValue ] = useState(() => toValue({ defaultValue, multiple, value }));
  const [ open, setOpen ] = useState(defaultOpen);
  const [ query, setQuery ] = useState('');
  const [ activeIndex, setActiveIndex ] = useState(0);
  const currentValue = isControlled ? toValue({ multiple, value }) : internalValue;
  let selectedValues = [];

  if (multiple) selectedValues = currentValue;
  else if (currentValue !== '' && currentValue != null) selectedValues = [ currentValue ];

  const selectedOptions = normalizedOptions.filter((option) => selectedValues.includes(option.value));
  const filteredOptions = useMemo(() => normalizedOptions.filter((option) => matches(option, query)), [ normalizedOptions, query ]);

  const updateOpen = useCallback((nextOpen) => {
    setOpen(nextOpen);
    onOpenChange?.(nextOpen);
    if (!nextOpen) setQuery('');
  }, [ onOpenChange ]);

  const closePopup = useCallback(() => {
    updateOpen(false);
    triggerRef.current?.focus();
  }, [ updateOpen ]);

  const updateValue = (nextValue, option) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue, option);
  };

  const commitOption = (option) => {
    if (!option || option.disabled || loading || disabled) return;

    if (!multiple) {
      updateValue(option.value, option);
      closePopup();

      return;
    }

    const exists = selectedValues.includes(option.value);

    updateValue(exists ? selectedValues.filter((item) => item !== option.value) : [ ...selectedValues, option.value ], option);
  };

  const moveActive = (step) => {
    setActiveIndex((index) => {
      for (let next = index + step; next >= 0 && next < filteredOptions.length; next += step) {
        if (!filteredOptions[next].disabled) return next;
      }

      return index;
    });
  };

  // Shared by the search field and the listbox; the listbox alone adds Home, End and Space.
  const handleListKeys = (event, { listbox = false } = {}) => {
    const keys = {
      ArrowDown: () => moveActive(1),
      ArrowUp: () => moveActive(-1),
      Enter: () => commitOption(filteredOptions[activeIndex]),
      ...(listbox && {
        ' ': () => commitOption(filteredOptions[activeIndex]),
        End: () => setActiveIndex(filteredOptions.findLastIndex((option) => !option.disabled)),
        Home: () => setActiveIndex(firstEnabled(filteredOptions))
      })
    };

    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  };

  useEffect(() => {
    if (!open) return undefined;

    const closeOutside = (event) => { if (!rootRef.current?.contains(event.target)) updateOpen(false); };

    document.addEventListener('pointerdown', closeOutside);

    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [ open, updateOpen ]);

  useEffect(() => {
    if (!open) return;
    (searchable ? searchRef : listboxRef).current?.focus();
  }, [ open, searchable ]);

  useEffect(() => {
    setActiveIndex(firstEnabled(filteredOptions));
  }, [ filteredOptions ]);

  const triggerLabel = selectedOptions.length ? selectedOptions.map((option) => option.label).join(', ') : placeholder;
  const activeOption = filteredOptions[activeIndex];
  const activeOptionId = open && !loading && activeOption && !activeOption.disabled ? `${id}-option-${activeIndex}` : undefined;
  let status = '';

  if (loading) status = loadingText;
  else if (!filteredOptions.length) status = emptyText;

  return (
    <div
      ref={ rootRef }
      className={ cn('relative w-full min-w-0 max-w-xs', className, classNames.root) }
      onBlur={ (event) => { if (!event.currentTarget.contains(event.relatedTarget)) updateOpen(false); } }
      onKeyDown={ (event) => {
        if (event.key !== 'Escape' || !open) return;
        event.stopPropagation();
        closePopup();
      } }
    >
      {name && multiple ? selectedValues.map((item) => <input key={ item } type='hidden' name={ name } value={ item } disabled={ disabled } />) : null}
      {name && !multiple ? <input type='hidden' name={ name } value={ currentValue } disabled={ disabled } /> : null}

      <button
        ref={ triggerRef }
        id={ triggerId }
        type='button'
        data-slot='select-trigger'
        data-size='default'
        data-placeholder={ selectedOptions.length ? undefined : '' }
        disabled={ disabled }
        aria-expanded={ open }
        aria-controls={ listboxId }
        aria-haspopup='listbox'
        aria-invalid={ invalid || undefined }
        aria-label={ ariaLabel }
        aria-labelledby={ ariaLabelledBy }
        aria-describedby={ ariaDescribedBy }
        className={ cn('ds-part-select-trigger ds-motion-press flex w-full items-center justify-between text-left outline-none disabled:cursor-not-allowed disabled:opacity-50', classNames.trigger) }
        onClick={ () => updateOpen(!open) }
        onKeyDown={ (event) => {
          if (![ 'ArrowDown', 'Enter', ' ' ].includes(event.key)) return;
          event.preventDefault();
          updateOpen(true);
        } }
      >
        <span className={ cn('min-w-0 flex-1 truncate', classNames.value) }>{triggerLabel}</span>
        {multiple && selectedOptions.length ? <Badge variant='primary-light' size='sm'>{selectedOptions.length}</Badge> : null}
        <Icon name='ChevronDown' decorative size='xs' className={ cn('ds-part-select-trigger-icon ds-motion-icon', open && 'rotate-180') } />
      </button>

      {open ? (
        <div
          data-slot='select-content'
          className={ cn('ds-part-select-content ds-motion-popover absolute inset-x-0 top-full z-50 mt-1 min-w-0 overflow-hidden', classNames.content) }
        >
          {searchable ? (
            <div className='flex items-center gap-2 border-b border-ui-border px-2.5 py-1.5 text-ui-muted-foreground'>
              <Icon name='Search' decorative size='xs' />
              <input
                ref={ searchRef }
                id={ `${id}-search` }
                role='combobox'
                aria-label={ searchPlaceholder }
                aria-autocomplete='list'
                aria-expanded={ open }
                aria-controls={ listboxId }
                aria-activedescendant={ activeOptionId }
                value={ query }
                placeholder={ searchPlaceholder }
                className='h-6 w-full min-w-0 bg-transparent text-base text-ui-popover-foreground outline-none placeholder:text-ui-muted-foreground md:text-sm'
                onChange={ (event) => { setQuery(event.target.value); onSearchChange?.(event.target.value); } }
                onKeyDown={ (event) => handleListKeys(event) }
              />
            </div>
          ) : null}

          <div
            ref={ listboxRef }
            id={ listboxId }
            role='listbox'
            aria-label={ listboxLabel }
            aria-multiselectable={ multiple || undefined }
            aria-busy={ loading }
            aria-activedescendant={ searchable ? undefined : activeOptionId }
            className='ds-part-select-group max-h-64 overflow-y-auto outline-none'
            tabIndex={ searchable ? -1 : 0 }
            onKeyDown={ (event) => handleListKeys(event, { listbox: true }) }
          >
            {!loading && filteredOptions.map((option, index) => {
              const selected = selectedValues.includes(option.value);

              return (
                <button
                  key={ option.value }
                  id={ `${id}-option-${index}` }
                  type='button'
                  role='option'
                  tabIndex={ -1 }
                  data-slot='select-item'
                  data-highlighted={ index === activeIndex && !option.disabled ? '' : undefined }
                  aria-selected={ selected }
                  aria-disabled={ option.disabled || undefined }
                  disabled={ option.disabled }
                  className={ cn('ds-part-select-item ds-motion-state flex w-full cursor-pointer items-center text-left pointer-coarse:min-h-11 data-highlighted:bg-ui-accent data-highlighted:text-ui-accent-foreground disabled:cursor-not-allowed disabled:opacity-50', classNames.option) }
                  onMouseEnter={ () => { if (!option.disabled) setActiveIndex(index); } }
                  onClick={ () => commitOption(option) }
                >
                  <span className='min-w-0 break-words'>
                    {option.label}
                    {option.description ? <span className='block text-xs text-ui-muted-foreground'>{option.description}</span> : null}
                  </span>
                  <span className='ds-part-select-item-indicator'>{selected ? <Icon name='Check' decorative size='xs' /> : null}</span>
                </button>
              );
            })}
            {status ? <div role='option' aria-selected={ false } aria-disabled='true' className='px-3 py-4 text-center text-sm text-ui-muted-foreground'>{status}</div> : null}
          </div>
          <span role='status' className='sr-only'>{status}</span>
        </div>
      ) : null}
    </div>
  );
};

export default Select;
