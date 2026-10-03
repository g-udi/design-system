import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
const people = [
  { name: 'Emma Wilson', email: 'emma@example.com', role: 'Admin', online: true, photo: 'women/68', initials: 'EW' },
  { name: 'James Davis', email: 'james@example.com', role: 'Editor', online: true, photo: 'men/32', initials: 'JD' },
  { name: 'Priya Nair', email: 'priya@example.com', role: 'Viewer', online: false, photo: 'women/65', initials: 'PN' }
];
export function Pattern() {
  return (
    <TooltipProvider>
      <div className='flex items-center justify-center -space-x-2'>
        {people.map((person) => (
          <Tooltip key={person.name}>
            <TooltipTrigger asChild>
              <button type='button' aria-label={person.name} className='relative rounded-full ring-2 ring-surface'>
                <Avatar>
                  <AvatarImage src={`/avatars/${person.photo}.jpg`} alt='' />
                  <AvatarFallback>{person.initials}</AvatarFallback>
                </Avatar>
                {person.online ? (
                  <span className='absolute right-0 bottom-0 block size-2.5 rounded-full border-2 border-surface bg-success' />
                ) : null}
              </button>
            </TooltipTrigger>
            <TooltipContent className='flex items-center gap-2 p-2'>
              <Avatar>
                <AvatarImage src={`/avatars/${person.photo}.jpg`} alt='' />
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
      </div>
    </TooltipProvider>
  );
}
