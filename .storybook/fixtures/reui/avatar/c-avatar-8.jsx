// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson (away)'
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className='top-0 right-0 bg-green-500' />
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/44.jpg'
          alt='Sarah Chen'
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge className='bg-yellow-500' />
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/11.jpg'
          alt='Michael Rodriguez'
        />
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge className='bg-ui-destructive top-0 right-auto left-0' />
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
        />
        <AvatarFallback>EW</AvatarFallback>
        <AvatarBadge className='right-auto left-0 bg-blue-500' />
      </Avatar>
    </div>
  );
}
