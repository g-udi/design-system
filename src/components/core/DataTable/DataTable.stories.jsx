import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Avatar from '../Avatar';
import Button from '../Button';
import Icon from '../Icon';
import Pill from '../Pill';
import DataTable from './DataTable';

const docs = getComponentDocs('Core/DataTable');
const caption = 'Article library';
const portrait = (path) => `https://randomuser.me/api/portraits/${path}.jpg`;
const people = {
  maya: { name: 'Maya Chen', src: portrait('women/44'), email: 'maya@gaudi.dev' },
  alex: { name: 'Alex Johnson', src: portrait('men/32'), email: 'alex@gaudi.dev' },
  sam: { name: 'Sam Rivera', src: portrait('men/11'), email: 'sam@gaudi.dev' },
  jo: { name: 'Jo Morgan', src: portrait('women/68'), email: 'jo@gaudi.dev' },
  lina: { name: 'Lina Ahmed', src: portrait('women/12'), email: 'lina@gaudi.dev' },
  jules: { name: 'Jules Martin', src: portrait('men/75'), email: 'jules@gaudi.dev' }
};
const statusTones = { Published: 'green', 'In review': 'amber', Draft: 'gray', Scheduled: 'blue' };
// The library behind most stories: people, statuses, numbers that sort and total, and an excerpt for detail rows.
const library = [
  { id: 'kg', title: 'A practical guide to knowledge graphs', author: people.maya, status: 'Published', category: 'Engineering', words: 2480, reads: 18420, change: 12.4, updated: '2026-09-28', excerpt: 'Model entities and relationships first, then let queries follow the shape of the data.' },
  { id: 'rd', title: 'Designing interfaces that survive real data', author: people.sam, status: 'In review', category: 'Design', words: 1860, reads: 9210, change: 4.1, updated: '2026-09-27', excerpt: 'Long names, empty fields and huge numbers are the normal case, not the edge case.' },
  { id: 'lf', title: 'Notes on local-first software', author: people.alex, status: 'Draft', category: 'Engineering', words: 940, reads: 0, change: 0, updated: '2026-09-26', excerpt: 'Sync is a product decision before it is a protocol decision.' },
  { id: 'rm', title: 'Research methods for small teams', author: people.jo, status: 'Published', category: 'Research', words: 3120, reads: 12050, change: -3.2, updated: '2026-09-22', excerpt: 'Five interviews answer most questions; the sixth usually repeats one of them.' },
  { id: 'tp', title: 'Design tokens in production', author: people.lina, status: 'Scheduled', category: 'Design', words: 1540, reads: 0, change: 0, updated: '2026-10-02', excerpt: 'Name tokens by intent so a theme can change without a rename.' },
  { id: 'ai', title: 'Accessible interfaces by default', author: people.jules, status: 'Published', category: 'Design', words: 2210, reads: 15630, change: 8.7, updated: '2026-09-18', excerpt: 'Keyboard paths and names come first; colour and motion follow.' },
  { id: 'sw', title: 'Why the semantic web still matters', author: people.maya, status: 'Published', category: 'Research', words: 2890, reads: 7340, change: -1.5, updated: '2026-09-12', excerpt: 'Linked data outlived the hype because shared identifiers keep paying off.' },
  { id: 'ev', title: 'Evaluating retrieval pipelines', author: people.sam, status: 'In review', category: 'Engineering', words: 2050, reads: 3120, change: 21.3, updated: '2026-09-08', excerpt: 'Measure recall on questions users ask, not on questions you wish they asked.' }
];
const number = new Intl.NumberFormat('en-GB');
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

