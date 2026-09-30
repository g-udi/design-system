// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar size='sm'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson'
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson'
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar size='lg'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson'
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
    </div>
  );
}
