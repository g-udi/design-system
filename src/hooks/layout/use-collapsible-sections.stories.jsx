import { expect, userEvent, within } from 'storybook/test';
import Button from '../../components/core/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/core/Accordion/index.js';
import { example, hookMeta, Readout } from '../story-helpers.jsx';
import { useCollapsibleSections } from './use-collapsible-sections.js';

export default {
  title: 'Hooks/Layout/useCollapsibleSections',
  id: 'hooks-layout-usecollapsiblesections',
  tags: ['autodocs'],
  ...hookMeta('useCollapsibleSections')
};

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

export const SettingsPage = {
  name: 'Settings with expand and collapse all',
  parameters: example('Each section is a Collapsible driven by the hook; the bulk buttons disable (rather than disappear) when they have nothing to do.', `
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@gaudi/design-system';
import { useCollapsibleSections } from '@gaudi/design-system/hooks';

export function SettingsSections({ settings }) {
  const sections = useCollapsibleSections({ sections: settings.map((s) => s.id), initialExpanded: ['profile'] });
  return (
    <>
      <Button disabled={sections.allExpanded} onClick={sections.expandAll}>Expand all</Button>
      <Button disabled={sections.allCollapsed} onClick={sections.collapseAll}>Collapse all</Button>
      {settings.map((s) => (
        <Collapsible key={s.id} open={sections.isExpanded(s.id)} onOpenChange={() => sections.toggle(s.id)}>
          <CollapsibleTrigger>{s.title}</CollapsibleTrigger>
          <CollapsibleContent>{s.body}</CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}`),
  render: () => <SettingsSections />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('1 of 3 open')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await expect(canvas.getByText('3 of 3 open')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Expand all' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Privacy' }));
    await expect(canvas.getByText('2 of 3 open')).toBeVisible();
  }
};
