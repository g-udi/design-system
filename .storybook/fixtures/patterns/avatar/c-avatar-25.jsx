import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='border-ui-border flex items-center gap-1.5 rounded-full border p-0.5 shadow-sm shadow-black/5'>
      <div className='flex -space-x-1.5'>
        <Avatar className='border-ui-background size-7 border-2'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/men/32.jpg'
            alt='Alex Johnson'
          />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <Avatar className='border-ui-background size-7 border-2'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/44.jpg'
            alt='Sarah Chen'
          />
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <Avatar className='border-ui-background size-7 border-2'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/men/11.jpg'
            alt='Michael Rodriguez'
          />
          <AvatarFallback>MR</AvatarFallback>
        </Avatar>
        <Avatar className='border-ui-background size-7 border-2'>
          <AvatarImage
            src='https://randomuser.me/api/portraits/women/68.jpg'
            alt='Emma Wilson'
          />
          <AvatarFallback>EW</AvatarFallback>
        </Avatar>
      </div>

      <p className='text-ui-muted-foreground me-1.5 text-xs'>+3</p>
    </div>
  );
}
