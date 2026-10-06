import PopoverRoot, { Popover, PopoverTrigger, PopoverContent } from '@gaudi/design-system/core/Popover';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useState } from 'react';
import { PopoverHeader, PopoverTitle, PopoverDescription } from '@gaudi/design-system/core/Popover';
import Button from '@gaudi/design-system/core/Button';
import Avatar from '@gaudi/design-system/core/Avatar';

const heading = 'Share this draft';

const shareUrl = 'gaudi.dev/d/tokens-oklch';

const people = [
  { name: 'Ahmad Assaf', role: 'Owner', src: '/avatars/person-41.svg' },
  { name: 'Lina Haddad', role: 'Can edit', src: '/avatars/person-20.svg' },
  { name: 'Sam Okafor', role: 'Can view', src: '/avatars/person-50.svg' }
];

function SharePanel() {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <PopoverHeader>
        <PopoverTitle>{heading}</PopoverTitle>
        <PopoverDescription>Anyone with the link can view.</PopoverDescription>
      </PopoverHeader>
      <div className='flex items-center gap-2'>
        <span className='flex min-h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border px-2 text-xs text-text-muted'>
          <RegistryIcon lucide='LinkIcon' className='size-3.5 shrink-0' />
          <span className='truncate'>{shareUrl}</span>
        </span>
        <Button size='sm' variant='outline' tone='neutral' onClick={() => setCopied(true)}>
          <RegistryIcon lucide={copied ? 'CheckIcon' : 'CopyIcon'} />
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <ul className='m-0 grid list-none gap-2 border-t border-border p-0 pt-2'>
        {people.map((person) => (
          <li key={person.name} className='flex items-center gap-2'>
            <Avatar src={person.src} name={person.name} size='sm' shape='circle' alt='' />
            <span className='min-w-0 flex-1 truncate font-medium text-text'>{person.name}</span>
            <span className='text-xs text-text-muted'>{person.role}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

const snoozeOptions = ['Later today', 'Tomorrow', 'Next week'];

function ControlledExample() {
  const [open, setOpen] = useState(false);
  const [snoozed, setSnoozed] = useState('');
  return (
    <div className='flex min-h-56 items-start justify-center gap-3'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' tone='neutral'><RegistryIcon lucide='AlarmClockIcon' />Snooze</Button>
        </PopoverTrigger>
        <PopoverContent align='start' className='w-48'>
          <PopoverHeader>
            <PopoverTitle>Snooze until</PopoverTitle>
          </PopoverHeader>
          <div className='grid gap-1'>
            {snoozeOptions.map((option) => (
              <Button key={option} size='sm' variant='ghost' tone='neutral' className='justify-start' onClick={() => {
                setSnoozed(option);
                setOpen(false);
              }}>
                {option}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <p role='status' className='pt-1.5 text-sm text-text-muted'>{snoozed ? `Snoozed until ${snoozed.toLowerCase()}.` : 'Not snoozed.'}</p>
    </div>
  );
}

export const exampleDefaults = { trigger: 'Share', side: 'bottom', align: 'center' };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <div className='flex min-h-[32rem] items-center justify-center'>
      <PopoverRoot key={`${args.side}-${args.align}`} defaultOpen modal={false} {...args} trigger={<><RegistryIcon lucide='Share2Icon' />{args.trigger}</>}>
        <SharePanel />
      </PopoverRoot>
    </div>;
}

export const ComposedDemo = () => <ControlledExample />;

export { people };
