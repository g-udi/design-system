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
          src='https://randomuser.me/api/portraits/women/12.jpg'
          alt='Nick Johnson'
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className='bg-ui-primary' />
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson (away)'
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className='bg-green-500' />
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
        <AvatarBadge className='bg-ui-destructive' />
      </Avatar>
    </div>
  );
}
