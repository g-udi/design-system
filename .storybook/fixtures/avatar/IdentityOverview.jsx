import { Avatar, AvatarGroup } from '../../../src/components/core/Avatar/index.js';
import { default as Pill } from '../../../src/components/core/Pill/index.js';

const people = [
  { id: 'maya', name: 'Maya Chen', role: 'Design lead', src: 'https://randomuser.me/api/portraits/women/44.jpg', tone: 'teal', indicator: { label: 'Online', tone: 'success' } },
  { id: 'alex', name: 'Alex Johnson', role: 'Engineering', src: 'https://randomuser.me/api/portraits/men/32.jpg', tone: 'blue', indicator: { label: 'In a meeting', tone: 'danger', icon: 'Minus' } },
  { id: 'sam', name: 'Sam Rivera', role: 'Content designer', src: 'https://randomuser.me/api/portraits/men/11.jpg', tone: 'indigo', indicator: { label: 'Away', tone: 'warning' } },
  { id: 'jo', name: 'Jo Morgan', src: 'https://randomuser.me/api/portraits/women/68.jpg', tone: 'rose' },
  { id: 'lina', name: 'Lina Ahmed', src: 'https://randomuser.me/api/portraits/women/12.jpg', tone: 'amber' },
  { id: 'jules', name: 'Jules Martin', src: 'https://randomuser.me/api/portraits/men/75.jpg', tone: 'green' }
];

export function IdentityOverview() {
  return (
    <div className='w-full max-w-xl text-ui-foreground'>
      <div className='mb-5 flex flex-wrap items-center justify-between gap-3'>
        <div><h3 className='font-semibold'>Editorial workspace</h3><p className='text-sm text-ui-muted-foreground'>People shaping the next release</p></div>
        <Pill>6 collaborators</Pill>
      </div>
      <ul className='grid gap-5'>
        {people.slice(0, 3).map((person) => (
          <li key={person.id} className='flex min-w-0 items-center gap-3'>
            <Avatar name={person.name} src={person.src} tone={person.tone} indicator={person.indicator} size='lg' shape='circle' />
            <div className='min-w-0 flex-1'><p className='truncate font-medium'>{person.name}</p><p className='text-sm text-ui-muted-foreground'>{person.role}</p></div>
            <span className='max-w-24 text-right text-xs text-ui-muted-foreground'>{person.indicator.label}</span>
          </li>
        ))}
      </ul>
      <div className='mt-5 border-t border-ui-border pt-4'>
        <AvatarGroup avatars={people} max={3} label='Editorial collaborators'>
          <span className='text-sm text-ui-muted-foreground'>Reviewing together</span>
        </AvatarGroup>
      </div>
    </div>
  );
}
