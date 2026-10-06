import Button from '@gaudi/design-system/core/Button';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarGroup,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';
const people = [
  { name: 'Ilse Valtonen', email: 'ilse@example.com', role: 'Admin', online: true, photo: 'person-24', initials: 'IV' },
  { name: 'Felix Okonjo', email: 'felix@example.com', role: 'Editor', online: true, photo: 'person-41', initials: 'FO' },
  { name: 'Priyanka Nairn', email: 'priyanka@example.com', role: 'Viewer', online: false, photo: 'person-23', initials: 'PN' }
];
export function Pattern() {
  return (
    <TooltipProvider>
      <AvatarGroup className='justify-center'>
        {people.map((person) => (
          <Tooltip key={person.name}>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' aria-label={person.name} className='relative rounded-full ring-2 ring-surface'>
                <Avatar>
                  <AvatarImage src={`/avatars/${person.photo}.svg`} alt='' />
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                {person.online ? (
                  <AvatarBadge className='bg-success' />
                ) : null}
              </Button>
            </TooltipTrigger>
            <TooltipContent className='flex items-center gap-2 p-2'>
              <Avatar>
                <AvatarImage src={`/avatars/${person.photo}.svg`} alt='' />
                <AvatarFallback>{person.initials}</AvatarFallback>
              </Avatar>
              <div className='flex flex-col gap-0.5'>
                <div className='flex items-center gap-1'>
                  <span className='font-semibold'>{person.name}</span>
                  <Badge variant='info' size='xs'>{person.role}</Badge>
                </div>
                <span className='opacity-80'>{person.email}</span>
                <span className='flex items-center gap-1.5 opacity-80'>
                  <span className={`block size-1.5 shrink-0 rounded-full ${person.online ? 'bg-success' : 'bg-text-muted'}`} />
                  {person.online ? 'Online now' : 'Away'}
                </span>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </AvatarGroup>
    </TooltipProvider>
  );
}
