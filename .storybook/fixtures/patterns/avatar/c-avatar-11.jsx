import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const team = [
  { src: '/avatars/women/44.jpg', name: 'Sarah Chen', initials: 'SC' },
  { src: '/avatars/men/11.jpg', name: 'Michael Rodriguez', initials: 'MR' },
  { src: '/avatars/women/68.jpg', name: 'Emma Wilson', initials: 'EW' }
];

const members = (online) =>
  team.map((person, index) => (
    <Avatar key={person.name}>
      <AvatarImage src={person.src} alt={online && index === 0 ? `${person.name}, online` : person.name} />
      <AvatarFallback>{person.initials}</AvatarFallback>
      {online && index === 0 ? <AvatarBadge className='bg-success' /> : null}
    </Avatar>
  ));

const rows = [
  { label: 'Stacked', group: <AvatarGroup>{members(true)}</AvatarGroup> },
  {
    label: 'Count',
    group: (
      <AvatarGroup>
        {members()}
        <AvatarGroupCount aria-label='3 more people'>+3</AvatarGroupCount>
      </AvatarGroup>
    )
  },
  {
    label: 'Icon count',
    group: (
      <AvatarGroup>
        {members()}
        <AvatarGroupCount aria-label='More people'>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
        </AvatarGroupCount>
      </AvatarGroup>
    )
  },
  {
    label: 'With action',
    group: (
      <div className='flex gap-2'>
        <AvatarGroup>
          {members()}
          <AvatarGroupCount aria-label='5 more people'>+5</AvatarGroupCount>
        </AvatarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button aria-label='Add user' variant='outline' size='icon' className='rounded-full'>
              <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add user</TooltipContent>
        </Tooltip>
      </div>
    )
  }
];

export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
        {rows.map((row) => (
          <div key={row.label} className='contents'>
            <span className='text-xs text-text-muted'>{row.label}</span>
            {row.group}
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
