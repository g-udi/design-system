import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import Avatar from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import Tabs, { TabsContent, TabsList, TabsTrigger } from '@gaudi/design-system/core/Tabs';

const listLabel = 'Article details';
// An article dashboard: icon triggers with counts, a locked tab, and panels with real content.
export const panels = [
  { value: 'overview', label: 'Overview', icon: 'LayoutDashboard', summary: 'A practical guide to knowledge graphs.' },
  { value: 'references', label: 'References', icon: 'BookOpen', count: 3, summary: 'Three references support this article.' },
  { value: 'history', label: 'History', icon: 'History', count: 2, summary: 'The latest revision was saved yesterday.' },
  { value: 'analytics', label: 'Analytics', icon: 'Lock', disabled: true }
];
const stats = [['Views', '12.4k'], ['Read time', '6 min'], ['Reactions', '318']];
const references = [
  { title: 'Knowledge graphs in practice', source: 'acm.org', icon: 'FileText' },
  { title: 'Linked data design issues', source: 'w3.org', icon: 'Globe' },
  { title: 'Graph databases, 2nd edition', source: 'oreilly.com', icon: 'Book' }
];
const revisions = [
  { who: 'Sam Rivera', what: 'Tightened the introduction', when: 'Yesterday' },
  { who: 'Lee Chen', what: 'Added the schema diagram', when: '3 days ago' }
];
const bodies = {
  overview: (
    <div className='grid grid-cols-3 gap-2'>
      {stats.map(([name, value]) => (
        <div key={name} className='rounded-md border border-border px-3 py-2'>
          <p className='text-xs text-text-muted'>{name}</p>
          <p className='text-lg font-semibold'>{value}</p>
        </div>
      ))}
    </div>
  ),
  references: (
    <ul className='grid gap-2'>
      {references.map(({ title, source, icon }) => (
        <li key={title} className='flex items-center gap-2 text-sm'>
          <RegistryIcon lucide={icon} className='size-4 shrink-0 text-text-muted' />
          <span className='min-w-0 flex-1 truncate font-medium'>{title}</span>
          <span className='text-xs text-text-muted'>{source}</span>
        </li>
      ))}
    </ul>
  ),
  history: (
    <ul className='grid gap-3'>
      {revisions.map(({ who, what, when }) => (
        <li key={what} className='flex items-center gap-2 text-sm'>
          <Avatar name={who} size='xs' />
          <span className='min-w-0 flex-1'><span className='font-medium'>{who}</span> <span className='text-text-muted'>{what}</span></span>
          <span className='shrink-0 text-xs text-text-muted'>{when}</span>
        </li>
      ))}
    </ul>
  )
};
export function ArticleTabs({ variant, tone, ...props }) {
  return (
    <Tabs defaultValue='overview' {...props}>
      <TabsList aria-label={listLabel} variant={variant} tone={tone}>
        {panels.map(({ value, label, icon, count, disabled }) => (
          <TabsTrigger key={value} value={value} disabled={disabled} className='gap-1.5'>
            <RegistryIcon lucide={icon} className='size-4' />
            {label}
            {count ? <Badge variant='secondary' size='sm'>{count}</Badge> : null}
          </TabsTrigger>
        ))}
      </TabsList>
      {panels.filter((panel) => panel.summary).map(({ value, summary }) => (
        <TabsContent key={value} value={value} className='grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] content-start gap-3'>
          <p className='text-sm text-text-muted'>{summary}</p>
          {bodies[value]}
        </TabsContent>
      ))}
    </Tabs>
  );
}


export { ArticleTabs as PlaygroundDemo };
