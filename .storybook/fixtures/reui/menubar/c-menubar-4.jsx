// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '../../../../src/components/core/DropdownMenu/parts/menubar.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <RegistryIcon lucide='FileIcon' />
              New File <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <RegistryIcon lucide='FolderIcon' />
              Open Folder
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <RegistryIcon lucide='SaveIcon' />
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <RegistryIcon lucide='UserIcon' />
                Profile
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant='destructive'>
                <RegistryIcon lucide='LogOutIcon' />
                Sign out
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
