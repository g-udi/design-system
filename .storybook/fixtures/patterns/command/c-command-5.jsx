'use client';
import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
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
} from '../../../../src/components/core/Commander/parts/command.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
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
  ['Alex Johnson', 'alex@example.com', 'men/32', 'Admin'],
  ['Sarah Chen', 'sarah@example.com', 'women/44', 'Editor'],
  ['David Kim', 'david@example.com', 'men/49', 'Viewer'],
  ['Emma Wilson', 'emma@example.com', 'women/68', 'Editor']
];
// Trailing metadata uses the shortcut slot so it aligns right and dims like a shortcut.
const Meta = ({ children }) => (
  <span className='ml-auto truncate' data-slot='command-shortcut'>
    {children}
  </span>
);
export function Pattern() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant='outline' tone='neutral' className='w-56'>
        <RegistryIcon lucide='SearchIcon' className='size-4' />
        Search...
        <Kbd className='ml-auto'>⌘K</Kbd>
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
                  <Meta>{time}</Meta>
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
                    <Meta>{path.split('/').slice(0, -1).join('/') || 'root'}</Meta>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='People'>
              {people.map(([name, email, portrait, role]) => (
                <CommandItem key={email} value={`${name} ${email}`}>
                  <Avatar className='size-6 shrink-0'>
                    <AvatarImage src={`https://randomuser.me/api/portraits/${portrait}.jpg`} alt={name} />
                    <AvatarFallback>
                      {name.split(' ').map((part) => part[0]).join('')}
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
