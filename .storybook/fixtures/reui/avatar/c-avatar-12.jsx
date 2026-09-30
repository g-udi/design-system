// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/12.jpg'
          alt='Nick Johnson'
        />
        <AvatarFallback>NJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='Alex Johnson (away)'
        />
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/44.jpg'
          alt='Sarah Chen'
        />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
      </AvatarGroupCount>
    </AvatarGroup>
  );
}
