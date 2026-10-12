import Avatar from '@gaudi/design-system/core/Avatar';
import {
  TooltipRoot as Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@gaudi/design-system/core/Tooltip';

const people = [
  { src: '/avatars/person-45.svg', name: 'Ottilie Nakamura' },
  { src: '/avatars/person-31.svg', name: 'Sam Rivera' },
  { src: '/avatars/person-47.svg', name: 'Felix Arrowsmith' },
  { src: '/avatars/person-23.svg', name: 'Maren Wilder' }
];

function Person({ person, className }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Avatar src={person.src} name={person.name} size='sm' shape='circle' surface='tinted' tabIndex={0}
          className={`ring-2 ring-ui-background transition-all duration-300 ease-in-out motion-reduce:transition-none ${className}`} />
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
        <span className='text-xs text-text-muted'>Spaced</span>
        <div className='flex items-center gap-2 py-1'>
          {people.map((person) => (
            <Person key={person.name} person={person} className='origin-center motion-safe:hover:scale-110' />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
