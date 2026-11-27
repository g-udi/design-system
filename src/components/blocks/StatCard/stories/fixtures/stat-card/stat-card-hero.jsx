'use client';
import Dialog from '@gaudi/design-system/core/Dialog';
import { CardContent, CardFooter, CardRoot } from '@gaudi/design-system/core/Card';
import { default as Button } from '@gaudi/design-system/core/Button';
import { StatDelta } from '@gaudi/design-system/blocks/StatCard';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const heroes = [
  {
    label: 'Monthly readers',
    value: '48.2k',
    delta: '12.4%',
    deltaDirection: 'up',
    deltaTone: 'success',
    summary: 'Your best month since launch, led by the knowledge graph series.',
    action: 'Reader activity',
    detail: 'The knowledge graph series brought 18,600 readers. The remaining 29,600 visited other articles.'
  },
  {
    label: 'Newsletter',
    value: '9,410',
    delta: '3.8%',
    deltaDirection: 'up',
    deltaTone: 'success',
    summary: '312 new subscribers; the welcome email opens at 71%.',
    action: 'Subscriber activity',
    detail: 'There are 9,410 subscribers. This month 312 joined, and 71% opened the welcome email.'
  },
  {
    label: 'Drafts',
    value: '6',
    delta: '0',
    deltaDirection: 'flat',
    deltaTone: 'neutral',
    summary: 'Two are ready for review and one is scheduled for Friday.',
    action: 'Draft status',
    detail: 'Two drafts are ready for review, one is scheduled for Friday and three are still being written.'
  }
];

// Full-bleed hero metrics with a dark action bar that stays dark in both themes.
export function Pattern() {
  return (
    <div className='grid w-full max-w-5xl gap-3 md:grid-cols-3'>
      {heroes.map((hero) => (
        <CardRoot key={hero.label} className='gap-0 overflow-hidden py-0'>
          <CardContent className='grid gap-2 p-5'>
            <p className='text-text-muted text-sm'>{hero.label}</p>
            <div className='flex items-baseline gap-2'>
              <span className='text-4xl font-semibold tracking-tight tabular-nums'>{hero.value}</span>
              <StatDelta value={hero.delta} direction={hero.deltaDirection} tone={hero.deltaTone} />
            </div>
            <p className='text-text-muted text-sm'>{hero.summary}</p>
          </CardContent>
          <CardFooter className='dark bg-surface text-text mt-auto justify-between px-5 py-2.5'>
            <span className='text-text-muted text-xs'>Updated 5 min ago</span>
            <Dialog
              title={hero.action}
              description={hero.detail}
              trigger={
                <Button variant='ghost' size='xs'>
                  {hero.action}
                  <RegistryIcon lucide='ArrowUpRightIcon' aria-hidden='true' />
                </Button>
              }
            />
          </CardFooter>
        </CardRoot>
      ))}
    </div>
  );
}
