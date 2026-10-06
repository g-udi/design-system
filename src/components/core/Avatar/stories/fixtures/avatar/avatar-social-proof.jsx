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
      <div className='flex items-center gap-1.5 rounded-full border border-ui-border p-1 shadow-sm shadow-black/5'>
        <Faces />
        <p className='me-1.5 text-xs text-text-muted'>
          Trusted by <span className='font-semibold text-text'>100K+</span> users.
        </p>
      </div>
      <div className='flex items-center gap-1.5 rounded-full border border-ui-border p-0.5 shadow-sm shadow-black/5'>
        <Faces />
        <p className='me-1.5 text-xs text-text-muted'>+3</p>
      </div>
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
