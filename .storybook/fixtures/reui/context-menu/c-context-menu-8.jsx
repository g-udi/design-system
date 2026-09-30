// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/context-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex w-full items-center justify-center p-12'>
      <ContextMenu>
        <ContextMenuTrigger className='text-ui-muted-foreground rounded-lg flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm'>
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              <RegistryIcon lucide='PencilIcon' />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <RegistryIcon lucide='UploadIcon' />
              Share
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <RegistryIcon lucide='ArchiveIcon' />
              Archive
            </ContextMenuItem>
            <ContextMenuItem variant='destructive'>
              <RegistryIcon lucide='TrashIcon' />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
