import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
export function Pattern() {
  return (
    <div className='flex items-center gap-1.5'>
      <Avatar>
        <AvatarImage
          src='/avatars/person-41.svg'
          alt='Anouk Varga'
        />
        <AvatarFallback>AV</AvatarFallback>
      </Avatar>

      <div className='flex flex-col'>
        <div className='flex items-center gap-1.5'>
          <span className='text-sm font-semibold'>Anouk Varga</span>
          <Badge variant='default' size='xs'>
            Pro
          </Badge>
        </div>
        <span className='text-ui-muted-foreground text-xs'>Founder & CEO</span>
      </div>
    </div>
  );
}
