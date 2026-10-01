'use client';

import { useId, useMemo, useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import Icon from '../Icon';
import { Badge } from '../Pill/parts/badge-extended.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/parts/popover.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs';
import { NativeSelect, NativeSelectOption } from '../Select/parts/native-select.jsx';
import { cn } from '../../../utilities/cn';

/*
 * The collection toolbar: a search with a live result count, a Filters trigger
 * whose two-pane popover lists each facet's options with counts, and removable
 * "Field: Value" chips. It only presents state: the host owns matching and persistence.
 */

const selectedValues = (facet) => (facet.multiple ? facet.value || [] : facet.value ? [facet.value] : []);
const removeValue = (facet, value) =>
  facet.onChange(facet.multiple ? (facet.value || []).filter((item) => item !== value) : '');
// Phones get a taller body: the facet picker is a one-line select, so the options keep the room.
const bodyHeight = 'h-[min(340px,calc(100dvh-160px))] max-sm:h-[min(440px,calc(100dvh-200px))]';
// A single minmax(0,1fr) track lets long option labels truncate instead of widening the pane.
const paneTrack = 'grid min-h-0 min-w-0 grid-cols-[minmax(0,1fr)]';
const clearFacet = (facet) => facet.onChange(facet.multiple ? [] : '');

const CountBadge = ({ children }) => (
  <Badge variant='secondary' size='sm' radius='full' className='tabular-nums'>{children}</Badge>
);

const ClearButton = ({ children, onClick }) => (
  <Button variant='ghost' tone='neutral' size='xs' className='text-text-muted' onClick={onClick}>{children}</Button>
);

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
        {values.length > 0 && <ClearButton onClick={() => clearFacet(facet)}>{labels.clear || 'Clear'}</ClearButton>}
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
                <span className='min-w-0 flex-1 truncate text-start' title={String(option.label)}>{option.label}</span>
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
          {activeCount > 0 && <CountBadge>{activeCount}</CountBadge>}
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
        {facets.length > 1 ? (
          // The facet rail is the DS vertical Tabs, so arrow keys move between facets. On phones the rail
          // collapses to a one-line facet select so the option list keeps the height.
          <Tabs orientation='vertical' value={facet.id} onValueChange={setCurrent} className={cn(bodyHeight, 'gap-0 max-sm:flex-col')}>
            <div className='ds-facet-picker sm:hidden'>
              <NativeSelect
                aria-label={labels.facet || filterLabel}
                value={facet.id}
                onChange={(event) => setCurrent(event.target.value)}
                className='w-full'
              >
                {facets.map((item) => {
                  const selected = selectedValues(item).length;
                  return (
                    <NativeSelectOption key={item.id} value={item.id}>
                      {selected > 0 ? `${item.label} (${selected})` : item.label}
                    </NativeSelectOption>
                  );
                })}
              </NativeSelect>
            </div>
            <TabsList
              aria-label={filterLabel}
              className='w-38 shrink-0 overflow-y-auto group-data-[orientation=vertical]/tabs:h-auto border-e border-border bg-surface-muted p-2 max-sm:hidden'
            >
              {facets.map((item) => {
                const selected = selectedValues(item).length;
                return (
                  <TabsTrigger key={item.id} value={item.id} className='gap-2 px-2'>
                    <span className='min-w-0 flex-1 truncate text-start'>{item.label}</span>
                    {selected > 0 && <CountBadge>{selected}</CountBadge>}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {facets.map((item) => (
              <TabsContent key={item.id} value={item.id} className={cn(paneTrack, 'flex-1')}>
                <FacetOptions facet={item} labels={labels} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          facet && <div className={cn(bodyHeight, paneTrack)}><FacetOptions facet={facet} labels={labels} /></div>
        )}
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
            <Badge key={chip.id} variant='outline' className='h-7 max-w-full gap-0.5 ps-2 pe-0.5 font-normal text-text'>
              <span className='min-w-0 truncate'>
                {chip.field && <span className='text-text-muted'>{chip.field}: </span>}
                {chip.label}
              </span>
              <Button
                variant='ghost'
                tone='neutral'
                size='icon-xs'
                onClick={chip.remove}
                aria-label={`${labels.remove || 'Remove'} ${chip.label} filter`}
                className='text-text-muted hover:text-danger'
              >
                <Icon name='X' decorative size='xs' />
              </Button>
            </Badge>
          ))}
          {canClear && (
            <ClearButton
              onClick={() => {
                facets.forEach(clearFacet);
                onClearFilters?.();
              }}
            >
              {labels.clearFilters || 'Clear filters'}
            </ClearButton>
          )}
        </div>
      )}
    </div>
  );
}
