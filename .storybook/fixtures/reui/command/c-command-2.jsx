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
            <CommandGroup heading='Settings'>
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
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
