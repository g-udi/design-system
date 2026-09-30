'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const panels = [
  { id: 'statusBar', label: 'Status bar', icon: 'LayoutIcon' },
  { id: 'activityBar', label: 'Activity bar', icon: 'ActivityIcon', disabled: true },
  { id: 'sidePanel', label: 'Side panel', icon: 'PanelLeftIcon' }
];
const positions = [
  { value: 'top', label: 'Top', icon: 'ArrowUpIcon' },
  { value: 'bottom', label: 'Bottom', icon: 'ArrowDownIcon' },
  { value: 'right', label: 'Right', icon: 'ArrowRightIcon', disabled: true }
];
// Every item kind in one menu: labels, icons, shortcuts, a submenu, checkboxes, a radio group, disabled and destructive items.
export function Pattern() {
  const [visible, setVisible] = useState({ statusBar: true, activityBar: false, sidePanel: true });
  const [position, setPosition] = useState('bottom');
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-fit'>
            <RegistryIcon lucide='FileIcon' aria-hidden='true' />
            File
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='start'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='FileIcon' aria-hidden='true' />
              New file
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='CopyIcon' aria-hidden='true' />
              Duplicate
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RegistryIcon lucide='FolderOpenIcon' aria-hidden='true' />
                Open recent
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className='w-40'>
                  <DropdownMenuItem>Project Alpha</DropdownMenuItem>
                  <DropdownMenuItem>Project Beta</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Browse…</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem disabled>
              <RegistryIcon lucide='SendIcon' aria-hidden='true' />
              Publish
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            {panels.map((panel) => (
              <DropdownMenuCheckboxItem
                key={panel.id}
                checked={visible[panel.id]}
                disabled={panel.disabled}
                onCheckedChange={(checked) => setVisible((prev) => ({ ...prev, [panel.id]: checked }))}
                onSelect={(event) => event.preventDefault()}
              >
                <RegistryIcon lucide={panel.icon} aria-hidden='true' />
                {panel.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panel position</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              {positions.map((item) => (
                <DropdownMenuRadioItem key={item.value} value={item.value} disabled={item.disabled}>
                  <RegistryIcon lucide={item.icon} aria-hidden='true' />
                  {item.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
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
