// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
'use client';
import { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/context-menu.jsx';
export function Pattern() {
  const [user, setUser] = useState('pedro');
  const [theme, setTheme] = useState('light');
  return (
    <div className='flex w-full items-center justify-center p-12'>
      <ContextMenu>
        <ContextMenuTrigger className='text-ui-muted-foreground rounded-lg flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm'>
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioGroup value={user} onValueChange={setUser}>
              <ContextMenuRadioItem value='pedro'>
                Pedro Duarte
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value='colm'>
                Colm Tuite
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Theme</ContextMenuLabel>
            <ContextMenuRadioGroup value={theme} onValueChange={setTheme}>
              <ContextMenuRadioItem value='light'>Light</ContextMenuRadioItem>
              <ContextMenuRadioItem value='dark'>Dark</ContextMenuRadioItem>
              <ContextMenuRadioItem value='system'>System</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
