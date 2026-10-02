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
  { src: 'https://randomuser.me/api/portraits/men/49.jpg', initials: 'DK', name: 'David Kim' },
  { src: 'https://randomuser.me/api/portraits/men/11.jpg', initials: 'SR', name: 'Sam Rivera' },
  { src: 'https://randomuser.me/api/portraits/men/54.jpg', initials: 'JB', name: 'James Brown' },
  { src: 'https://randomuser.me/api/portraits/women/65.jpg', initials: 'JW', name: 'Jenny Wilson' }
];

function Person({ person, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar tabIndex={0} className={`ring-2 ring-ui-background transition-all duration-300 ease-in-out motion-reduce:transition-none ${className}`}>
          <AvatarImage src={person.src} alt={person.name} />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent sideOffset={8}>{person.name}</TooltipContent>
    </Tooltip>
  );
}

export function Pattern() {
  return (
    <TooltipProvider>
      <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
        <span className='text-xs text-text-muted'>Lift</span>
        <div className='flex -space-x-2 py-1'>
          {people.map((person) => (
            <Person key={person.name} person={person} className='hover:z-1 hover:shadow-md motion-safe:hover:-translate-y-1' />
          ))}
        </div>
        <span className='text-xs text-text-muted'>Spread</span>
        <div className='group/avatars flex items-center py-1'>
          {people.map((person, index) => (
            <div
              key={person.name}
              style={{ '--index': index, zIndex: people.length - index }}
              className='group/avatar-item translate-x-[calc(var(--index)*-8px)] transition-all duration-300 ease-in-out will-change-transform motion-reduce:transition-none motion-safe:group-hover/avatars:translate-x-[calc(var(--index)*6px)]'
            >
              <Person person={person} className='origin-center motion-safe:group-hover/avatar-item:scale-110' />
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
