// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
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
            <ContextMenuItem>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem disabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              Save
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Save As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
