'use client';
import { useState } from 'react';
import ToggleGroup from '@gaudi/design-system/core/ToggleGroup';
import { default as Button } from '@gaudi/design-system/core/Button';
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
} from '@gaudi/design-system/core/DropdownMenu';
import {
  DialogRoot as Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@gaudi/design-system/core/Dialog';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [files, setFiles] = useState(['Reading notes.md']);
  const [selected, setSelected] = useState('Reading notes.md');
  const [clipboard, setClipboard] = useState(null);
  const current = files.includes(selected) ? selected : files[0];
  const remove = () => setFiles(list => list.filter(name => name !== current));
  const add = base => {
    let suffix = 0;
    let name = base;
    while (files.includes(name)) name = base + ' (' + (++suffix) + ')';
    setFiles(list => [...list, name]); setSelected(name);
  };
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
            <ContextMenuTrigger tabIndex={0} className='text-text-muted border-border flex h-24 w-full items-center justify-center rounded-lg border border-dashed text-sm'>
              <span className='grid gap-1 text-center'><span>Right click here</span><span className='font-medium text-text'>{current || 'Empty folder'}</span></span>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuGroup>
                <ContextMenuItem disabled={!current} onSelect={() => setClipboard(current)}>
                  <RegistryIcon lucide='CopyIcon' />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem disabled={!current} onSelect={() => { setClipboard(current); remove(); }}>
                  <RegistryIcon lucide='ScissorsIcon' />
                  Cut
                </ContextMenuItem>
                <ContextMenuItem disabled={!clipboard} onSelect={() => add(clipboard)}>
                  <RegistryIcon lucide='ClipboardIcon' />
                  Paste
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem disabled={!current} onSelect={() => add(current)}>Duplicate file</ContextMenuItem>
                    <ContextMenuItem onSelect={() => add('Untitled.md')}>New document</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant='destructive' disabled={!current} onSelect={remove}>
                  <RegistryIcon lucide='TrashIcon' />
                  Delete
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
          {files.length > 0 && (
            <ToggleGroup
              label='Files' size='sm' spacing={2} value={current}
              options={files.map((name) => ({ value: name, label: name }))}
              onValueChange={(name) => name && setSelected(name)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
