import { useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const notifications = [
  {
    id: '1',
    user: 'Sarah',
    avatar:
      '/avatars/person-20.svg',
    initials: 'SC',
    action: 'commented on',
    target: 'Design System v2',
    time: '2 min ago',
    unread: false
  },
  {
    id: '2',
    user: 'Felix Wainwright',
    avatar:
      'static/images/art/9.svg',
    initials: 'FW',
    action: 'shared',
    target: 'Q4 Report',
    time: '1 hour ago',
    unread: true
  },
  {
    id: '3',
    user: 'Juno Asante',
    avatar:
      'static/images/art/1.svg',
    initials: 'JA',
    action: 'invited you to',
    target: 'Project Alpha',
    time: '3 hours ago',
    unread: false
  }
];
export function Pattern() {
  const [unreadIds, setUnreadIds] = useState(() => notifications.filter((item) => item.unread).map((item) => item.id));
  const [message, setMessage] = useState('');
  return (
    <div className='flex flex-col items-center justify-center gap-2 pt-2'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={`Notifications, ${unreadIds.length} unread`}
            variant='outline'
            size='icon'
            className='relative'
          >
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            {unreadIds.length > 0 && <Badge
              variant='destructive'
              size='sm'
              className='absolute -top-1.5 -end-2 rounded-control px-1'
              aria-hidden='true'
            >
              {unreadIds.length}
            </Badge>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-80' align='end' sideOffset={8}>
          <DropdownMenuGroup>
            <div className='flex items-center justify-between gap-2'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuItem
                disabled={unreadIds.length === 0}
                className='text-xs'
                onSelect={() => {
                  setUnreadIds([]);
                  setMessage('All notifications marked as read.');
                }}
              >
                Mark all as read
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className='flex items-start gap-2 py-1'
                  onSelect={() => {
                    setUnreadIds((ids) => ids.filter((id) => id !== notification.id));
                    setMessage(`${notification.user} ${notification.action} ${notification.target}.`);
                  }}
                >
                  <Avatar className='mt-0.5 size-6 shrink-0'>
                    <AvatarImage
                      src={notification.avatar}
                      alt={notification.user}
                    />
                    <AvatarFallback>{notification.initials}</AvatarFallback>
                  </Avatar>
                  <div className='flex flex-1 flex-col gap-px'>
                    <p className='leading-snug'>
                      <span className='font-medium'>{notification.user}</span>{' '}
                      <span className='text-text-muted'>
                        {notification.action}
                      </span>{' '}
                      <span className='font-medium'>{notification.target}</span>
                    </p>
                    <span className='text-text-muted'>
                      {notification.time}
                    </span>
                  </div>
                  {unreadIds.includes(notification.id) && (
                    <span className='bg-accent mt-2 size-1.5 shrink-0 rounded-full' />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className='justify-center'>
              <Link href='/notifications' variant='bare'>View all notifications</Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <p role='status' className='text-xs text-text-muted'>{message}</p>
    </div>
  );
}
