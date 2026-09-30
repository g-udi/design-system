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
    <div className='flex w-full items-center justify-center'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline'>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Organise files</DialogTitle>
            <DialogDescription>
              Right click the drop zone to act on the selection without leaving the dialog.
            </DialogDescription>
          </DialogHeader>
          <ContextMenu>
            <ContextMenuTrigger className='text-text-muted border-border flex h-24 w-full items-center justify-center rounded-lg border border-dashed text-sm'>
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
                <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
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
