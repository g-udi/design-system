'use client';
import { useState } from 'react';
import {
  getAvatarInitials,
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
  CommandSeparator
} from '@gaudi/design-system/core/Commander';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';
import Kbd from '@gaudi/design-system/core/Kbd';
import { Badge } from '@gaudi/design-system/core/Pill';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const searchKeys = ['mod+k', 'ctrl+k', 'meta+k'];
const favorites = ['Design System', 'API Documentation'];
const recent = [
  ['Dashboard Analytics', '2m ago'],
  ['User Settings', '15m ago'],
  ['Billing & Plans', '2h ago']
];
// The name already carries the extension, so the type shows as a tinted glyph instead of a badge.
const fileIcons = {
  css: ['PaletteIcon', 'text-accent'],
  json: ['FileJsonIcon', 'text-success'],
  md: ['FileTextIcon', 'text-text-muted'],
  tsx: ['FileCodeIcon', 'text-info']
};
const files = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/styles/globals.css',
  'src/components/ui/button.tsx',
  'package.json',
  'README.md'
];
const roles = { Admin: 'primary-light', Editor: 'info-light', Viewer: 'success-light' };
const people = [
  ['Anouk Varga', 'anouk@example.com', 'person-41', 'Admin'],
  ['Sabine Okafor', 'sabine@example.com', 'person-20', 'Editor'],
  ['Ottilie Nakamura', 'ottilie@example.com', 'person-45', 'Viewer'],
  ['Ilse Valtonen', 'ilse@example.com', 'person-24', 'Editor']
];
export function Pattern() {
  const [open, setOpen] = useState(false);
  const shortcut = useHotkey(searchKeys, () => setOpen((current) => !current), { preventDefault: true });
  return (
    <>
      <Button aria-keyshortcuts={shortcut.ariaKeyShortcuts} onClick={() => setOpen(true)} variant='outline' tone='neutral' className='w-56'>
        <RegistryIcon lucide='SearchIcon' className='size-4' />
        Search...
        <Kbd keys={shortcut.kbdKeys} size='xs' className='ml-auto' />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder='Search pages, files and people...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Favorites'>
              {favorites.map((label) => (
                <CommandItem key={label}>
                  <RegistryIcon lucide='StarIcon' className='text-warning' />
                  <span>{label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading='Recent'>
              {recent.map(([label, time]) => (
                <CommandItem key={label}>
                  <RegistryIcon lucide='ClockIcon' className='text-text-muted' />
                  <span>{label}</span>
                  <CommandShortcut className='min-w-0 truncate'>{time}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Files'>
              {files.map((path) => {
                const name = path.split('/').at(-1);
                const [icon, tone] = fileIcons[name.split('.').at(-1)];
                return (
                  <CommandItem key={path} value={path}>
                    <RegistryIcon lucide={icon} className={`shrink-0 ${tone}`} />
                    <span className='truncate font-medium'>{name}</span>
                    <CommandShortcut className='min-w-0 truncate'>{path.split('/').slice(0, -1).join('/') || 'root'}</CommandShortcut>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='People'>
              {people.map(([name, email, portrait, role]) => (
                <CommandItem key={email} value={`${name} ${email}`}>
                  <Avatar className='size-6 shrink-0'>
                    <AvatarImage src={`/avatars/${portrait}.svg`} alt={name} />
                    <AvatarFallback>
                      {getAvatarInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-1 flex-col'>
                    <span className='truncate font-medium'>{name}</span>
                    <span className='text-text-muted truncate text-xs'>{email}</span>
                  </div>
                  <Badge variant={roles[role]} size='sm'>
                    {role}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
