// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/44.jpg'
          alt='Sarah Chen'
        />
        <AvatarFallback>SC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/11.jpg'
          alt='Michael Rodriguez'
        />
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src='https://randomuser.me/api/portraits/women/68.jpg'
          alt='Emma Wilson'
        />
        <AvatarFallback>EW</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  );
}
