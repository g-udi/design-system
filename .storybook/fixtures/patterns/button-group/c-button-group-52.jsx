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
  refresh: <RegistryIcon lucide='RefreshCwIcon' aria-hidden='true' />,
  share: <RegistryIcon lucide='Share2Icon' aria-hidden='true' />,
  more: <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />,
  pencil: <RegistryIcon lucide='PencilIcon' aria-hidden='true' />,
  fileText: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />,
  image: <RegistryIcon lucide='ImageIcon' aria-hidden='true' />
};
export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant='outline' size='sm' aria-label='Refresh'>
        {icons.refresh}
      </Button>
      <Button variant='outline' size='sm'>
        {icons.share}
        Share
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' aria-label='More options'>
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-44' sideOffset={9}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.pencil}
              Edit dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {icons.fileText}
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.image}
              Export PNG
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
