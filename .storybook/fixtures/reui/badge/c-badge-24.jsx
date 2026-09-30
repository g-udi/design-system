// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Badge variant='outline'>
      <Avatar className='size-3.5'>
        <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' />
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      Alex
      <Button
        aria-label='Close'
        variant='ghost'
        size='icon'
        className='size-3 hover:bg-transparent'
      >
        <RegistryIcon lucide='XIcon' />
      </Button>
    </Badge>
  );
}
