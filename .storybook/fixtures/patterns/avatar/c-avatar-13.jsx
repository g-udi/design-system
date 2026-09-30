import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-3'>
      <Avatar className='ring-ui-primary ring-offset-background size-8 ring-2 ring-offset-2'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson'
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar className='ring-ui-destructive ring-offset-background size-8 ring-2 ring-offset-2'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/44.jpg'
          alt='Sarah Chen'
        />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar className='ring-offset-background size-8 ring-2 ring-violet-500 ring-offset-2'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/11.jpg'
          alt='Michael Rodriguez'
        />
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <Avatar className='ring-offset-background size-8 ring-2 ring-yellow-500 ring-offset-2'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
    </div>
  );
}
