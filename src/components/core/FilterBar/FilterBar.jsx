'use client';

import Input from '../Input';
import Button from '../Button';
import Icon from '../Icon';
import { cn } from '../../../utilities/cn';

/** The host supplies applied filters and owns query persistence and matching. */
export default function FilterBar({
  query,
  onQueryChange,
  searchLabel = 'Search records',
  placeholder = 'Search…',
  children,
  filters = [],
  onRemoveFilter,
  onClearFilters,
  actions,
  className
}) {
  return (
    <div className={cn('ds-filter-bar', className)}>
      <div className='ds-filter-controls'>
        {onQueryChange && (
          <Input
            type='search'
            aria-label={searchLabel}
            placeholder={placeholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            prefix={<Icon name='Search' decorative size='sm' />}
          />
        )}
        {children}
        {actions && <div className='ds-actions'>{actions}</div>}
      </div>
      {filters.length > 0 && (
        <div className='ds-filter-chips' aria-label='Applied filters'>
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant='soft'
              tone='neutral'
              size='xs'
              onClick={() => onRemoveFilter?.(filter.id)}
              aria-label={`Remove ${filter.label} filter`}
            >
              {filter.label}
              <Icon name='X' decorative size='xs' />
            </Button>
          ))}
          {onClearFilters && (
            <Button variant='ghost' size='xs' onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
