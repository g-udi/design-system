// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/context-menu.jsx';
export function Pattern() {
  return (
    <div className='flex w-full items-center justify-center p-12'>
      <ContextMenu>
        <ContextMenuTrigger className='text-ui-muted-foreground rounded-lg flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm'>
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>File</ContextMenuLabel>
            <ContextMenuItem>
              New File
              <ContextMenuShortcut>⌘N</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Open File
              <ContextMenuShortcut>⌘O</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Save
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Edit</ContextMenuLabel>
            <ContextMenuItem>
              Undo
              <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Redo
              <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              Cut
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Paste
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant='destructive'>
              Delete
              <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
