import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-col items-center gap-4 text-center'>
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/44.jpg'
            alt='sarah@example.com'
            className='grayscale'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src='https://randomuser.me/api/portraits/men/11.jpg'
            alt='@samrivera'
            className='grayscale'
          />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/68.jpg'
            alt='@jomorgan'
            className='grayscale'
          />
          <AvatarFallback>JM</AvatarFallback>
        </Avatar>
        <AvatarGroupCount aria-label='Add collaborator'>
          <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />
        </AvatarGroupCount>
      </AvatarGroup>
      <div className='space-y-0.5'>
        <h3 className='text-sm font-medium'>No active collaborators</h3>
        <p className='text-ui-muted-foreground text-xs'>
          Invite teammates to start working together.
        </p>
      </div>
    </div>
  );
}
