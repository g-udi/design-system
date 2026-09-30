import { Avatar, AvatarGroup } from '../../../src/components/core/Avatar/index.js';
import { default as Button } from '../../../src/components/core/Button/index.js';
import { default as Dialog } from '../../../src/components/core/Dialog/index.js';

const people = [
  { id: 'maya', name: 'Maya Chen', src: 'https://randomuser.me/api/portraits/women/44.jpg', tone: 'teal' },
  { id: 'alex', name: 'Alex Johnson', src: 'https://randomuser.me/api/portraits/men/32.jpg', tone: 'blue' },
  { id: 'sam', name: 'Sam Rivera', src: 'https://randomuser.me/api/portraits/men/11.jpg', tone: 'indigo' },
  { id: 'lina', name: 'Lina Ahmed', src: 'https://randomuser.me/api/portraits/women/12.jpg', tone: 'rose' },
  { id: 'jules', name: 'Jules Martin', src: 'https://randomuser.me/api/portraits/men/75.jpg', tone: 'amber' },
  { id: 'jo', name: 'Jo Morgan', src: 'https://randomuser.me/api/portraits/women/68.jpg', tone: 'green' }
];

export function TeamRoster() {
  return (
    <div className='grid justify-items-start gap-3'>
      <p className='text-sm font-medium'>Assigned reviewers</p>
      <AvatarGroup avatars={people} max={3} size='md' label='Review team'
        renderOverflow={(count, total) => (
          <Dialog title='Review team' description='Everyone assigned to this review.' trigger={
            <Button variant='ghost' tone='neutral' size='icon' radius='full' className='size-10 min-h-10 p-0' aria-label={`View ${total} more reviewers`}><span aria-hidden='true'>{count}</span></Button>
          }>
            <ul className='grid gap-4'>{people.map((person) => <li key={person.id} className='flex items-center gap-3'><Avatar {...person} shape='circle' alt='' /><span>{person.name}</span></li>)}</ul>
          </Dialog>
        )}
      />
      <p className='text-sm text-ui-muted-foreground'>Open the overflow control to see all six people.</p>
    </div>
  );
}