function Status({ value, tones = statusTones }) {
  return (
    <Pill tone={tones[value]} variant='soft' size='sm' radius='md' icon={<span className='block size-1.5 rounded-full bg-current' />} className='my-0 mr-0'>
      {value}
    </Pill>
  );
}
function Person({ person, detail }) {
  return (
    <span className='flex min-w-0 items-center gap-2.5'>
      <Avatar name={person.name} src={person.src} size='sm' />
      <span className='min-w-0'>
        <span className='block truncate font-medium'>{person.name}</span>
        {detail && <span className='block truncate text-xs text-text-muted'>{detail}</span>}
      </span>
    </span>
  );
}
function Change({ value }) {
  if (!value) return <span className='text-text-muted'>—</span>;
  return (
    <span className={value > 0 ? 'text-success' : 'text-danger'}>
      {value > 0 ? '+' : '−'}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}
const libraryColumns = [
  {
    key: 'title',
    header: 'Article',
    render: (row) => (
      <span className='block min-w-0'>
        <span className='block max-w-80 truncate font-medium'>{row.title}</span>
        <span className='block truncate text-xs text-text-muted'>{row.author.name}</span>
      </span>
    )
  },
  { key: 'status', header: 'Status', render: (row) => <Status value={row.status} /> },
  { key: 'category', header: 'Category', render: (row) => <span className='text-text-muted'>{row.category}</span> },
  { key: 'words', header: 'Words', align: 'right', render: (row) => number.format(row.words), footer: (rows) => number.format(sum(rows, 'words')) },
  { key: 'reads', header: 'Reads', align: 'right', render: (row) => (row.reads ? number.format(row.reads) : '—'), footer: (rows) => compact.format(sum(rows, 'reads')) },
  { key: 'change', header: '30 days', align: 'right', render: (row) => <Change value={row.change} /> },
  { key: 'updated', header: 'Updated', render: (row) => <time dateTime={row.updated} className='whitespace-nowrap text-text-muted'>{date.format(new Date(row.updated))}</time> }
];
const detail = (row) => (
  <div className='flex max-w-2xl items-start gap-3 py-1'>
    <Avatar name={row.author.name} src={row.author.src} size='md' />
    <div className='min-w-0 space-y-1'>
      <p className='text-sm text-text'>{row.excerpt}</p>
      <p className='text-xs text-text-muted'>{row.author.name} · {number.format(row.words)} words · {row.category}</p>
    </div>
  </div>
);
const archiveLabel = (count) => `Archive ${count}`;
const bodyRows = (canvasElement) => [...canvasElement.querySelector('tbody').rows].filter((row) => row.classList.contains('ds-table-row'));

export default {
  title: 'Core/DataTable',
  id: 'core-datatable',
  component: DataTable,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    searchable: 'boolean',
    sortable: 'boolean',
    selectable: 'boolean',
    columnVisibility: 'boolean',
    pagination: 'boolean',
    pageSize: 'number',
    density: ['compact', 'normal', 'comfortable'],
    striped: 'boolean',
    footer: 'boolean',
    loading: 'boolean',
    refreshing: 'boolean',
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
    pageSize: 5,
    density: 'normal',
    striped: false,
    footer: true,
    loading: false,
    refreshing: false,
    error: '',
    onArchive: fn(),
    onDuplicate: fn(),
    onRetry: fn()
  },
  argTypes: { caption: { table: { disable: true } } },
  parameters: {
    docs: {
      description: {
        story: 'An article library with statuses, right-aligned figures, a totals footer, expandable excerpts and a row menu. A toolbar slot holds an export action. Each control adds or restyles a tool: search with a live count, sortable headers, selection with a bulk action, column visibility, pages, density and stripes. `loading`, `refreshing` and `error` show the request states.'
      },
      source: playgroundSource('DataTable', {
        imports: "import { Button, DataTable, Icon } from '@gaudi/design-system';",
        attributes: [
          'columns={columns}',
          'rows={articles}',
          "toolbar={<Button size='sm' variant='outline' tone='neutral'><Icon name='Download' decorative size='sm' />Export</Button>}",
          'renderExpanded={(row) => <Excerpt article={row} />}',
          "getRowActions={(row) => [{ label: 'Duplicate', icon: 'Copy', onSelect: duplicate }, { label: 'Archive', icon: 'Archive', tone: 'danger', onSelect: archive }]}",
          "renderSelectionActions={(rows) => <Button size='sm' variant='outline' tone='danger' onClick={() => archive(rows)}>Archive {rows.length}</Button>}",
          'onRetry={reload}'
        ]
      })
    }
  },
  render: ({ onArchive, onDuplicate, error, ...args }) => (
    <DataTable
      {...args}
      error={error || undefined}
      columns={libraryColumns}
      rows={library}
      labels={{ searchPlaceholder: 'Search articles…' }}
      toolbar={
        <Button size='sm' variant='outline' tone='neutral'>
          <Icon name='Download' decorative size='sm' />
          Export
        </Button>
      }
      renderExpanded={detail}
      getRowActions={(row) => [
        { label: 'Duplicate', icon: 'Copy', onSelect: () => onDuplicate(row.id) },
        { label: 'Archive', icon: 'Archive', tone: 'danger', onSelect: () => onArchive([row.id]) }
      ]}
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
    const region = canvas.getByRole('region', { name: `${args.caption} scrollable table` });
    await expect(region).toHaveAttribute('tabindex', '0');
    await expect(region).toHaveAccessibleDescription('Scroll horizontally to see all columns.');
    await expect(table).toHaveAccessibleName(args.caption);
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
    if (args.refreshing) await expect(canvas.getByText('Updating…')).toBeVisible();
    if (args.searchable || args.columnVisibility) await expect(canvas.getByRole('button', { name: 'Export' })).toBeVisible();

    const visible = Math.min(args.pagination ? args.pageSize : library.length, library.length);
    await expect(bodyRows(canvasElement)).toHaveLength(visible);
    if (args.footer) await expect(table.tFoot).toHaveTextContent(`${library.length} records`);
    if (args.pagination && args.pageSize < library.length) {
      await expect(canvas.getByText(`Showing 1–${args.pageSize} of ${library.length}`)).toBeVisible();
      await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
      await expect(table).toHaveTextContent(library[args.pageSize].title);
      await userEvent.click(canvas.getByRole('button', { name: 'Previous' }));
    }
    if (args.searchable) {
      const search = canvas.getByRole('searchbox');
      await userEvent.type(search, 'knowledge');
      await expect(bodyRows(canvasElement)).toHaveLength(1);
      await expect(canvas.getByText(`1 / ${library.length}`)).toBeVisible();
      await userEvent.clear(search);
    }
    if (args.sortable) {
      await userEvent.click(canvas.getByRole('button', { name: 'Words' }));
      await expect(canvas.getByRole('columnheader', { name: 'Words' })).toHaveAttribute('aria-sort', 'descending');
      await userEvent.click(canvas.getByRole('button', { name: 'Words' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Words' }));
    }
    const firstId = library[0].id;
    await userEvent.click(canvas.getByRole('button', { name: `Details for ${firstId}` }));
    await expect(canvas.getByText(library[0].excerpt)).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: `Details for ${firstId}` }));
    await userEvent.click(canvas.getByRole('button', { name: `Actions for ${firstId}` }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Duplicate' }));
    await expect(args.onDuplicate).toHaveBeenCalledWith(firstId);
    if (args.selectable) {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Select this page' }));
      await expect(canvas.getByText(`${visible} selected`)).toBeVisible();
      await userEvent.click(canvas.getByRole('button', { name: archiveLabel(visible) }));
      await expect(args.onArchive).toHaveBeenCalledOnce();
      await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    }
    if (args.columnVisibility) {
      await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
      await userEvent.click(await page.findByRole('menuitemcheckbox', { name: 'Category' }));
      await userEvent.keyboard('{Escape}');
      await expect(canvas.queryByRole('columnheader', { name: 'Category' })).not.toBeInTheDocument();
      await userEvent.click(canvas.getByRole('button', { name: 'Columns' }));
      await userEvent.click(await page.findByRole('menuitemcheckbox', { name: 'Category' }));
      await userEvent.keyboard('{Escape}');
    }
  }
};

const members = [
  { id: 'maya', person: people.maya, role: 'Owner', status: 'Active', lastActive: 'Now' },
  { id: 'alex', person: people.alex, role: 'Admin', status: 'Active', lastActive: '12 min ago' },
  { id: 'sam', person: people.sam, role: 'Editor', status: 'Away', lastActive: '3 h ago' },
  { id: 'jo', person: people.jo, role: 'Editor', status: 'Invited', lastActive: '—' },
  { id: 'lina', person: people.lina, role: 'Viewer', status: 'Active', lastActive: 'Yesterday' }
];
const memberTones = { Active: 'green', Away: 'amber', Invited: 'blue' };
const memberColumns = [
  { key: 'person', header: 'Member', accessor: (row) => row.person.name, render: (row) => <Person person={row.person} detail={row.person.email} /> },
  { key: 'role', header: 'Role', render: (row) => <Pill tone='gray' variant='soft' size='sm' radius='md' className='my-0 mr-0'>{row.role}</Pill> },
  { key: 'status', header: 'Status', render: (row) => <Status value={row.status} tones={memberTones} /> },
  { key: 'lastActive', header: 'Last active', render: (row) => <span className='text-text-muted'>{row.lastActive}</span> }
];

function Members({ onOpen }) {
  const [message, setMessage] = useState('');
  return (
    <div className='space-y-2'>
      <DataTable
        caption='Team members'
        columns={memberColumns}
        rows={members}
        onRowClick={(row) => {
          setMessage(`Opened ${row.person.name}`);
          onOpen(row.id);
        }}
        getRowActions={(row) => [
          row.status === 'Invited'
            ? { label: 'Resend invitation', icon: 'Send', onSelect: () => setMessage(`Invitation resent to ${row.person.name}`) }
            : { label: 'Change role', icon: 'Pencil', onSelect: () => setMessage(`Change role for ${row.person.name}`) },
          { label: 'Remove from team', icon: 'Trash2', tone: 'danger', disabled: row.role === 'Owner' }
        ]}
      />
      <p role='status' className='min-h-5 text-xs text-text-muted'>{message}</p>
    </div>
  );
}

export const RowInteractions = {
  args: { onOpen: fn() },
  parameters: { docs: { description: { story: '`onRowClick` makes each row focusable and opens it with a click, Enter or Space; clicks on inner controls do not trigger it. `getRowActions` adds a per-row menu whose items can differ by row or be disabled.' } } },
  render: ({ onOpen }) => <Members onOpen={onOpen} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const [owner, , , invited] = bodyRows(canvasElement);
    await userEvent.click(within(owner).getByText('Maya Chen'));
    await expect(args.onOpen).toHaveBeenCalledWith('maya');
    invited.focus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onOpen).toHaveBeenLastCalledWith('jo');
    await userEvent.click(within(invited).getByRole('button', { name: 'Actions for jo' }));
    await userEvent.click(await page.findByRole('menuitem', { name: 'Resend invitation' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Invitation resent to Jo Morgan');
    await expect(args.onOpen).toHaveBeenCalledTimes(2);
    await userEvent.click(within(owner).getByRole('button', { name: 'Actions for maya' }));
    await expect(await page.findByRole('menuitem', { name: 'Remove from team' })).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Escape}');
  }
};

export const GroupedRows = {
  parameters: { docs: { description: { story: '`groupBy(row)` returns `{ key, label }` and inserts collapsible bands with counts; the footer still totals every visible row.' } } },
  render: () => (
    <DataTable
      caption='Articles by category'
      density='compact'
      footer
      sortable
      columns={libraryColumns.filter((column) => column.key !== 'category')}
      rows={library}
      groupBy={(row) => ({ key: row.category, label: row.category })}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('button', { name: /^Design/ });
    await expect(group).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(group);
    await expect(canvas.queryByText('Design tokens in production')).not.toBeInTheDocument();
    await userEvent.click(group);
    await expect(canvas.getByText('Design tokens in production')).toBeVisible();
  }
};

const channels = ['Search', 'Newsletter', 'Social', 'Referral', 'Direct', 'Podcast'];
const traffic = library.slice(0, 6).map((row, index) => {
  const reads = Object.fromEntries(channels.map((channel, column) => [channel, (((index + 3) * (column + 5) * 97) % 4200) + 180]));
  return { id: row.id, title: row.title, ...reads, total: channels.reduce((total, channel) => total + reads[channel], 0) };
});
const trafficColumns = [
  { key: 'title', header: 'Article', sticky: 'left', render: (row) => <span className='block w-56 truncate font-medium'>{row.title}</span> },
  ...channels.map((channel) => ({ key: channel, header: channel, align: 'right', render: (row) => number.format(row[channel]), footer: (rows) => number.format(sum(rows, channel)) })),
  { key: 'total', header: 'Total', align: 'right', sticky: 'right', render: (row) => <span className='font-semibold'>{number.format(row.total)}</span>, footer: (rows) => number.format(sum(rows, 'total')) }
];

export const PinnedColumns = {
  parameters: {
    docs: { description: { story: '`sticky: left` and `sticky: right` pin the identifying and summary columns while the channels scroll. Chevrons at the edges fade in where more columns wait, and the region pans with the arrow keys. Pinning releases when pinned columns would cover most of a narrow viewport.' } },
    visualAudit: { wide: 'A wide analytics table scrolls horizontally inside its frame by design.' }
  },
  render: () => (
    <div className='max-w-3xl'>
      <DataTable caption='Reads by channel' footer sortable density='compact' columns={trafficColumns} rows={traffic} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Reads by channel scrollable table' });
    await waitFor(() => expect(region.querySelector('th[style*="sticky"]')).not.toBeNull());
    region.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(region.scrollLeft).toBeGreaterThan(0));
  }
};

export const RequestStates = {
  args: { onRetry: fn() },
  parameters: {
    docs: {
      description: {
        story: 'The three request states side by side. `loading` keeps the header and fills the body with skeleton rows while announcing progress; `emptyTitle` and `emptyDescription` explain an empty collection; `error` replaces the rows with a recovery message and `onRetry` adds a host-owned retry.'
      }
    }
  },
  render: ({ onRetry }) => (
    <div className='grid gap-4'>
      <DataTable caption='Loading articles' columns={libraryColumns.slice(0, 4)} selectable loading />
      <DataTable caption='Empty library' columns={libraryColumns.slice(0, 4)} emptyTitle='No articles yet' emptyDescription='Start a draft to build your collection.' />
      <DataTable
        caption='Failed request'
        columns={libraryColumns.slice(0, 4)}
        error='Your connection was interrupted. Check your network and try again.'
        onRetry={onRetry}
      />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [loading] = canvas.getAllByRole('table');
    await expect(within(loading).getByRole('status')).toHaveTextContent('Loading records…');
    await expect(loading.closest('[aria-busy]')).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('checkbox', { name: 'Select this page' })).toBeDisabled();
    await expect(canvas.getByText('No articles yet')).toBeVisible();
    await expect(canvas.getByText('Unable to load records')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(args.onRetry).toHaveBeenCalledOnce();
  }
};
