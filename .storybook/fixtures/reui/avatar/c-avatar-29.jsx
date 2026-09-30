// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <TooltipProvider>
      <div className='flex gap-2'>
        <AvatarGroup>
          <Avatar>
            <AvatarImage src='https://randomuser.me/api/portraits/men/75.jpg' alt='@julesmartin' />
            <AvatarFallback>JM</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src='https://randomuser.me/api/portraits/men/11.jpg'
              alt='@samrivera'
            />
            <AvatarFallback>SR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage
              src='https://randomuser.me/api/portraits/women/68.jpg'
              alt='emma@example.com'
            />
            <AvatarFallback>EW</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+5</AvatarGroupCount>
        </AvatarGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label='Add'
              variant='outline'
              size='icon'
              className='rounded-control'
            >
              <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add user</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
