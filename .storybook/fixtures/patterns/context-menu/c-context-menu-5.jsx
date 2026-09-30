'use client';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/context-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const clipboard = [
  { label: 'Cut', icon: 'ScissorsIcon', shortcut: '⌘X' },
  { label: 'Copy', icon: 'CopyIcon', shortcut: '⌘C' },
  { label: 'Paste', icon: 'ClipboardIcon', shortcut: '⌘V', disabled: true }
];
const views = [
  { id: 'bookmarks', label: 'Show bookmarks bar' },
  { id: 'urls', label: 'Show full URLs' }
];
// Every item kind in one menu: labels, icons, shortcuts, a disabled item, a submenu, checkboxes, radios and a destructive action.
export function Pattern() {
  const [visible, setVisible] = useState({ bookmarks: true, urls: false });
  const [zoom, setZoom] = useState('100');
  return (
    <div className='flex w-full items-center justify-center'>
      <ContextMenu>
        <ContextMenuTrigger className='text-text-muted border-border flex h-32 w-full max-w-xs items-center justify-center rounded-lg border border-dashed text-sm'>
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent className='w-56'>
          <ContextMenuGroup>
            <ContextMenuLabel>Edit</ContextMenuLabel>
            {clipboard.map((item) => (
              <ContextMenuItem key={item.label} disabled={item.disabled}>
                <RegistryIcon lucide={item.icon} aria-hidden='true' />
                {item.label}
                <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
              </ContextMenuItem>
            ))}
            <ContextMenuSub>
              <ContextMenuSubTrigger>
                <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                More tools
              </ContextMenuSubTrigger>
              <ContextMenuSubContent className='w-44'>
                <ContextMenuItem>Save page…</ContextMenuItem>
                <ContextMenuItem>Create shortcut…</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer tools</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>View</ContextMenuLabel>
            {views.map((item) => (
              <ContextMenuCheckboxItem
                key={item.id}
                checked={visible[item.id]}
                onCheckedChange={(checked) => setVisible((prev) => ({ ...prev, [item.id]: checked }))}
              >
                {item.label}
              </ContextMenuCheckboxItem>
            ))}
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Zoom</ContextMenuLabel>
            <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
              {['75', '100', '150'].map((value) => (
                <ContextMenuRadioItem key={value} value={value}>
                  {value}%
                </ContextMenuRadioItem>
              ))}
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuItem variant='destructive'>
            <RegistryIcon lucide='TrashIcon' aria-hidden='true' />
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
