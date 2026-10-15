import { useState } from 'react';
import { articles } from '../../../../../docs/fixtures/application/data.js';
import Button from '@gaudi/design-system/core/Button';
import DataTable from '@gaudi/design-system/core/DataTable';
import Icon from '@gaudi/design-system/core/Icon';
import Pill from '@gaudi/design-system/core/Pill';
import FilterBar from '@gaudi/design-system/core/FilterBar';

const statusTone = { Draft: 'gray', 'In review': 'amber', Published: 'green' };
const countBy = (key, value) => articles.filter((row) => row[key] === value).length;
const optionsFor = (key) => [...new Set(articles.map((row) => row[key]))].sort().map((value) => ({ value, label: value, count: countBy(key, value) }));
const facetFields = [
  { id: 'status', label: 'Status', multiple: true },
  { id: 'category', label: 'Category' },
  { id: 'author', label: 'Author', multiple: true }
];
// The host owns matching: the same predicate the story renders, so the play test can predict every count.
export const matching = ({ query = '', status = [], category = '', author = [] }) =>
  articles.filter(
    (row) =>
      (!status.length || status.includes(row.status)) &&
      (!category || row.category === category) &&
      (!author.length || author.includes(row.author)) &&
      row.title.toLowerCase().includes(query.trim().toLowerCase())
  );
export const initial = { status: ['Published', 'In review'], category: '', author: [] };
const columns = [
  {
    key: 'title',
    header: 'Article',
    render: (row) => (
      <span className='block min-w-0'>
        <span className='block max-w-72 truncate font-medium'>{row.title}</span>
        <span className='block truncate text-xs text-text-muted'>{row.author}</span>
      </span>
    )
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Pill tone={statusTone[row.status]} variant='soft' size='sm' radius='md' icon={<span className='block size-1.5 rounded-full bg-current' />}>
        {row.status}
      </Pill>
    )
  },
  { key: 'category', header: 'Category', render: (row) => <span className='text-text-muted'>{row.category}</span> },
  { key: 'words', header: 'Words', align: 'right', render: (row) => row.words.toLocaleString('en-GB') }
];
export function Collection({ query: seededQuery = '', ...props }) {
  const [query, setQuery] = useState(seededQuery);
  const [state, setState] = useState(initial);
  const visible = matching({ query, ...state });
  const facets = facetFields.map((field) => ({
    ...field,
    options: optionsFor(field.id),
    value: state[field.id],
    onChange: (value) => setState((current) => ({ ...current, [field.id]: value }))
  }));
  return (
    <div className='space-y-3'>
      <FilterBar
        {...props}
        query={query}
        onQueryChange={setQuery}
        count={{ shown: visible.length, total: articles.length }}
        facets={facets}
        onClearFilters={() => setQuery('')}
        actions={
          <Button href='/articles/new' size='sm'>
            <Icon name='Plus' decorative size='sm' />
            New article
          </Button>
        }
      />
      <p role='status' className='text-xs text-text-muted'>
        {visible.length} of {articles.length} articles
      </p>
      <DataTable
        caption='Filtered articles'
        density='compact'
        sortable
        columns={columns}
        rows={visible}
        emptyTitle='No matching articles'
        emptyDescription='Try changing the search or filters.'
      />
    </div>
  );
}
