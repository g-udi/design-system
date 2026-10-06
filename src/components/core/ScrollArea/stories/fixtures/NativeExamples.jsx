import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { Badge } from '@gaudi/design-system/core/Pill';

const kinds = {
  Feature: { icon: 'SparklesIcon', variant: 'primary-light' },
  Fix: { icon: 'WrenchIcon', variant: 'success-light' },
  Breaking: { icon: 'TriangleAlertIcon', variant: 'destructive-light' }
};

const notes = [
  ['Feature', 'Scrollspy follows nested scroll areas'],
  ['Fix', 'Tree keeps focus after collapsing a folder'],
  ['Feature', 'Attachment gains an upload queue'],
  ['Breaking', 'Rating drops the legacy value prop'],
  ['Fix', 'Resizable handles respect RTL'],
  ['Feature', 'Sortable supports pinned items'],
  ['Fix', 'Accordion badges wrap on narrow screens'],
  ['Feature', 'Separator documents semantic rules'],
  ['Breaking', 'Tokens rename surface-2 to surface-muted'],
  ['Fix', 'Scroll area thumbs meet contrast']
];

const releases = notes.map(([kind, title], index) => ({
  version: `v2.${notes.length - index}.0`,
  date: `${String(28 - index * 2).padStart(2, '0')} Sep`,
  kind,
  title
}));

export const exampleDefaults = { type: 'always', smooth: false, 'aria-label': 'Changelog', className: 'mx-auto h-72 w-full max-w-sm rounded-2xl border border-ui-border' };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <ScrollArea {...args}>
      <header className='sticky top-0 z-10 flex items-center justify-between border-b border-ui-border bg-ui-background px-4 py-3'>
        <span className='text-sm font-semibold'>Changelog</span>
        <span className='text-xs text-ui-muted-foreground'>{releases.length} releases</span>
      </header>
      <ol className='divide-y divide-ui-border text-sm'>
        {releases.map(({ version, date, kind, title }) => (
          <li key={version} className='flex gap-3 px-4 py-3'>
            <span className='mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-ui-muted text-ui-muted-foreground'>
              <RegistryIcon lucide={kinds[kind].icon} aria-hidden='true' className='size-3.5' />
            </span>
            <div className='grid min-w-0 flex-1 gap-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium tabular-nums'>{version}</span>
                <Badge variant={kinds[kind].variant} size='sm'>{kind}</Badge>
                <span className='ms-auto text-xs text-ui-muted-foreground'>{date}</span>
              </div>
              <p className='text-ui-muted-foreground'>{title}</p>
            </div>
          </li>
        ))}
      </ol>
    </ScrollArea>;
}
