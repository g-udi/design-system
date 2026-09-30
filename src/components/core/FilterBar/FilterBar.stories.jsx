import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { articles } from '../../../../.storybook/fixtures/application/data';
import Button from '../Button';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import Pill from '../Pill';
import Select from '../Select';
import FilterBar from './FilterBar';

const docs = getComponentDocs('Core/FilterBar');
const options = (values) => values.map((value) => ({ value, label: value }));
const statuses = options(['Draft', 'In review', 'Published']);
const categories = options(['Design', 'Engineering', 'Research']);
const statusTone = { Draft: 'gray', 'In review': 'amber', Published: 'green' };
// The same matching the story renders, so the play test can predict every count.
const matching = ({ query = '', status, category }) => articles.filter((row) =>
  (!status || row.status === status) && (!category || row.category === category) && row.title.toLowerCase().includes(query.toLowerCase()));
const initial = { status: 'Published', category: 'Research' };
const source = playgroundSource('FilterBar', {
  imports: "import { Button, FilterBar, Icon, Select } from '@gaudi/design-system';",
  attributes: [
    'query={query}',
    'onQueryChange={setQuery}',
    'filters={filters}',
    'onRemoveFilter={removeFilter}',
    'onClearFilters={clearFilters}',
    "actions={<Button size='sm'><Icon name='Plus' decorative size='sm' />New article</Button>}"
  ],
  children: [
    "  <Select aria-label='Status' value={status} onValueChange={setStatus} placeholder='Any status' options={statuses} />",
    "  <Select aria-label='Category' value={category} onValueChange={setCategory} placeholder='Any category' options={categories} />"
  ].join('\n')
});

function Collection({ query: initialQuery = '', ...props }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initial.status);
  const [category, setCategory] = useState(initial.category);
  const results = matching({ query, status, category });
  const filters = [status && { id: 'status', label: status }, category && { id: 'category', label: category }].filter(Boolean);
  return (
    <div className='ds-stack'>
      <FilterBar
        {...props}
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onRemoveFilter={(id) => (id === 'status' ? setStatus('') : setCategory(''))}
        onClearFilters={() => {
          setQuery('');
          setStatus('');
          setCategory('');
        }}
        actions={<Button size='sm'><Icon name='Plus' decorative size='sm' />New article</Button>}
      >
        <Select className='w-auto flex-1 basis-28' aria-label='Status' value={status} onValueChange={setStatus} placeholder='Any status' options={statuses} />
        <Select className='w-auto flex-1 basis-28' aria-label='Category' value={category} onValueChange={setCategory} placeholder='Any category' options={categories} />
      </FilterBar>
      <p role='status' className='ds-description'>{results.length} of {articles.length} articles</p>
      {results.length ? (
        <ul className='divide-y divide-border'>
          {results.map((row) => (
            <li key={row.id} className='flex items-center justify-between gap-3 py-2'>
              <div className='min-w-0'>
                <p className='ds-label truncate'>{row.title}</p>
                <p className='ds-description'>{row.author} · {row.category} · {row.updated}</p>
              </div>
              <Pill size='sm' variant='soft' tone={statusTone[row.status]}>{row.status}</Pill>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState compact title='No matching articles' description='Try changing the search or filters.' />
      )}
    </div>
  );
}

export default {
  title: 'Core/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { query: 'text', placeholder: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { query: '', placeholder: 'Search articles…', searchLabel: 'Search articles' },
  argTypes: { searchLabel: { table: { disable: true } } },
  parameters: {
    docs: {
      description: { story: 'An article list filtered by search, status, and category, with applied-filter chips, a primary action, and live results. `query` seeds the search; clearing the chips widens the list.' },
      source
    }
  },
  // Remount when the seeded query changes so the search box and results follow the control.
  render: (args) => <Collection key={args.query} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    const search = canvas.getByRole('searchbox', { name: args.searchLabel });
    const count = (filters) => `${matching({ query: args.query, ...filters }).length} of ${articles.length} articles`;
    await expect(search).toHaveValue(args.query);
    if (!args.query) await expect(search).toHaveAttribute('placeholder', args.placeholder);
    await expect(status).toHaveTextContent(count(initial));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Research filter' }));
    await expect(status).toHaveTextContent(count({ status: 'Published' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(status).toHaveTextContent(`${articles.length} of ${articles.length} articles`);
    await userEvent.type(search, 'knowledge');
    await expect(status).toHaveTextContent(`1 of ${articles.length} articles`);
    await userEvent.type(search, ' nothing');
    await expect(canvas.getByText('No matching articles')).toBeVisible();
    // Restore the seeded filters through the selects so the preview ends in its rich state.
    await userEvent.clear(search);
    if (args.query) await userEvent.type(search, args.query);
    for (const [name, value] of [['Status', initial.status], ['Category', initial.category]]) {
      await userEvent.click(canvas.getByRole('button', { name }));
      await userEvent.click(canvas.getByRole('option', { name: value }));
    }
    await expect(status).toHaveTextContent(count(initial));
    await expect(canvas.getByRole('button', { name: `Remove ${initial.category} filter` })).toBeVisible();
  }
};
