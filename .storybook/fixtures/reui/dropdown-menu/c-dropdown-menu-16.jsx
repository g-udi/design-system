// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const icons = {
  more: <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />,
  settings: <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />,
  share: <RegistryIcon lucide='Share2Icon' aria-hidden='true' />,
  trash: <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='-me-1.5'
          aria-label='More options'
        >
          {icons.more}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-36'>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {icons.settings}
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            {icons.share}
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            {icons.trash}
            Remove
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
