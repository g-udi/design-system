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
  CommandSeparator
} from '../../../../src/components/core/CmdLauncher/parts/command.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outline'>
        Search Everything
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className='**:data-[selected=true]:bg-ui-muted **:data-selected:bg-transparent'>
          <CommandInput placeholder='Search or jump to...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Favorites'>
              <CommandItem>
                <RegistryIcon lucide='StarIcon' className='text-yellow-500' />
                <span>Design System</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='StarIcon' className='text-yellow-500' />
                <span>API Documentation</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Recent'>
              <CommandItem>
                <RegistryIcon
                  lucide='ClockIcon'
                  className='text-ui-muted-foreground'
                />
                <span>Dashboard Analytics</span>
                <div className='ml-auto' data-slot='command-shortcut'>
                  <span>2m ago</span>
                </div>
              </CommandItem>
              <CommandItem>
                <RegistryIcon
                  lucide='ClockIcon'
                  className='text-ui-muted-foreground'
                />
                <span>User Settings</span>
                <div className='ml-auto' data-slot='command-shortcut'>
                  <span>15m ago</span>
                </div>
              </CommandItem>
              <CommandItem>
                <RegistryIcon
                  lucide='ClockIcon'
                  className='text-ui-muted-foreground'
                />
                <div className='flex flex-1 items-center justify-between'>
                  <span>Team Members</span>
                  <div className='ml-auto' data-slot='command-shortcut'>
                    <span>1h ago</span>
                  </div>
                </div>
              </CommandItem>
              <CommandItem>
                <RegistryIcon
                  lucide='ClockIcon'
                  className='text-ui-muted-foreground'
                />
                <span>Billing & Plans</span>
                <div className='ml-auto' data-slot='command-shortcut'>
                  <span>2h ago</span>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Quick Links'>
              <CommandItem>
                <RegistryIcon lucide='BookOpenIcon' />
                <span>Documentation</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='LifeBuoyIcon' />
                <span>Help & Support</span>
              </CommandItem>
              <CommandItem>
                <RegistryIcon lucide='MessageSquareIcon' />
                <span>Contact Us</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
