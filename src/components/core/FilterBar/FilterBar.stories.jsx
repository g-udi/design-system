import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { articles } from '../../../../.storybook/fixtures/application/data';
import EmptyState from '../EmptyState';
import Select from '../Select';
import FilterBar from './FilterBar';

const docs = getComponentDocs('Core/FilterBar');
const statuses = ['Draft', 'In review', 'Published'].map((value) => ({ value, label: value }));
const source = playgroundSource('FilterBar', {
  imports: "import { FilterBar, Select } from '@gaudi/design-system';",
  attributes: ['query={query}', 'onQueryChange={setQuery}', 'filters={filters}', 'onRemoveFilter={removeFilter}', 'onClearFilters={clearFilters}'],
  children: "  <Select aria-label='Status' value={status} onValueChange={setStatus} options={statuses} />"
});

function Collection(props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Published');
  const results = articles.filter((row) => (!status || row.status === status) && row.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className='ds-stack'>
      <FilterBar
        {...props}
        query={query}
        onQueryChange={setQuery}
        filters={status ? [{ id: 'status', label: status }] : []}
        onRemoveFilter={() => setStatus('')}
        onClearFilters={() => {
          setQuery('');
          setStatus('');
        }}
      >
        <Select aria-label='Status' value={status} onValueChange={setStatus} placeholder='Any status' options={statuses} />
      </FilterBar>
      <p role='status' className='ds-description'>{results.length} articles</p>
      {results.length ? (
        <ul>{results.map((row) => <li key={row.id} className='py-2 ds-label'>{row.title}</li>)}</ul>
      ) : (
        <EmptyState compact title='No matching articles' description='Try changing the search or status filter.' />
      )}
    </div>
  );
}

export default {
  title: 'Core/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { searchLabel: 'text', placeholder: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { searchLabel: 'Search articles', placeholder: 'Search…' },
  parameters: {
    docs: {
      source
    }
  },
  render: (args) => <Collection {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');
    await expect(status).toHaveTextContent('3 articles');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Published filter' }));
    await expect(status).toHaveTextContent('8 articles');
    await userEvent.type(canvas.getByRole('searchbox', { name: args.searchLabel }), 'knowledge');
    await expect(status).toHaveTextContent('1 articles');
    await userEvent.type(canvas.getByRole('searchbox'), ' nothing');
    await expect(canvas.getByText('No matching articles')).toBeVisible();
  }
};
