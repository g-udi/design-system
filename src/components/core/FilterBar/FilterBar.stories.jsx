import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { articles } from '../../../../.storybook/fixtures/application/data';
import Button from '../Button';
import DataTable from '../DataTable';
import Icon from '../Icon';
import Pill from '../Pill';
import FilterBar from './FilterBar';

const docs = getComponentDocs('Core/FilterBar');
const statusTone = { Draft: 'gray', 'In review': 'amber', Published: 'green' };
const countBy = (key, value) => articles.filter((row) => row[key] === value).length;
const optionsFor = (key) => [...new Set(articles.map((row) => row[key]))].sort().map((value) => ({ value, label: value, count: countBy(key, value) }));
const facetFields = [
  { id: 'status', label: 'Status', multiple: true },
  { id: 'category', label: 'Category' },
  { id: 'author', label: 'Author', multiple: true }
];
// The host owns matching: the same predicate the story renders, so the play test can predict every count.
const matching = ({ query = '', status = [], category = '', author = [] }) =>
  articles.filter(
    (row) =>
      (!status.length || status.includes(row.status)) &&
      (!category || row.category === category) &&
      (!author.length || author.includes(row.author)) &&
      row.title.toLowerCase().includes(query.trim().toLowerCase())
  );
const initial = { status: ['Published', 'In review'], category: '', author: [] };
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
      <Pill tone={statusTone[row.status]} variant='soft' size='sm' radius='md' icon={<span className='block size-1.5 rounded-full bg-current' />} className='my-0 mr-0'>
        {row.status}
      </Pill>
    )
  },
  { key: 'category', header: 'Category', render: (row) => <span className='text-text-muted'>{row.category}</span> },
  { key: 'words', header: 'Words', align: 'right', render: (row) => row.words.toLocaleString('en-GB') }
];
const source = playgroundSource('FilterBar', {
  imports: "import { Button, DataTable, FilterBar, Icon } from '@gaudi/design-system';",
  before: 'const visible = articles.filter((row) => matches(row, { query, status, category, author }));\n\n',
  attributes: [
    'query={query}',
    'onQueryChange={setQuery}',
    'count={{ shown: visible.length, total: articles.length }}',
    "facets={[{ id: 'status', label: 'Status', multiple: true, options: statuses, value: status, onChange: setStatus }, { id: 'category', label: 'Category', options: categories, value: category, onChange: setCategory }]}",
    "onClearFilters={() => setQuery('')}",
    "actions={<Button size='sm'><Icon name='Plus' decorative size='sm' />New article</Button>}"
  ],
  after: "\n<DataTable caption='Articles' columns={columns} rows={visible} />"
});

