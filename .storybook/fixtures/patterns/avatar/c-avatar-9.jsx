import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='rounded-md relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson (away)'
          className='rounded-md'
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className='-top-1 -right-1 bg-green-500' />
      </Avatar>
      <Avatar className='rounded-md relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/44.jpg'
          alt='Sarah Chen'
          className='rounded-md'
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge className='-right-1 -bottom-1 bg-yellow-500' />
      </Avatar>
      <Avatar className='rounded-md relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/11.jpg'
          alt='Michael Rodriguez'
          className='rounded-md'
        />
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge className='bg-ui-destructive -top-1 right-auto bottom-auto -left-1' />
      </Avatar>
      <Avatar className='rounded-md relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
          className='rounded-md'
        />
        <AvatarFallback>EW</AvatarFallback>
        <AvatarBadge className='right-auto -bottom-1 -left-1 bg-blue-500' />
      </Avatar>
    </div>
  );
}
