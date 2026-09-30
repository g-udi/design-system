import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
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
  filter: <RegistryIcon lucide='FilterIcon' aria-hidden='true' />,
  sort: <RegistryIcon lucide='ArrowUpDownIcon' aria-hidden='true' />,
  more: <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />,
  copy: <RegistryIcon lucide='CopyIcon' aria-hidden='true' />,
  share: <RegistryIcon lucide='Share2Icon' aria-hidden='true' />,
  download: <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />,
  settings: <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='sm' aria-label='Filter'>
        {icons.filter}
      </Button>
      <Button variant='outline' size='sm' aria-label='Sort'>
        {icons.sort}
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' aria-label='More options'>
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.copy}
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.share}
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.download}
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {icons.settings}
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
