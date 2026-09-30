// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
export function Pattern() {
  return (
    <Avatar>
      <AvatarImage
        src='https://randomuser.me/api/portraits/men/32.jpg'
        alt='@alexjohnson'
        className='grayscale'
      />
      <AvatarFallback>AJ</AvatarFallback>
    </Avatar>
  );
}
