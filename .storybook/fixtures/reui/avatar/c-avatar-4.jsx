// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='rounded-md after:rounded-md'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
          className='rounded-md'
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar className='rounded-lg after:rounded-lg'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
          className='rounded-lg'
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar className='rounded-lg after:rounded-xl'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
          className='rounded-xl'
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
    </div>
  );
}
