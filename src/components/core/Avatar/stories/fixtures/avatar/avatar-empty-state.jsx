import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  return (
    <div className='flex flex-col items-center gap-4 text-center'>
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src='/avatars/person-20.svg'
            alt='sarah@example.com'
            className='grayscale'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src='/avatars/person-31.svg'
            alt='@samrivera'
            className='grayscale'
          />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src='/avatars/person-24.svg'
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
