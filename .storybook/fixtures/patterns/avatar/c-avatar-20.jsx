import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';

const people = [
  { src: '/avatars/women/65.jpg', name: 'Jenny Wilson', initials: 'JW' },
  { src: '/avatars/women/12.jpg', name: 'Nora Quinn', initials: 'NQ' },
  { src: '/avatars/men/11.jpg', name: 'Sam Rivera', initials: 'SR' },
  { src: '/avatars/men/75.jpg', name: 'Jules Martin', initials: 'JM' }
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
