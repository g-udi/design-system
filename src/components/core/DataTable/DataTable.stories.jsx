import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
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

export default {
  title: 'Core/DataTable',
  id: 'core-datatable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    columns: 'object',
    rows: 'object',
    caption: 'text',
    searchable: 'boolean',
    sortable: 'boolean',
    selectable: 'boolean',
    columnVisibility: 'boolean',
    pagination: 'boolean',
    pageSize: 'number',
    loading: 'boolean'
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
    columns,
    rows: articles,
    caption,
    searchable: true,
    sortable: true,
    selectable: true,
    columnVisibility: true,
    pagination: true,
    pageSize: 2,
    loading: false
  },
  parameters: {
    docs: { source: playgroundSource('DataTable', { imports: "import { DataTable } from '@gaudi/design-system';" }) }
  },
  render: (args) => <DataTable {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const region = canvas.getByRole('region', { name: `${caption} scrollable table` });
    await expect(canvas.getByRole('table', { name: caption })).toBeVisible();
    await expect(region).toHaveAttribute('tabindex', '0');
    await expect(region).toHaveAccessibleDescription('Scroll horizontally to see all columns.');
    canvas.getAllByRole('columnheader').forEach((header) => expect(header).toHaveAttribute('scope', 'col'));

    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(canvas.getByRole('table')).toHaveTextContent('Research methods');
    await userEvent.type(canvas.getByRole('searchbox'), 'Knowledge');
    await expect(canvas.getByText(/Page 1 \/ 1/)).toBeVisible();
    await userEvent.clear(canvas.getByRole('searchbox'));

    await userEvent.click(canvas.getByRole('button', { name: 'Words' }));
    await expect(canvas.getByRole('columnheader', { name: 'Words' })).toHaveAttribute('aria-sort', 'descending');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select this page' }));
    await expect(canvas.getByText('2 selected')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
    await userEvent.click(await page.findByRole('menuitemcheckbox', { name: 'Status' }));
    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
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
