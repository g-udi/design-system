import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const Icon = ({ name }) => <RegistryIcon lucide={name} aria-hidden='true' />;
const count = 'rounded-md border border-border px-2.5 text-xs text-text-muted tabular-nums';
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-lg flex-wrap items-center gap-2'>
      <ButtonGroup aria-label='Like'>
        <Button variant='outline'><Icon name='HeartIcon' />Like</Button>
        <ButtonGroupText className={count}>1.2K</ButtonGroupText>
      </ButtonGroup>
      <ButtonGroup aria-label='Star'>
        <Button variant='outline'>
          <Icon name='StarIcon' />
          Star
          <Badge variant='secondary'>2.4k</Badge>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='icon' aria-label='Repository actions'><Icon name='ChevronDownIcon' /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='min-w-40'>
            <DropdownMenuItem><Icon name='EyeIcon' />Watch</DropdownMenuItem>
            <DropdownMenuItem><Icon name='GitForkIcon' />Fork</DropdownMenuItem>
            <DropdownMenuItem><Icon name='ListPlusIcon' />Add to list</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Icon name='BellIcon' />Notifications</DropdownMenuItem>
            <DropdownMenuItem><Icon name='FlagIcon' />Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup aria-label='Follow'>
        <Button size='sm' variant='outline'><Icon name='UserPlusIcon' />Follow</Button>
        <ButtonGroupText className={count}>2.4k followers</ButtonGroupText>
      </ButtonGroup>
      <ButtonGroup aria-label='Share'>
        <Button size='sm'><Icon name='Share2Icon' />Share</Button>
        <ButtonGroupText className='rounded-md border border-accent px-2.5 text-xs font-medium text-accent tabular-nums'>128</ButtonGroupText>
      </ButtonGroup>
      <ButtonGroup aria-label='Attachment'>
        <Button variant='outline' size='xs'>
          <Icon name='PaperclipIcon' />
          Q4-Product-Roadmap.pdf
          <span className='text-text-muted'>2.4 MB</span>
        </Button>
        <Button variant='outline' size='icon-xs' aria-label='Download attachment'><Icon name='DownloadIcon' /></Button>
      </ButtonGroup>
    </div>
  );
}
