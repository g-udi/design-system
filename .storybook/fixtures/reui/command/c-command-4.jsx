// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '../../../../src/components/core/CmdLauncher/parts/command.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outline'>
        Open Command
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className='**:data-[selected=true]:bg-ui-muted **:data-selected:bg-transparent'>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Navigation'>
              <CommandItem>
                <RegistryIcon lucide='HouseIcon' />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='InboxIcon' />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='FileTextIcon' />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='FolderIcon' />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Actions'>
              <CommandItem>
                <RegistryIcon lucide='PlusIcon' />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='FolderPlusIcon' />
                <span>New Folder</span>
                <CommandShortcut>⇧⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='CopyIcon' />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='ScissorsIcon' />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='ClipboardIcon' />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='TrashIcon' />
                <span>Delete</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='View'>
              <CommandItem>
                <RegistryIcon lucide='LayoutGridIcon' />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='ListIcon' />
                <span>List View</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='ZoomInIcon' />
                <span>Zoom In</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='ZoomOutIcon' />
                <span>Zoom Out</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Account'>
              <CommandItem>
                <RegistryIcon lucide='UserIcon' />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='CreditCardIcon' />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='SettingsIcon' />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='BellIcon' />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='HelpCircleIcon' />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Tools'>
              <CommandItem>
                <RegistryIcon lucide='CalculatorIcon' />
                <span>Calculator</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='CalendarIcon' />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='ImageIcon' />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='CodeIcon' />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
