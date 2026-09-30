// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label='More actions' variant='outline' size='icon'>
            <RegistryIcon lucide='EllipsisVerticalIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-48' align='end'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='PencilIcon' aria-hidden='true' />
              Edit
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
              Duplicate
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RegistryIcon lucide='ArrowRightIcon' aria-hidden='true' />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='FolderIcon' aria-hidden='true' />
                    Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='ArchiveIcon' aria-hidden='true' />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RegistryIcon lucide='StarIcon' aria-hidden='true' />
                    Favorites
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <RegistryIcon lucide='Share2Icon' aria-hidden='true' />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='LinkIcon' aria-hidden='true' />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
