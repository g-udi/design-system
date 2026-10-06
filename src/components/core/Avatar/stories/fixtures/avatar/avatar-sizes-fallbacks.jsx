import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const person = { src: '/avatars/person-41.svg', name: 'Anouk Varga', initials: 'AV' };

function Photo({ className, imageClassName, size, src = person.src, children = person.initials }) {
  return (
    <Avatar size={size} className={className}>
      {src ? <AvatarImage src={src} alt={person.name} className={imageClassName} /> : null}
      <AvatarFallback>{children}</AvatarFallback>
    </Avatar>
  );
}

const rows = [
  {
    label: 'Sizes',
    items: [
      <Photo key='sm' size='sm' />,
      <Photo key='default' />,
      <Photo key='lg' size='lg' />,
      <Photo key='12' className='size-12' />,
      <Photo key='16' className='size-16' />
    ]
  },
  {
    label: 'Shapes',
    items: [
      <Photo key='md' className='rounded-md after:rounded-md' />,
      <Photo key='lg' className='rounded-lg after:rounded-lg' />,
      <Photo key='xl' className='rounded-xl after:rounded-xl' />,
      <Photo key='full' />
    ]
  },
  {
    label: 'Fallbacks',
    items: [
      <Photo key='initials' src='' />,
      <Photo key='icon' src=''>
        <RegistryIcon lucide='UserIcon' className='size-4' aria-hidden='true' />
      </Photo>,
      <Photo key='square' src='' className='rounded-md after:rounded-md' />
    ]
  }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      {rows.map((row) => (
        <div key={row.label} className='contents'>
          <span className='text-xs text-text-muted'>{row.label}</span>
          <div className='flex flex-wrap items-center gap-2'>{row.items}</div>
        </div>
      ))}
    </div>
  );
}
