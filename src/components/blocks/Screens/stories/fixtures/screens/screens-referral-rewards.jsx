'use client';
import { useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { cn } from '@gaudi/design-system/utilities/cn';
import { useCopyToClipboard } from '@gaudi/design-system/hooks/interaction/use-copy-to-clipboard';

const link = 'https://gaudi.app/r/maya-lopez';
const referred = 7;
const tiers = [
  { count: 3, reward: 'One month free', icon: 'StarIcon' },
  { count: 10, reward: 'Team plan for a year', icon: 'RocketIcon' },
  { count: 25, reward: 'Lifetime Pro and a partner badge', icon: 'ShieldCheckIcon' }
];
const activity = [
  ['Hannah Weiss', 'person-18', 'Subscribed to Team', '2 days ago', 'Rewarded'],
  ['Jonas Berg', 'person-46', 'Started a trial', '5 days ago', 'Pending'],
  ['Aiko Tanaka', 'person-25', 'Signed up', '1 week ago', 'Pending'],
  ['Carlos Ruiz', 'person-36', 'Subscribed to Pro', '2 weeks ago', 'Rewarded']
];

export function Pattern() {
  const [message, setMessage] = useState('');
  const { copy, isCopied: copied } = useCopyToClipboard({
    onCopy: () => setMessage('Demo referral link copied.'),
    onError: () => setMessage('Could not copy. Select the referral link and copy it manually.')
  });
  const next = tiers.find((tier) => tier.count > referred);
  return (
    <div className='grid w-full max-w-4xl gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]'>
      <section aria-labelledby='referral-title' className='grid content-start gap-4 rounded-xl border p-5'>
        <div className='grid gap-1'>
          <h2 id='referral-title' className='text-lg font-semibold'>Invite friends, earn rewards</h2>
          <p className='text-text-muted text-sm'>Share your link. You both get a month free when they subscribe.</p>
        </div>
        <InputGroup>
          <InputGroupInput readOnly value={link} aria-label='Referral link' />
          <InputGroupAddon align='inline-end'>
            <InputGroupButton size='xs' onClick={() => copy(link)}>
              <RegistryIcon lucide={copied ? 'CheckIcon' : 'CopyIcon'} aria-hidden='true' />
              {copied ? 'Copied' : 'Copy link'}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <div className='flex flex-wrap gap-2'>
          <Button size='sm' variant='outline' onClick={() => setMessage('Email sharing is not connected in this demo. Copy the link to share it.')}>
            <RegistryIcon lucide='MailIcon' aria-hidden='true' />
            Email
          </Button>
          <Button size='sm' variant='outline' onClick={() => setMessage('Posting is not connected in this demo. Copy the link to share it.')}>
            <RegistryIcon lucide='TwitterIcon' aria-hidden='true' />
            Post
          </Button>
          <Button size='sm' variant='outline' onClick={() => setMessage('LinkedIn sharing is not connected in this demo. Copy the link to share it.')}>
            <RegistryIcon lucide='LinkedinIcon' aria-hidden='true' />
            Share
          </Button>
        </div>
        <p role='status' aria-label='Referral action' className='text-text-muted text-sm'>{message || 'Demo rewards and referral activity. Sharing services are not connected.'}</p>
        <div className='grid gap-2'>
          <h3 className='text-sm font-medium'>Recent referrals</h3>
          <ul className='grid gap-2.5'>
            {activity.map(([name, portrait, action, when, state]) => (
              <li key={name} className='flex items-center gap-3 text-sm'>
                <Avatar size='sm'>
                  <AvatarImage src={`/avatars/${portrait}.svg`} alt={name} />
                  <AvatarFallback>{name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className='grid min-w-0 flex-1'>
                  <span className='font-medium'>{name}</span>
                  <span className='text-text-muted text-xs'>{action} · {when}</span>
                </span>
                <Badge size='sm' variant={state === 'Rewarded' ? 'success-light' : 'secondary'}>{state}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section aria-labelledby='tiers-title' className='grid content-start gap-4 rounded-xl border p-5'>
        <div className='grid gap-1'>
          <h2 id='tiers-title' className='text-sm font-medium'>Reward tiers</h2>
          <p className='text-2xl font-semibold tabular-nums'>{referred} referrals</p>
          <p className='text-text-muted text-xs'>{next ? `${next.count - referred} more to unlock ${next.reward.toLowerCase()}` : 'Every tier unlocked'}</p>
        </div>
        <Progress value={(referred / tiers.at(-1).count) * 100} aria-label='Progress to the top tier' className='h-1.5' />
        <ol className='grid gap-3'>
          {tiers.map((tier) => {
            const reached = referred >= tier.count;
            return (
              <li key={tier.count} className='flex items-center gap-3'>
                <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-full [&_svg]:size-4', reached ? 'bg-success-subtle text-success' : 'bg-surface-muted text-text-muted')}>
                  <RegistryIcon lucide={reached ? 'CheckIcon' : tier.icon} aria-hidden='true' />
                </span>
                <span className='grid text-sm'>
                  <span className='font-medium'>{tier.reward}</span>
                  <span className='text-text-muted text-xs'>{tier.count} referrals{reached ? ' · unlocked' : ''}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
