// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/context-menu.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../src/components/core/Dialog/parts/dialog.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex w-full items-center justify-center p-12'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Context Menu Example</DialogTitle>
            <DialogDescription>
              Right click on the area below to see the context menu.
            </DialogDescription>
          </DialogHeader>
          <ContextMenu>
            <ContextMenuTrigger className='text-ui-muted-foreground rounded-lg flex aspect-[2/0.5] w-full items-center justify-center border border-dashed text-sm'>
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <RegistryIcon lucide='CopyIcon' />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem>
                  <RegistryIcon lucide='ScissorsIcon' />
                  Cut
                </ContextMenuItem>
                <ContextMenuItem>
                  <RegistryIcon lucide='ClipboardIcon' />
                  Paste
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem>Save Page...</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuItem>Name Window...</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant='destructive'>
                  <RegistryIcon lucide='TrashIcon' />
                  Delete
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </DialogContent>
      </Dialog>
    </div>
  );
}
