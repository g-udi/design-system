import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex flex-wrap items-center justify-center gap-2'>
      <Badge variant='outline'>
        <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
        Verified
      </Badge>
      <Badge variant='info-light'>
        <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
        In progress
      </Badge>
      <Badge variant='success-light'>
        <span aria-hidden='true' className='size-1.5 rounded-full bg-current' />
        Online
      </Badge>
      <Badge variant='outline'>
        <Avatar className='size-3.5'>
          <AvatarImage src='/avatars/men/32.jpg' alt='' />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        Alex
      </Badge>
      <Badge variant='outline'>
        <img src='static/images/art/4.svg' alt='' width={14} height={14} className='rounded-xs' />
        Northwind
      </Badge>
    </div>
  );
}
