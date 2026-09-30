// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const commands = [
  {
    icon: <RegistryIcon lucide='SearchIcon' />,
    label: 'Search',
    shortcut: '\u2318K'
  },
  {
    icon: <RegistryIcon lucide='PlusIcon' />,
    label: 'New File',
    shortcut: '\u2318N'
  },
  {
    icon: <RegistryIcon lucide='SaveIcon' />,
    label: 'Save',
    shortcut: '\u2318S'
  },
  {
    icon: <RegistryIcon lucide='SettingsIcon' />,
    label: 'Settings',
    shortcut: '\u2318,'
  },
  {
    icon: <RegistryIcon lucide='LogOutIcon' />,
    label: 'Sign Out',
    shortcut: '\u2318Q'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-64 flex-col gap-0.5'>
      {commands.map((cmd) => (
        <Item key={cmd.label} asChild size='xs'>
          <a href='#'>
            <ItemMedia variant='icon'>{cmd.icon}</ItemMedia>
            <ItemContent>
              <ItemTitle>{cmd.label}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Kbd>{cmd.shortcut}</Kbd>
            </ItemActions>
          </a>
        </Item>
      ))}
    </div>
  );
}
