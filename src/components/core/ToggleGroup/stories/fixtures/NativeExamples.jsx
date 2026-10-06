import { useState } from 'react';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import Avatar from '@gaudi/design-system/core/Avatar';
import Pill from '@gaudi/design-system/core/Pill';

const exportFormats = [
  { value: 'md', label: 'Markdown' },
  { value: 'html', label: 'HTML' },
  { value: 'pdf', label: 'PDF', disabled: true }
];

const articles = [
  { title: 'Interfaces and real data', status: 'review', author: 'Sam Rivera', updated: '12 min ago' },
  { title: 'Designing for empty states', status: 'draft', author: 'Lee Chen', updated: '1 hour ago' },
  { title: 'Knowledge graphs in practice', status: 'published', author: 'Ahmad Assaf', updated: '2 days ago' },
  { title: 'Motion that respects users', status: 'draft', author: 'Sam Rivera', updated: '3 days ago' },
  { title: 'Token pipelines at scale', status: 'published', author: 'Lee Chen', updated: 'Last week' }
];

const statuses = [
  { value: 'draft', label: 'Drafts', badge: 'Draft', tone: 'gray' },
  { value: 'review', label: 'In review', badge: 'In review', tone: 'amber' },
  { value: 'published', label: 'Published', badge: 'Published', tone: 'green' },
  { value: 'archived', label: 'Archived', badge: 'Archived', tone: 'gray', disabled: true }
];

const statusOf = Object.fromEntries(statuses.map((status) => [status.value, status]));

const statusOptions = statuses.map(({ value, label, disabled }) => ({
  value,
  disabled,
  label: <>{label} <span className='ms-1 text-xs font-normal opacity-70'>{articles.filter((article) => article.status === value).length}</span></>
}));

const layouts = [
  { value: 'list', ariaLabel: 'List view', label: <RegistryIcon lucide='List' className='size-4' /> },
  { value: 'grid', ariaLabel: 'Grid view', label: <RegistryIcon lucide='LayoutGrid' className='size-4' /> }
];

const initialStatus = (type) => (type === 'multiple' ? ['draft', 'review'] : 'review');

function ContentLibrary({ type, disabled, size, variant, onValueChange }) {
  const [status, setStatus] = useState(() => initialStatus(type));
  const [layout, setLayout] = useState('list');
  const selected = [].concat(status).filter(Boolean);
  const visible = selected.length ? articles.filter((article) => selected.includes(article.status)) : articles;
  const change = (next) => {
    setStatus(next);
    onValueChange?.(next);
  };
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <ToggleGroup label='Status' type={type} disabled={disabled} size={size} variant={variant} options={statusOptions} value={status} onValueChange={change} />
        <ToggleGroup label='Layout' size={size} variant={variant} options={layouts} value={layout} onValueChange={(next) => next && setLayout(next)} />
      </div>
      <ul data-testid='library' data-layout={layout} className={layout === 'grid' ? 'grid grid-cols-2 gap-2' : 'grid divide-y divide-border rounded-lg border border-border'}>
        {visible.map(({ title, status: value, author, updated }) => (
          <li key={title} className={layout === 'grid' ? 'grid justify-items-start gap-2 rounded-lg border border-border p-3' : 'flex items-center gap-3 px-3 py-2.5'}>
            <Avatar name={author} size='xs' />
            <div className='min-w-0 flex-1 justify-self-stretch'>
              <p className={`text-sm font-medium ${layout === 'grid' ? 'line-clamp-2' : 'truncate'}`}>{title}</p>
              <p className='text-xs text-text-muted'>{author} · {updated}</p>
            </div>
            <Pill size='xs' variant='soft' tone={statusOf[value].tone}>{statusOf[value].badge}</Pill>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const exampleDefaults = { type: 'multiple', variant: 'outline', size: 'default', disabled: false };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <ContentLibrary key={args.type} {...args} />;
}

export const DisabledOptionsDemo = () => <ToggleGroup label='Export format' defaultValue='md' options={exportFormats} />;

export { statusOf, initialStatus };
