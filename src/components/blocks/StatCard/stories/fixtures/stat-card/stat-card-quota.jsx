import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { Badge } from '@gaudi/design-system/core/Pill';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

export function Pattern() {
  return (
    <div className='grid w-full max-w-3xl gap-3 sm:grid-cols-2'>
      <StatCard
        label='API calls'
        icon='ServerIcon'
        tone='info'
        value='824,310'
        description='of 1,000,000 included this cycle'
        footer='Renews Oct 14 · billed $82.40 so far'
      >
        <Progress value={82} aria-label='API quota used' className='h-2' />
        <div className='flex justify-between text-xs'>
          <span className='text-text-muted'>82% used</span>
          <span className='text-warning font-medium'>175,690 left</span>
        </div>
      </StatCard>
      <StatCard
        label='Sprint tasks'
        icon='CircleCheckIcon'
        tone='success'
        value='38 / 52'
        delta='6' deltaDirection='up' deltaTone='success'
        description='completed since Monday'
        footer={
          <span className='inline-flex items-center gap-1.5'>
            <RegistryIcon lucide='SparklesIcon' aria-hidden='true' className='text-discovery size-3.5' />
            At this pace the sprint finishes Thursday, a day early.
          </span>
        }
      >
        <Progress value={73} aria-label='Sprint completion' className='h-2' />
        <div className='flex flex-wrap gap-1.5'>
          <Badge variant='secondary' size='sm'>9 in review</Badge>
          <Badge variant='warning-light' size='sm'>3 blocked</Badge>
          <Badge variant='outline' size='sm'>2 unassigned</Badge>
        </div>
      </StatCard>
    </div>
  );
}
