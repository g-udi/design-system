import { default as Button } from '../../../../src/components/core/Button/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline'>
        <RegistryIcon lucide='MessageCircleIcon' aria-hidden='true' />
        <span>Conversation</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label='More actions' variant='outline' size='icon'>
            <RegistryIcon lucide='EllipsisVerticalIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-56'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='VolumeXIcon' aria-hidden='true' />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='CheckIcon' aria-hidden='true' />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='AlertTriangleIcon' aria-hidden='true' />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='UserRoundXIcon' aria-hidden='true' />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='UploadIcon' aria-hidden='true' />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant='destructive'>
              <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
