import Button from '../../../../../components/core/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../../../../components/core/Accordion/index.js';
import { Readout } from '../../fixtures/HookReadouts.jsx';
import { useCollapsibleSections } from '../../../../../hooks/layout/use-collapsible-sections.js';

const settings = [
  [ 'profile', 'Profile', 'Name, photo and the short bio shown under your posts.' ],
  [ 'notifications', 'Notifications', 'Email digests, comment replies and mentions.' ],
  [ 'privacy', 'Privacy', 'Who can see your reading list and comment on your posts.' ]
];

const ids = settings.map(([ id ]) => id);

function SettingsSections() {
  const sections = useCollapsibleSections({ sections: ids, initialExpanded: [ 'profile' ] });
  return (
    <div className='grid gap-3'>
      <div className='flex flex-wrap items-center gap-2'>
        <Button size='sm' variant='outline' tone='neutral' disabled={sections.allExpanded} onClick={sections.expandAll}>Expand all</Button>
        <Button size='sm' variant='outline' tone='neutral' disabled={sections.allCollapsed} onClick={sections.collapseAll}>Collapse all</Button>
        <Readout>{sections.expandedCount} of {ids.length} open</Readout>
      </div>
      <div className='grid divide-y divide-border rounded-(--ds-radius-card) border border-border'>
        {settings.map(([ id, title, body ]) => (
          <Collapsible key={id} open={sections.isExpanded(id)} onOpenChange={() => sections.toggle(id)}>
            <CollapsibleTrigger className='flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium'>{title}</CollapsibleTrigger>
            <CollapsibleContent className='px-3 pb-3 text-sm text-text-muted'>{body}</CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

export { settings, ids, SettingsSections };
