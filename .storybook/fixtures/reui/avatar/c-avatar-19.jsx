// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
export function Pattern() {
  return (
    <Button variant='outline' size='sm' className='gap-1.5'>
      <Avatar className='size-5'>
        <AvatarImage
          src='https://randomuser.me/api/portraits/men/32.jpg'
          alt='@nick.bold'
        />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <span className='text-xs'>@nick.bold</span>
    </Button>
  );
}
