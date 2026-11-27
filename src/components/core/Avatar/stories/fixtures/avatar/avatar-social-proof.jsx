import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  Frame,
  FramePanel
} from '@gaudi/design-system/core/Card';

const people = [
  { src: '/avatars/person-23.svg', name: 'Maren Wilder', initials: 'MW' },
  { src: '/avatars/person-07.svg', name: 'Nora Quinn', initials: 'NQ' },
  { src: '/avatars/person-31.svg', name: 'Sam Rivera', initials: 'SR' },
  { src: '/avatars/person-50.svg', name: 'Jules Martin', initials: 'JM' }
];

const Faces = () => (
  <AvatarGroup className='-space-x-1.5'>
    {people.map((person) => (
      <Avatar key={person.name} className='size-7'>
        <AvatarImage src={person.src} alt={person.name} />
        <AvatarFallback>{person.initials}</AvatarFallback>
      </Avatar>
    ))}
  </AvatarGroup>
);

export function Pattern() {
  return (
    <div className='mx-auto flex w-fit flex-col items-center gap-3'>
      <Badge asChild variant='outline' radius='full' className='h-auto gap-1.5 p-1 font-normal'><div>
        <Faces />
        <p className='me-1.5 text-xs text-text-muted'>
          Trusted by <span className='font-semibold text-text'>100K+</span> users.
        </p>
      </div></Badge>
      <Badge asChild variant='outline' radius='full' className='h-auto gap-1.5 p-0.5 font-normal'><div>
        <Faces />
        <p className='me-1.5 text-xs text-text-muted'>+3</p>
      </div></Badge>
      <Frame>
        <FramePanel className='flex items-center gap-2 p-2!'>
          <Faces />
          <p className='me-1.5 text-xs text-text-muted'>
            Joined by <span className='font-semibold text-text'>500+</span> developers.
          </p>
        </FramePanel>
      </Frame>
    </div>
  );
}
