// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
export function Pattern() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true
  });
  const [theme, setTheme] = useState('light');
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-fit'>
            Complex Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>File</DropdownMenuLabel>
            <DropdownMenuItem>
              <RegistryIcon lucide='FileIcon' />
              New File
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RegistryIcon lucide='FolderOpenIcon' />
                Open Recent
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Project Alpha</DropdownMenuItem>
                  <DropdownMenuItem>Project Beta</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Browse…</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <RegistryIcon lucide='PaletteIcon' />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={setTheme}
                  >
                    <DropdownMenuRadioItem value='light'>
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='dark'>
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='system'>
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuCheckboxItem
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            >
              <RegistryIcon lucide='MailIcon' />
              Email Notifications
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>
            <RegistryIcon lucide='TrashIcon' />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
