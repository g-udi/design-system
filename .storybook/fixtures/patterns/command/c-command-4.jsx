'use client';
import { Fragment, useState } from 'react';
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
} from '../../../../src/components/core/Commander/parts/command.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
// Enough groups to scroll: headings stay with their items, and shortcuts align on the right.
const groups = [
  {
    heading: 'Create',
    items: [
      ['PlusIcon', 'New Project', '⌘N'],
      ['FileTextIcon', 'New Document', '⇧⌘N'],
      ['UserPlusIcon', 'Invite Member', '⌘I']
    ]
  },
  {
    heading: 'Navigate',
    items: [
      ['HouseIcon', 'Go to Dashboard', '⌘D'],
      ['InboxIcon', 'Go to Inbox', '⇧⌘I'],
      ['FolderIcon', 'Go to Folders', '⌘F']
    ]
  },
  {
    heading: 'Edit',
    items: [
      ['CopyIcon', 'Copy', '⌘C'],
      ['ScissorsIcon', 'Cut', '⌘X'],
      ['ClipboardIcon', 'Paste', '⌘V'],
      ['TrashIcon', 'Delete', '⌫']
    ]
  },
  {
    heading: 'View',
    items: [
      ['LayoutGridIcon', 'Grid View'],
      ['ListIcon', 'List View'],
      ['ZoomInIcon', 'Zoom In', '⌘+'],
      ['ZoomOutIcon', 'Zoom Out', '⌘-']
    ]
  },
  {
    heading: 'Account',
    items: [
      ['UserIcon', 'Profile', '⌘P'],
      ['CreditCardIcon', 'Billing', '⌘B'],
      ['SettingsIcon', 'Settings', '⌘S'],
      ['MoonIcon', 'Toggle Dark Mode', '⇧⌘D'],
      ['LogOutIcon', 'Sign Out', '⌘Q']
    ]
  }
];
export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outline' tone='neutral'>
        Quick Actions
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder='What do you need?' />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            {groups.map((group, index) => (
              <Fragment key={group.heading}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup heading={group.heading}>
                  {group.items.map(([icon, label, shortcut]) => (
                    <CommandItem key={label}>
                      <RegistryIcon lucide={icon} />
                      <span>{label}</span>
                      {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
