import { useState } from 'react';
import Button from '@gaudi/design-system/core/Button';
import Icon from '@gaudi/design-system/core/Icon';
import Input from '@gaudi/design-system/core/Input';
import Pill from '@gaudi/design-system/core/Pill';
import EmptyState from '@gaudi/design-system/core/EmptyState';

export function EmptySearchExample({ title = 'No matching articles', description = 'Nothing matches “quantum annealing” with these filters. Try a broader search, or remove a filter.', compact = false, onClearFilters }) {
  const [query, setQuery] = useState('quantum annealing');
  const [filters, setFilters] = useState(['Topic: Physics', 'Year: 2024']);
  return (
    <section aria-label='Article search' className='overflow-hidden rounded-lg border border-border'>
      <div className='grid gap-2 border-b border-border p-3'>
        <Input type='search' aria-label='Search articles' value={query} onChange={(event) => setQuery(event.target.value)} />
        <div className='flex flex-wrap items-center gap-1'>
          {filters.map((filter) => <Pill key={filter} tone='gray' variant='soft' size='sm' radius='full'>{filter}</Pill>)}
          <span className='ml-auto text-xs text-text-muted'>0 results</span>
        </div>
      </div>
      <EmptyState
        title={title}
        description={filters.length ? description : 'Filters cleared. Try another search or browse all articles.'}
        compact={compact}
        icon={<Icon name='Search' decorative size='sm' />}
        actions={(
          <>
            <Button disabled={!filters.length} onClick={() => { setFilters([]); onClearFilters?.(); }}>Clear filters</Button>
            <Button variant='outline' tone='neutral' href='/articles'>Browse all articles</Button>
          </>
        )}
      />
    </section>
  );
}
