// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <Frame>
      <FramePanel className='flex items-center gap-2 p-2!'>
        <AvatarGroup>
          <Avatar className='size-7'>
            <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='@alexjohnson' />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <Avatar className='size-7'>
            <AvatarImage
              src='https://randomuser.me/api/portraits/men/11.jpg'
              alt='@samrivera'
            />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
          <Avatar className='size-7'>
            <AvatarImage
              src='https://randomuser.me/api/portraits/women/68.jpg'
              alt='@jomorgan'
            />
            <AvatarFallback>JM</AvatarFallback>
          </Avatar>
          <Avatar className='size-7'>
            <AvatarImage src='https://randomuser.me/api/portraits/men/75.jpg' alt='@julesmartin' />
            <AvatarFallback>JM</AvatarFallback>
          </Avatar>
        </AvatarGroup>

        <p className='text-ui-muted-foreground me-1.5 text-xs'>
          Joined by{' '}
          <span className='text-ui-foreground font-semibold'>500+</span>{' '}
          developers.
        </p>
      </FramePanel>
    </Frame>
  );
}
