import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import FilterBar from './FilterBar';
import Select from '../Select';
import EmptyState from '../EmptyState';
import { articles } from '../../../../.storybook/fixtures/application/data';
export default {
  tags: ['autodocs'],
  title: 'Core/FilterBar',
  component: FilterBar,
  ...applicationDocs(
    'Search, supplied filter controls, removable active filters and action slots in a wrapping toolbar. Query matching and URL persistence remain with the application.',
    "<FilterBar query={query} onQueryChange={setQuery} filters={filters} onRemoveFilter={removeFilter} onClearFilters={clearFilters}><Select aria-label='Status' options={statuses} /></FilterBar>",
    'Every search and selector needs an accessible label. Removal controls name the filter they remove; result counts can be announced in the host.'
  )
};
function Collection({ initial = 'Published' }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(initial);
  const results = articles.filter(
    (row) =>
      (!status || row.status === status) &&
      row.title.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ExampleFrame>
      <div className='ds-stack'>
        <FilterBar
          query={query}
          onQueryChange={setQuery}
          filters={status ? [{ id: 'status', label: status }] : []}
          onRemoveFilter={() => setStatus('')}
          onClearFilters={() => {
            setQuery('');
            setStatus('');
          }}
        >
          <Select
            aria-label='Status'
            value={status}
            onValueChange={setStatus}
            placeholder='Any status'
            options={['Draft', 'In review', 'Published'].map((value) => ({
              value,
              label: value
            }))}
          />
        </FilterBar>
        <p role='status' className='ds-description'>
          {results.length} articles
        </p>
        {results.length ? (
          <ul>
            {results.map((row) => (
              <li key={row.id} className='py-2 ds-label'>
                {row.title}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            compact
            title='No matching articles'
            description='Try changing the search or status filter.'
          />
        )}
      </div>
    </ExampleFrame>
  );
}
export const ArticleFilters = {
  render: () => <Collection />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove Published filter' })
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('8 articles');
    await userEvent.type(canvas.getByRole('searchbox'), 'knowledge');
    await expect(canvas.getByRole('status')).toHaveTextContent('1 articles');
  }
};
export const Unfiltered = { render: () => <Collection initial='' /> };
