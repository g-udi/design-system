import { useState } from 'react';
import Avatar from '@gaudi/design-system/core/Avatar';
import Button from '@gaudi/design-system/core/Button';
import Pill from '@gaudi/design-system/core/Pill';
import DataTable from '@gaudi/design-system/core/DataTable';

const portrait = (path) => `/avatars/${path}.svg`;
export const people = {
  maya: { name: 'Mei Castellanos', src: portrait('person-20'), email: 'mei@gaudi.dev' },
  alex: { name: 'Anouk Varga', src: portrait('person-41'), email: 'anouk@gaudi.dev' },
  sam: { name: 'Sam Rivera', src: portrait('person-31'), email: 'sam@gaudi.dev' },
  jo: { name: 'Jo Morgan', src: portrait('person-24'), email: 'jo@gaudi.dev' },
  lina: { name: 'Lina Ahmed', src: portrait('person-07'), email: 'lina@gaudi.dev' },
  jules: { name: 'Jules Martin', src: portrait('person-50'), email: 'jules@gaudi.dev' }
};
const statusTones = { Published: 'green', 'In review': 'amber', Draft: 'gray', Scheduled: 'blue' };
// The library behind most stories: people, statuses, numbers that sort and total, and an excerpt for detail rows.
export const library = [
  { id: 'kg', title: 'A practical guide to knowledge graphs', author: people.maya, status: 'Published', category: 'Engineering', words: 2480, reads: 18420, change: 12.4, updated: '2026-09-28', excerpt: 'Model entities and relationships first, then let queries follow the shape of the data.' },
  { id: 'rd', title: 'Designing interfaces that survive real data', author: people.sam, status: 'In review', category: 'Design', words: 1860, reads: 9210, change: 4.1, updated: '2026-09-27', excerpt: 'Long names, empty fields and huge numbers are the normal case, not the edge case.' },
  { id: 'lf', title: 'Notes on local-first software', author: people.alex, status: 'Draft', category: 'Engineering', words: 940, reads: 0, change: 0, updated: '2026-09-26', excerpt: 'Sync is a product decision before it is a protocol decision.' },
  { id: 'rm', title: 'Research methods for small teams', author: people.jo, status: 'Published', category: 'Research', words: 3120, reads: 12050, change: -3.2, updated: '2026-09-22', excerpt: 'Five interviews answer most questions; the sixth usually repeats one of them.' },
  { id: 'tp', title: 'Design tokens in production', author: people.lina, status: 'Scheduled', category: 'Design', words: 1540, reads: 0, change: 0, updated: '2026-10-02', excerpt: 'Name tokens by intent so a theme can change without a rename.' },
  { id: 'ai', title: 'Accessible interfaces by default', author: people.jules, status: 'Published', category: 'Design', words: 2210, reads: 15630, change: 8.7, updated: '2026-09-18', excerpt: 'Keyboard paths and names come first; colour and motion follow.' },
  { id: 'sw', title: 'Why the semantic web still matters', author: people.maya, status: 'Published', category: 'Research', words: 2890, reads: 7340, change: -1.5, updated: '2026-09-12', excerpt: 'Linked data outlived the hype because shared identifiers keep paying off.' },
  { id: 'ev', title: 'Evaluating retrieval pipelines', author: people.sam, status: 'In review', category: 'Engineering', words: 2050, reads: 3120, change: 21.3, updated: '2026-09-08', excerpt: 'Measure recall on questions users ask, not on questions you wish they asked.' }
];
export const number = new Intl.NumberFormat('en-GB');
const compact = new Intl.NumberFormat('en-GB', { notation: 'compact', maximumFractionDigits: 1 });
const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const sum = (rows, key) => rows.reduce((total, row) => total + row[key], 0);

export function Status({ value, tones = statusTones }) {
  return (
    <Pill tone={tones[value]} variant='soft' size='sm' radius='md' icon={<span className='block size-1.5 rounded-full bg-current' />} className='my-0 mr-0'>
      {value}
    </Pill>
  );
}
export function Person({ person, detail }) {
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
export const libraryColumns = [
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
export const archiveLabel = (count) => `Archive ${count}`;

export function ArticleLibrary({ onArchive, onDuplicate, onRetry, error, maxHeight, ...args }) {
  const [message, setMessage] = useState('');
  const archive = (ids) => {
    setMessage(`Archive requested for ${ids.length} ${ids.length === 1 ? 'article' : 'articles'}.`);
    onArchive?.(ids);
  };
  const duplicate = (id) => {
    setMessage('Duplicate requested.');
    onDuplicate?.(id);
  };
  return (
    <div className='grid gap-2'>
      <DataTable
        {...args}
        maxHeight={maxHeight === 'none' ? undefined : maxHeight}
        exportable={args.exportable && { filename: 'article-library.csv' }}
        error={error || undefined}
        onRetry={() => { setMessage('Retry requested.'); onRetry?.(); }}
        columns={libraryColumns}
        rows={library}
        labels={{ searchPlaceholder: 'Search articles…' }}
        renderExpanded={detail}
        getRowActions={(row) => [
          { label: 'Duplicate', icon: 'Copy', onSelect: () => duplicate(row.id) },
          { label: 'Archive', icon: 'Archive', tone: 'danger', onSelect: () => archive([row.id]) }
        ]}
        renderSelectionActions={(rows) => (
          <Button size='sm' variant='outline' tone='danger' onClick={() => archive(rows.map((row) => row.id))}>
            {archiveLabel(rows.length)}
          </Button>
        )}
      />
      {message && <p role='status' className='text-xs text-text-muted'>{message}</p>}
    </div>
  );
}