function Collection({ query: seededQuery = '', ...props }) {
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
          <Button size='sm'>
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

export default {
  title: 'Core/Data Display/FilterBar', id: 'core-filterbar',
  component: FilterBar,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { query: 'text', placeholder: 'text', filterLabel: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { query: '', placeholder: 'Search articles…', filterLabel: 'Filters', searchLabel: 'Search articles' },
  argTypes: { searchLabel: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        story: 'An article register. The search shows a live count; Filters opens status, category and author facets with counts; every selected value becomes a removable chip. The host filters the rows with its own predicate and hands the visible ones to DataTable.'
      },
      source
    }
  },
  // Remount when the seeded query changes so the search box and results follow the control.
  render: (args) => <Collection key={args.query} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const status = canvas.getByText(/of \d+ articles$/);
    const search = canvas.getByRole('searchbox', { name: args.searchLabel });
    const trigger = () => canvas.getByRole('button', { name: new RegExp(`^${args.filterLabel}`) });
    const count = (filters) => `${matching({ query: args.query, ...initial, ...filters }).length} of ${articles.length} articles`;
    await expect(search).toHaveValue(args.query);
    if (!args.query) await expect(search).toHaveAttribute('placeholder', args.placeholder);
    await expect(status).toHaveTextContent(count({}));
    await expect(trigger()).toHaveTextContent('2');

    // Pick a category in the facet popover; the chip and the count follow.
    await userEvent.click(trigger());
    await userEvent.click(await page.findByRole('tab', { name: 'Category' }));
    await userEvent.click(page.getByRole('radio', { name: /^Research/ }));
    await userEvent.click(page.getByRole('button', { name: 'Done' }));
    await expect(status).toHaveTextContent(count({ category: 'Research' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Research filter' }));
    await expect(status).toHaveTextContent(count({}));

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(status).toHaveTextContent(`${articles.length} of ${articles.length} articles`);
    await userEvent.type(search, 'knowledge');
    await expect(status).toHaveTextContent(`1 of ${articles.length} articles`);
    await userEvent.type(search, ' nothing');
    await expect(canvas.getByText('No matching articles')).toBeVisible();

    // Restore the seeded state so the preview ends rich.
    await userEvent.clear(search);
    if (args.query) await userEvent.type(search, args.query);
    await userEvent.click(trigger());
    await userEvent.click(await page.findByRole('tab', { name: 'Status' }));
    for (const value of initial.status) await userEvent.click(page.getByRole('checkbox', { name: new RegExp(`^${value}`) }));
    await userEvent.click(page.getByRole('button', { name: 'Done' }));
    await expect(status).toHaveTextContent(count({}));
  }
};

export const AppliedFilters = {
  parameters: { docs: { description: { story: 'Without facets, `filters` lists host-applied filters as chips; `onRemoveFilter` and `onClearFilters` remove one or all.' } } },
  render: function Render() {
    const [filters, setFilters] = useState([
      { id: 'published', field: 'Status', label: 'Published' },
      { id: 'research', field: 'Category', label: 'Research' }
    ]);
    return (
      <FilterBar
        filters={filters}
        onRemoveFilter={(id) => setFilters((current) => current.filter((filter) => filter.id !== id))}
        onClearFilters={() => setFilters([])}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Research filter' }));
    await expect(canvas.queryByText('Research')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.queryByRole('group', { name: 'Applied filters' })).not.toBeInTheDocument();
  }
};

const libraryFacets = [
  {
    id: 'collection',
    label: 'Collection',
    multiple: true,
    options: [
      { value: 'reading', label: 'Reading list', count: 42 },
      { value: 'research', label: 'Research notes on knowledge graphs and semantic search for personal libraries', count: 18 },
      { value: 'recipes', label: 'Recipes', count: 7 }
    ]
  },
  {
    id: 'tag',
    label: 'Tag',
    multiple: true,
    options: [
      'Accessibility', 'Architecture decision records and long-form engineering write-ups', 'Design systems', 'Editorial',
      'Interaction design', 'Knowledge management', 'Typography', 'Writing'
    ].map((label, index) => ({ value: label.toLowerCase(), label, count: 30 - index * 3 }))
  },
  { id: 'type', label: 'Type', options: ['Article', 'Video', 'Note', 'Image', 'Document'].map((label) => ({ value: label, label })) },
  { id: 'source', label: 'Source', options: ['Saved by hand', 'Imported from a browser export', 'Suggested'].map((label) => ({ value: label, label })) },
  { id: 'state', label: 'Reading state', options: ['Unread', 'In progress', 'Finished'].map((label) => ({ value: label, label })) },
  { id: 'year', label: 'Year saved', options: ['2026', '2025', '2024', 'Earlier'].map((label) => ({ value: label, label })) }
];

export const LongOptionsAndPhones = {
  parameters: {
    docs: {
      description: {
        story:
          'A library with six facets and long option labels. The option column keeps the popover width and truncates long labels, with the full label in the tooltip. Below the small breakpoint the facet rail becomes a one-line facet select above a scrollable option list, so phones still show a full page of options.'
      },
      source: {
        code: "import { FilterBar } from '@gaudi/design-system';\n\n<FilterBar\n  query={query}\n  onQueryChange={setQuery}\n  facets={facets}\n  labels={{ facet: 'Filter by' }}\n/>"
      }
    }
  },
  render: function Render() {
    const [query, setQuery] = useState('');
    const [state, setState] = useState({ collection: [], tag: ['design systems'], type: '', source: '', state: '', year: '' });
    const facets = libraryFacets.map((facet) => ({
      ...facet,
      value: state[facet.id],
      onChange: (value) => setState((current) => ({ ...current, [facet.id]: value }))
    }));
    return <FilterBar query={query} onQueryChange={setQuery} searchLabel='Search library' facets={facets} labels={{ facet: 'Filter by' }} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: /^Filters/ }));
    // Collection is the first facet, so it is open on every viewport (rail on desktop, facet select on phones).
    const long = await page.findByRole('checkbox', { name: /^Research notes/ });
    const pane = long.closest('.ds-facet-pane');
    // The long label truncates inside the pane rather than widening it, and keeps its full text as a tooltip.
    await expect(long.scrollWidth).toBeLessThanOrEqual(pane.clientWidth);
    await expect(long.querySelector('[title]')).toHaveAttribute('title', libraryFacets[0].options[1].label);
    await userEvent.click(long);
    await expect(long).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(page.getByRole('button', { name: 'Done' }));
    await expect(canvas.getByRole('button', { name: /^Remove Research notes/ })).toBeVisible();
  }
};
