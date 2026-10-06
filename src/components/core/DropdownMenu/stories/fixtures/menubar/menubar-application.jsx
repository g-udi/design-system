'use client';
import { useState } from 'react';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const formats = [
  { id: 'strikethrough', label: 'Strikethrough' },
  { id: 'code', label: 'Code' },
  { id: 'highlight', label: 'Highlight (unavailable)', disabled: true }
];
// An editor menubar: icons, shortcuts, disabled items, submenus, checkboxes, a radio group and a destructive action.
export function Pattern() {
  const [marks, setMarks] = useState({ strikethrough: true, code: false });
  const [view, setView] = useState({ bookmarks: false, urls: true });
  const [theme, setTheme] = useState('system');
  return (
    <div className='flex items-center justify-center'>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <RegistryIcon lucide='FileIcon' />
              New file <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <RegistryIcon lucide='FolderIcon' />
              Open folder
            </MenubarItem>
            <MenubarItem disabled>New incognito window</MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                <RegistryIcon lucide='Share2Icon' />
                Share
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <RegistryIcon lucide='SaveIcon' />
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <RegistryIcon lucide='PrinterIcon' />
              Print… <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                <RegistryIcon lucide='SearchIcon' />
                Find
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Find…</MenubarItem>
                <MenubarItem>Find next</MenubarItem>
                <MenubarItem>Find previous</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>Cut</MenubarItem>
            <MenubarItem>Copy</MenubarItem>
            <MenubarItem>Paste</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <RegistryIcon lucide='BoldIcon' />
              Bold <MenubarShortcut>⌘B</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <RegistryIcon lucide='ItalicIcon' />
              Italic <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            {formats.map((item) => (
              <MenubarCheckboxItem
                key={item.id}
                disabled={item.disabled}
                checked={marks[item.id]}
                onCheckedChange={(checked) => setMarks((prev) => ({ ...prev, [item.id]: checked }))}
              >
                {item.label}
              </MenubarCheckboxItem>
            ))}
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>
                <RegistryIcon lucide='ImageIcon' />
                Insert media
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Image</MenubarItem>
                <MenubarItem>Video</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarItem>
              <RegistryIcon lucide='LinkIcon' />
              Link <MenubarShortcut>⌘K</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent className='w-56'>
            <MenubarCheckboxItem
              checked={view.bookmarks}
              onCheckedChange={(checked) => setView((prev) => ({ ...prev, bookmarks: checked }))}
            >
              Show bookmarks bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={view.urls}
              onCheckedChange={(checked) => setView((prev) => ({ ...prev, urls: checked }))}
            >
              Show full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarLabel>Theme</MenubarLabel>
              <MenubarRadioGroup value={theme} onValueChange={setTheme}>
                <MenubarRadioItem value='light'>Light</MenubarRadioItem>
                <MenubarRadioItem value='dark'>Dark</MenubarRadioItem>
                <MenubarRadioItem value='system'>System</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <RegistryIcon lucide='UserIcon' />
              Profile
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant='destructive'>
              <RegistryIcon lucide='LogOutIcon' />
              Sign out
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
