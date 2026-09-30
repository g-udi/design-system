import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <Avatar className='relative'>
      <AvatarImage
        src='https://randomuser.me/api/portraits/men/32.jpg'
        alt='Alex Johnson'
      />
      <AvatarFallback>JB</AvatarFallback>
      <AvatarBadge className='bg-green-500' />
      <span className='border-ui-background absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 bg-red-500 text-xs font-medium text-white'>
        3
      </span>
    </Avatar>
  );
}
