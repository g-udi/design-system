import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@gaudi/design-system/core/EmptyState';
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
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
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
        </EmptyMedia>
        <EmptyTitle as='h3'>No active collaborators</EmptyTitle>
        <EmptyDescription>
          Invite teammates to start working together.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
