// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center gap-2'>
      <Avatar>
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <RegistryIcon
            lucide='UserIcon'
            className='size-4'
            aria-hidden='true'
          />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
