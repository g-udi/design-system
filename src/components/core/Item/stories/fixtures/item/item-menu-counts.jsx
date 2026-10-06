import Link from '@gaudi/design-system/core/Link';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { KbdRoot as Kbd } from '@gaudi/design-system/core/Kbd';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// Compact link rows whose trailing slot is a count badge or a keyboard shortcut.
const folders = [
  { icon: 'InboxIcon', label: 'Inbox', href: '/mail/inbox', count: 12 },
  { icon: 'FileIcon', label: 'Drafts', href: '/mail/drafts', count: 3 },
  { icon: 'SendIcon', label: 'Sent', href: '/mail/sent' },
  { icon: 'ArchiveIcon', label: 'Archive', href: '/mail/archive' }
];
const commands = [
  { icon: 'SearchIcon', label: 'Search', href: '/mail/search', shortcut: '⌘K' },
  { icon: 'PlusIcon', label: 'New message', href: '/mail/compose', shortcut: '⌘N' },
  { icon: 'SettingsIcon', label: 'Settings', href: '/settings', shortcut: '⌘,' },
  { icon: 'LogOutIcon', label: 'Sign out', href: '/sign-out', shortcut: '⌘Q' }
];

function Row({ icon, label, href, children }) {
  return (
    <Item asChild size='xs'>
      <Link variant='bare' href={href}>
        <ItemMedia variant='icon'>
          <RegistryIcon lucide={icon} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{label}</ItemTitle>
        </ItemContent>
        {children ? <ItemActions>{children}</ItemActions> : null}
      </Link>
    </Item>
  );
}

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-64 flex-col'>
      <ItemGroup className='gap-0.5'>
        {folders.map(({ icon, label, count, href }) => (
          <Row key={label} icon={icon} label={label} href={href}>
            {count ? <Badge variant='success-light' size='xs' className='rounded-control'>{count}</Badge> : null}
          </Row>
        ))}
        <ItemSeparator className='my-1' />
        {commands.map(({ icon, label, shortcut, href }) => (
          <Row key={label} icon={icon} label={label} href={href}>
            <Kbd>{shortcut}</Kbd>
          </Row>
        ))}
      </ItemGroup>
    </div>
  );
}
