'use client';

import { useId, useMemo, useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import Icon from '../Icon';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/parts/popover.jsx';
import { cn } from '../../../utilities/cn';

/*
 * The collection toolbar: a search with a live result count, a Filters trigger
 * whose two-pane popover lists each facet's options with counts, and removable
 * "Field: Value" chips. It only presents state: the host owns matching and persistence.
 */

const selectedValues = (facet) => (facet.multiple ? facet.value || [] : facet.value ? [facet.value] : []);
const removeValue = (facet, value) =>
  facet.onChange(facet.multiple ? (facet.value || []).filter((item) => item !== value) : '');
const clearFacet = (facet) => facet.onChange(facet.multiple ? [] : '');

function FacetOptions({ facet, labels }) {
  const [search, setSearch] = useState('');
  const values = selectedValues(facet);
  const needle = search.trim().toLowerCase();
  const options = facet.options.filter((option) =>
    [option.label, ...(option.keywords || [])].some((text) => String(text).toLowerCase().includes(needle))
  );
  const toggle = (value) => {
    if (!facet.multiple) return facet.onChange(values.includes(value) ? '' : value);
    facet.onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };
  return (
    <div className='ds-facet-pane'>
      <div className='flex min-h-6 items-center justify-between gap-2'>
        <p className='text-xs font-semibold text-text-muted'>{facet.label}</p>
        {values.length > 0 && (
          <button type='button' className='ds-filter-link' onClick={() => clearFacet(facet)}>
            {labels.clear || 'Clear'}
          </button>
        )}
      </div>
      {facet.options.length > 6 && (
        <Input
          type='search'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label={`${labels.find || 'Find'} ${facet.label}`}
          placeholder={`${labels.find || 'Find'} ${facet.label.toLowerCase()}…`}
          prefix={<Icon name='Search' decorative size='sm' />}
        />
      )}
      <div role='group' aria-label={facet.label} className='ds-facet-options'>
        {options.length ? (
          options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type='button'
                role={facet.multiple ? 'checkbox' : 'radio'}
                aria-checked={checked}
                disabled={facet.disabled || option.disabled}
                onClick={() => toggle(option.value)}
                className='ds-facet-option'
              >
                <span className='min-w-0 flex-1 truncate text-start'>{option.label}</span>
                {option.count != null && <span className='ds-table-count'>{option.count}</span>}
                <Icon name='Check' decorative size='sm' className={cn('shrink-0', !checked && 'invisible')} />
              </button>
            );
          })
        ) : (
          <p className='px-2 py-3 text-sm text-text-muted'>{labels.noOptions || 'No matching options'}</p>
        )}
      </div>
    </div>
  );
}

function FacetPopover({ facets, labels, filterLabel, activeCount }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(facets[0]?.id);
  const facet = facets.find((item) => item.id === current) || facets[0];
  const titleId = useId();
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' tone='neutral' size='sm' className='ds-filter-trigger'>
          <Icon name='Funnel' decorative size='sm' />
          {filterLabel}
          {activeCount > 0 && <span className='ds-filter-badge'>{activeCount}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        sideOffset={6}
        collisionPadding={12}
        aria-labelledby={titleId}
        className='ds-facet-popover w-[min(520px,calc(100vw-24px))] gap-0 p-0'
      >
        <h2 id={titleId} className='sr-only'>{filterLabel}</h2>
        <div className={cn('ds-facet-body', facets.length > 1 && 'ds-facet-body-split')}>
          {facets.length > 1 && (
            <div role='tablist' aria-orientation='vertical' aria-label={filterLabel} className='ds-facet-rail'>
              {facets.map((item) => {
                const selected = selectedValues(item).length;
                return (
                  <button
                    key={item.id}
                    type='button'
                    role='tab'
                    aria-selected={item.id === facet.id}
                    onClick={() => setCurrent(item.id)}
                    className='ds-facet-tab'
                  >
                    <span className='min-w-0 flex-1 truncate text-start'>{item.label}</span>
                    {selected > 0 && <span className='ds-filter-badge'>{selected}</span>}
                  </button>
                );
              })}
            </div>
          )}
          {facet && <FacetOptions key={facet.id} facet={facet} labels={labels} />}
        </div>
        <div className='ds-facet-footer'>
          <Button variant='ghost' tone='neutral' size='sm' disabled={!activeCount} onClick={() => facets.forEach(clearFacet)}>
            {labels.clearAll || 'Clear all'}
          </Button>
          <Button variant='outline' tone='neutral' size='sm' onClick={() => setOpen(false)}>
            {labels.done || 'Done'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/** The host supplies facet state and applied filters, and owns matching and persistence. */
export default function FilterBar({
  query,
  onQueryChange,
  searchLabel = 'Search records',
  placeholder = 'Search…',
  count,
  facets = [],
  filterLabel = 'Filters',
  children,
  filters = [],
  onRemoveFilter,
  onClearFilters,
  actions,
  labels = {},
  className
}) {
  const facetChips = useMemo(
    () =>
      facets.flatMap((facet) =>
        selectedValues(facet).map((value) => ({
          id: `${facet.id}:${value}`,
          field: facet.label,
          label: facet.options.find((option) => option.value === value)?.label ?? value,
          remove: () => removeValue(facet, value)
        }))
      ),
    [facets]
  );
  const chips = [...facetChips, ...filters.map((filter) => ({ ...filter, remove: () => onRemoveFilter?.(filter.id) }))];
  const canClear = chips.length > 0 && (facets.length > 0 || onClearFilters);
  return (
    <div className={cn('ds-filter-bar', className)}>
      <div className='ds-filter-controls'>
        {onQueryChange && (
          <Input
            type='search'
            aria-label={searchLabel}
            placeholder={placeholder}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            prefix={<Icon name='Search' decorative size='sm' />}
            suffix={
              count && (
                <span className='ds-table-count' aria-hidden='true'>
                  {count.shown} / {count.total}
                </span>
              )
            }
          />
        )}
        {facets.length > 0 && (
          <FacetPopover facets={facets} labels={labels} filterLabel={filterLabel} activeCount={facetChips.length} />
        )}
        {children}
        {actions && <div className='ds-actions ms-auto'>{actions}</div>}
      </div>
      {chips.length > 0 && (
        <div className='ds-filter-chips' role='group' aria-label={labels.applied || 'Applied filters'}>
          {chips.map((chip) => (
            <span key={chip.id} className='ds-filter-chip'>
              <span className='min-w-0 truncate'>
                {chip.field && <span className='text-text-muted'>{chip.field}: </span>}
                {chip.label}
              </span>
              <button
                type='button'
                onClick={chip.remove}
                aria-label={`${labels.remove || 'Remove'} ${chip.label} filter`}
                className='ds-filter-chip-remove'
              >
                <Icon name='X' decorative size='xs' />
              </button>
            </span>
          ))}
          {canClear && (
            <button
              type='button'
              className='ds-filter-link'
              onClick={() => {
                facets.forEach(clearFacet);
                onClearFilters?.();
              }}
            >
              {labels.clearFilters || 'Clear filters'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
