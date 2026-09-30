import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Avatar from '../Avatar';
import Button from '../Button';
import Pill from '../Pill';
import DataTable from './DataTable';

const docs = getComponentDocs('Core/DataTable');
const caption = 'Article library';
const columns = [
  { key: 'title', header: 'Title' },
  { key: 'status', header: 'Status' },
  { key: 'words', header: 'Words' }
];
const articles = [
  { id: '1', title: 'Knowledge graphs', status: 'Published', words: 2480 },
  { id: '2', title: 'Local-first software', status: 'Draft', words: 940 },
  { id: '3', title: 'Design for real data', status: 'In review', words: 1860 },
  { id: '4', title: 'Research methods', status: 'Published', words: 3120 }
];
const titleOnly = columns.slice(0, 1);
// The Playground library: authors, status pills, and numeric columns that sort, filter, and page.
const statusTones = { Published: 'green', Draft: 'gray', 'In review': 'amber', Scheduled: 'blue' };
const library = [
  { id: 'kg', title: 'Knowledge graphs', author: 'Ada Lovelace', status: 'Published', words: 2480, updated: '2024-05-12' },
  { id: 'lf', title: 'Local-first software', author: 'Grace Hopper', status: 'Draft', words: 940, updated: '2024-06-03' },
  { id: 'rd', title: 'Design for real data', author: 'Alan Turing', status: 'In review', words: 1860, updated: '2024-06-18' },
  { id: 'rm', title: 'Research methods', author: 'Katherine Johnson', status: 'Published', words: 3120, updated: '2024-04-27' },
  { id: 'ts', title: 'Tokens in production', author: 'Margaret Hamilton', status: 'Scheduled', words: 1540, updated: '2024-07-01' },
  { id: 'ai', title: 'Accessible interfaces', author: 'Tim Berners-Lee', status: 'Published', words: 2210, updated: '2024-03-09' }
];
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const libraryColumns = [
  {
    key: 'title',
    header: 'Article',
    render: (row) => (
      <span className='flex min-w-0 items-center gap-3'>
        <Avatar name={row.author} size='sm' />
        <span className='min-w-0'>
          <span className='block truncate font-medium text-gray-950 dark:text-gray-100'>{row.title}</span>
          <span className='block truncate text-xs text-gray-600 dark:text-gray-400'>{row.author}</span>
        </span>
      </span>
    )
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Pill tone={statusTones[row.status]} variant='soft' size='sm' radius='full' pulse={row.status === 'In review'}>
        {row.status}
      </Pill>
    )
  },
  { key: 'words', header: 'Words', render: (row) => <span className='tabular-nums'>{row.words.toLocaleString('en-US')}</span> },
  { key: 'updated', header: 'Updated', render: (row) => <time dateTime={row.updated}>{dateFormat.format(new Date(row.updated))}</time> }
];
const archiveLabel = (count) => `Archive ${count}`;

