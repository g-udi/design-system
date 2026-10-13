import {
  AvatarRoot as Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import Icon from '@gaudi/design-system/core/Icon';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const people = [
  { src: '/avatars/person-07.svg', name: 'Nora Quinn', initials: 'NQ' },
  { src: '/avatars/person-41.svg', name: 'Anouk Varga', initials: 'AV' },
  { src: '/avatars/person-20.svg', name: 'Sabine Okafor', initials: 'SO' },
  { src: '/avatars/person-31.svg', name: 'Rafe Okonkwo', initials: 'RO' }
];
const corners = ['top-0 right-0 bottom-auto', '', 'top-0 right-auto bottom-auto left-0', 'right-auto left-0'];
const squareCorners = ['-top-1 -right-1 bottom-auto', '-right-1 -bottom-1', '-top-1 right-auto bottom-auto -left-1', 'right-auto -bottom-1 -left-1'];
const statuses = [
  { label: 'Online', className: 'bg-success' },
  { label: 'Away', className: 'bg-warning' },
  { label: 'Busy', className: 'bg-ui-destructive' },
  { label: 'Syncing', className: 'bg-ui-primary' }
];
const icons = [
  { label: 'Follow', icon: 'PlusIcon', className: '' },
  { label: 'Approved', icon: 'CheckIcon', className: 'bg-success' },
  { label: 'Favourite', icon: 'StarIcon', className: 'bg-warning' },
  { label: 'Admin', icon: 'ShieldCheckIcon', className: 'bg-info' }
];

const VerifiedBadge = () => <Icon name='BadgeCheck' decorative size='sm' className='fill-accent text-accent-foreground' />;
function Person({ person, label, className, children }) {
  return (
    <Avatar className={className} aria-label={label ? `${person.name}, ${label}` : person.name} role='img'>
      <AvatarImage src={person.src} alt='' className={className?.includes('rounded-md') ? 'rounded-md' : undefined} />
      <AvatarFallback>{person.initials}</AvatarFallback>
      {children}
    </Avatar>
  );
}

const rows = [
  {
    label: 'Status',
    items: statuses.map((status, index) => (
      <Person key={status.label} person={people[index]} label={status.label}>
        <AvatarBadge className={status.className} />
      </Person>
    ))
  },
  {
    label: 'Icons',
    items: icons.map((item, index) => (
      <Person key={item.label} person={people[index]} label={item.label}>
        <AvatarBadge className={item.className}>
          <RegistryIcon lucide={item.icon} aria-hidden='true' />
        </AvatarBadge>
      </Person>
    ))
  },
  {
    label: 'Positions',
    items: corners.map((corner, index) => (
      <Person key={index} person={people[index]} label={statuses[index].label}>
        <AvatarBadge className={`${statuses[index].className} ${corner}`} />
      </Person>
    ))
  },
  {
    label: 'On squares',
    items: squareCorners.map((corner, index) => (
      <Person key={index} person={people[index]} label={statuses[index].label} className='rounded-md after:rounded-md'>
        <AvatarBadge className={`${statuses[index].className} ${corner}`} />
      </Person>
    ))
  },
  {
    label: 'Custom',
    items: [
      <Person key='verified' person={people[1]} label='Verified' className='size-10'>
        <span className='absolute -top-0.5 -right-0.5'><VerifiedBadge /></span>
      </Person>,
      <Person key='verified-bottom' person={people[3]} label='Verified' className='size-10'>
        <span className='absolute -bottom-0.5 -left-0.5'><VerifiedBadge /></span>
      </Person>,
      <Person key='count' person={people[2]} label='online, 3 unread messages' className='size-10'>
        <AvatarBadge className='bg-success' />
        <span aria-hidden='true' className='absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 border-ui-background bg-danger text-xs font-medium text-danger-foreground'>
          3
        </span>
      </Person>
    ]
  }
];

export function Pattern() {
  return (
    <div className='mx-auto grid w-fit grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3'>
      {rows.map((row) => (
        <div key={row.label} className='contents'>
          <span className='text-xs text-text-muted'>{row.label}</span>
          <div className='flex flex-wrap items-center gap-3'>{row.items}</div>
        </div>
      ))}
    </div>
  );
}
