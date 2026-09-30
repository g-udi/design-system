import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-1.5'>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson'
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>

      <div className='flex flex-col'>
        <div className='flex items-center gap-1.5'>
          <span className='text-sm font-semibold'>Alex Johnson</span>
          <Badge variant='default' size='xs'>
            Pro
          </Badge>
        </div>
        <span className='text-ui-muted-foreground text-xs'>Founder & CEO</span>
      </div>
    </div>
  );
}
