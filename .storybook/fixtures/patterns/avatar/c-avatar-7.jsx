import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/12.jpg'
          alt='Nick Johnson'
        />
        <AvatarFallback>NJ</AvatarFallback>
        <AvatarBadge>
          <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
        </AvatarBadge>
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson (away)'
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className='bg-success'>
          <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
        </AvatarBadge>
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/44.jpg'
          alt='Sarah Chen'
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge className='bg-warning'>
          <RegistryIcon lucide='StarIcon' aria-hidden='true' />
        </AvatarBadge>
      </Avatar>
      <Avatar className='relative'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/11.jpg'
          alt='Michael Rodriguez'
        />
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge className='bg-info'>
          <RegistryIcon lucide='ShieldCheckIcon' aria-hidden='true' />
        </AvatarBadge>
      </Avatar>
    </div>
  );
}
