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
// The name already carries the extension, so the type shows as a tinted glyph instead of a badge.
const fileIcons = {
  css: { icon: 'PaletteIcon', tone: 'text-ui-primary' },
  json: { icon: 'FileJsonIcon', tone: 'text-success' },
  md: { icon: 'FileTextIcon', tone: 'text-ui-muted-foreground' },
  ts: { icon: 'FileCodeIcon', tone: 'text-info' },
  tsx: { icon: 'FileCodeIcon', tone: 'text-info' }
};
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
                <CommandItem key={file.path} value={file.path} className='gap-2.5'>
                  <RegistryIcon
                    lucide={fileIcons[file.type].icon}
                    className={`size-4 shrink-0 ${fileIcons[file.type].tone}`}
                  />
                  <span className='flex-1 truncate font-medium'>{file.name}</span>
                  <span className='text-ui-muted-foreground truncate text-xs'>
                    {file.path.split('/').slice(0, -1).join('/') || 'root'}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
