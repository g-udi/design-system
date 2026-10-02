import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from '../../../../src/components/core/Item/parts/item.jsx';
import { Kbd } from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// Compact link rows whose trailing slot is a count badge or a keyboard shortcut.
const folders = [
  { icon: 'InboxIcon', label: 'Inbox', count: 12 },
  { icon: 'FileIcon', label: 'Drafts', count: 3 },
  { icon: 'SendIcon', label: 'Sent' },
  { icon: 'ArchiveIcon', label: 'Archive' }
];
const commands = [
  { icon: 'SearchIcon', label: 'Search', shortcut: '⌘K' },
  { icon: 'PlusIcon', label: 'New message', shortcut: '⌘N' },
  { icon: 'SettingsIcon', label: 'Settings', shortcut: '⌘,' },
  { icon: 'LogOutIcon', label: 'Sign out', shortcut: '⌘Q' }
];

function Row({ icon, label, children }) {
  return (
    <Item asChild size='xs'>
      <a href='#'>
        <ItemMedia variant='icon'>
          <RegistryIcon lucide={icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{label}</ItemTitle>
        </ItemContent>
        {children ? <ItemActions>{children}</ItemActions> : null}
      </a>
    </Item>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-64 flex-col'>
      <ItemGroup className='gap-0.5'>
        {folders.map(({ icon, label, count }) => (
          <Row key={label} icon={icon} label={label}>
            {count ? <Badge variant='success-light' size='xs' className='rounded-control'>{count}</Badge> : null}
          </Row>
        ))}
        <ItemSeparator className='my-1' />
        {commands.map(({ icon, label, shortcut }) => (
          <Row key={label} icon={icon} label={label}>
            <Kbd>{shortcut}</Kbd>
          </Row>
        ))}
      </ItemGroup>
    </div>
  );
}
