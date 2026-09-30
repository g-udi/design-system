// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../../../src/components/core/CmdLauncher/parts/command.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const files = [
  { name: 'page.tsx', path: 'src/app/page.tsx', type: 'tsx' },
  { name: 'layout.tsx', path: 'src/app/layout.tsx', type: 'tsx' },
  { name: 'globals.css', path: 'src/styles/globals.css', type: 'css' },
  { name: 'utils.ts', path: 'src/lib/utils.ts', type: 'ts' },
  { name: 'api.ts', path: 'src/lib/api.ts', type: 'ts' },
  { name: 'button.tsx', path: 'src/components/ui/button.tsx', type: 'tsx' },
  { name: 'package.json', path: 'package.json', type: 'json' },
  { name: 'README.md', path: 'README.md', type: 'md' }
];
export function Pattern() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outline' className='w-52'>
        <RegistryIcon lucide='SearchIcon' className='size-4' />
        Search files...
        <Kbd className='ml-auto'>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder='Search files by name...' />
          <CommandList>
            <CommandEmpty>No files found.</CommandEmpty>
            <CommandGroup heading='Files'>
              {files.map((file) => (
                <CommandItem key={file.path} className='gap-2.5'>
                  <RegistryIcon lucide='FileIcon' className='size-4 shrink-0' />
                  <div className='flex flex-1 items-center gap-2'>
                    <span className='font-medium'>{file.name}</span>
                    <span className='text-ui-muted-foreground truncate text-xs'>
                      {file.path}
                    </span>
                  </div>
                  <div className='ml-auto' data-slot='command-shortcut'>
                    <Badge variant='outline' size='sm'>
                      {file.type}
                    </Badge>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