export default {
  title: 'Core/DataTable',
  id: 'core-datatable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    caption: 'text',
    searchable: 'boolean',
    sortable: 'boolean',
    selectable: 'boolean',
    columnVisibility: 'boolean',
    pagination: 'boolean',
    pageSize: 'number',
    loading: 'boolean',
    error: 'text'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: {
    caption,
    searchable: true,
    sortable: true,
    selectable: true,
    columnVisibility: true,
    pagination: true,
    pageSize: 4,
    loading: false,
    error: '',
    onArchive: fn(),
    onRetry: fn()
  },
  parameters: {
    docs: {
      description: {
        story: 'An article library with authors, status pills, and numeric columns. Each feature control adds its tool: search, sortable headers, row selection with a bulk action, column visibility, and pages. `loading` and `error` replace the rows with the request state.'
      },
      source: playgroundSource('DataTable', {
        imports: "import { Button, DataTable } from '@gaudi/design-system';",
        attributes: [
          'columns={columns}',
          'rows={articles}',
          "renderSelectionActions={(rows) => <Button size='sm' variant='outline' tone='danger' onClick={() => archive(rows)}>Archive {rows.length}</Button>}",
          'onRetry={reload}'
        ]
      })
    }
  },
  render: ({ onArchive, error, ...args }) => (
    <DataTable
      {...args}
      error={error || undefined}
      columns={libraryColumns}
      rows={library}
      renderSelectionActions={(rows) => (
        <Button size='sm' variant='outline' tone='danger' onClick={() => onArchive(rows.map((row) => row.id))}>
          {archiveLabel(rows.length)}
        </Button>
      )}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const table = canvas.getByRole('table');
    const rows = () => within(table).getAllByRole('row');
    const region = canvas.getByRole('region', { name: args.caption ? `${args.caption} scrollable table` : 'Scrollable data table' });
    await expect(region).toHaveAttribute('tabindex', '0');
    await expect(region).toHaveAccessibleDescription('Scroll horizontally to see all columns.');
    if (args.caption) await expect(table).toHaveAccessibleName(args.caption);
    canvas.getAllByRole('columnheader').forEach((header) => expect(header).toHaveAttribute('scope', 'col'));

    if (args.loading) {
      await expect(within(table).getByRole('status')).toHaveTextContent('Loading records…');
      return;
    }
    if (args.error) {
      await expect(canvas.getByRole('alert')).toHaveTextContent(args.error);
      await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
      await expect(args.onRetry).toHaveBeenCalledOnce();
      return;
    }

    const visible = Math.min(args.pagination ? args.pageSize : library.length, library.length);
    await expect(rows()).toHaveLength(visible + 1);
    if (args.pagination && args.pageSize < library.length) {
      await expect(canvas.getByText(`Page 1 / ${Math.ceil(library.length / args.pageSize)} · ${library.length} records`)).toBeVisible();
      await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
      await expect(table).toHaveTextContent(library[args.pageSize].title);
      await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    }
    if (args.searchable) {
      await userEvent.type(canvas.getByRole('searchbox'), 'Knowledge');
      await expect(rows()).toHaveLength(2);
      await userEvent.clear(canvas.getByRole('searchbox'));
    }
    if (args.sortable) {
      await userEvent.click(canvas.getByRole('button', { name: 'Words' }));
      await expect(canvas.getByRole('columnheader', { name: 'Words' })).toHaveAttribute('aria-sort', 'descending');
    }
    if (args.selectable) {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Select this page' }));
      await expect(canvas.getByText(`${visible} selected`)).toBeVisible();
      await userEvent.click(canvas.getByRole('button', { name: archiveLabel(visible) }));
      await expect(args.onArchive).toHaveBeenCalledOnce();
    }
    if (args.columnVisibility) {
      await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
      await userEvent.click(await page.findByRole('menuitemcheckbox', { name: 'Status' }));
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
    }
  }
};

export const CustomCells = {
  parameters: {
    docs: {
      description: {
        story: 'A column `render(row)` function customizes the cell content while the cell keeps its table semantics.'
      }
    }
  },
  render: () => (
    <DataTable
      overflowLabel='Article status'
      columns={columns.map((column) =>
        column.key === 'status'
          ? { ...column, render: (row) => <span className='rounded-sm bg-green-50 px-2 py-1 text-xs font-semibold text-green-700'>{row.status}</span> }
          : column
      )}
      rows={articles.slice(0, 2)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Article status' })).toBeVisible();
    const cell = canvas.getByRole('cell', { name: articles[0].status });
    await expect(cell.querySelector('span')).toHaveTextContent(articles[0].status);
  }
};

export const Loading = {
  parameters: { docs: { description: { story: '`loading` marks the table busy, announces progress, and disables the page controls.' } } },
  render: () => <DataTable caption={caption} columns={titleOnly} loading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading records…');
    await expect(canvas.getByRole('table').closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
  }
};

export const EmptyCollection = {
  parameters: { docs: { description: { story: '`emptyTitle` and `emptyDescription` explain an empty collection and what fills it.' } } },
  render: () => (
    <DataTable caption={caption} columns={titleOnly} emptyTitle='No articles yet' emptyDescription='Start a draft to build your collection.' />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No articles yet')).toBeVisible();
  }
};

export const FailedRequest = {
  args: { onRetry: fn() },
  parameters: { docs: { description: { story: '`error` replaces the rows with a recovery message, and `onRetry` adds a host-owned retry action.' } } },
  render: ({ onRetry }) => (
    <DataTable
      caption={caption}
      columns={titleOnly}
      error='Your connection was interrupted. Check your network and try again.'
      onRetry={onRetry}
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Unable to load records')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  }
};
