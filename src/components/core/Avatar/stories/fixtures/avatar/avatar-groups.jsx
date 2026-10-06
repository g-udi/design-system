import {
  AvatarRoot as Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const team = [
  { src: '/avatars/person-20.svg', name: 'Sabine Okafor', initials: 'SO' },
  { src: '/avatars/person-31.svg', name: 'Rafe Okonkwo', initials: 'RO' },
  { src: '/avatars/person-24.svg', name: 'Ilse Valtonen', initials: 'IV' }
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
