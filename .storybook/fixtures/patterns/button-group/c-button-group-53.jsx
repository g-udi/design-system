import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const viewers = [
  {
    src: 'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC',
    name: 'Sarah Chen'
  },
  {
    src: 'https://randomuser.me/api/portraits/men/32.jpg',
    initials: 'AJ',
    name: 'Alex Johnson'
  }
];
export function Pattern() {
  return (
    <div className='flex shrink-0 items-center gap-2'>
      <AvatarGroup>
        {viewers.map((viewer) => (
          <Avatar key={viewer.name} size='sm'>
            <AvatarImage src={viewer.src} alt={viewer.name} />
            <AvatarFallback>{viewer.initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>

      <Separator orientation='vertical' className='my-auto h-4' />

      <Button variant='outline' size='sm'>
        <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
        <span className='hidden md:block'>Preview</span>
      </Button>

      <ButtonGroup className='**:data-[slot=button]:border-r-0'>
        <Button size='sm'>
          <RegistryIcon lucide='SendIcon' aria-hidden='true' />
          Publish
        </Button>

        <ButtonGroupSeparator className='bg-ui-primary/72' />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size='icon-sm'
              className='border-ui-primary-foreground/20 rounded-l-none border-l'
              aria-label='More publish options'
            >
              <RegistryIcon lucide='ChevronDownIcon' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={8} align='end' className='w-48'>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='CalendarIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Schedule for later
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RegistryIcon
                  lucide='FileIcon'
                  className='size-4 opacity-60'
                  aria-hidden='true'
                />
                Save as draft
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' size='icon-sm' aria-label='More actions'>
            <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={8} align='end' className='w-40'>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RegistryIcon
                lucide='CopyIcon'
                className='size-4 opacity-60'
                aria-hidden='true'
              />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon
                lucide='HistoryIcon'
                className='size-4 opacity-60'
                aria-hidden='true'
              />
              View history
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon
                lucide='ArchiveIcon'
                className='size-4 opacity-60'
                aria-hidden='true'
              />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'>
              <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
