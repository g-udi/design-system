import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const notifications = [
  {
    id: '1',
    user: 'Sarah',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    initials: 'SC',
    action: 'commented on',
    target: 'Design System v2',
    time: '2 min ago',
    unread: false
  },
  {
    id: '2',
    user: 'James Wilson',
    avatar:
      'static/images/art/9.svg',
    initials: 'JW',
    action: 'shared',
    target: 'Q4 Report',
    time: '1 hour ago',
    unread: true
  },
  {
    id: '3',
    user: 'Emily Davis',
    avatar:
      'static/images/art/1.svg',
    initials: 'ED',
    action: 'invited you to',
    target: 'Project Alpha',
    time: '3 hours ago',
    unread: false
  }
];
export function Pattern() {
  return (
    <div className='flex items-center justify-center'>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label='Notifications'
            variant='outline'
            size='icon'
            className='relative'
          >
            <RegistryIcon lucide='BellIcon' aria-hidden='true' />
            <Badge
              variant='destructive'
              size='sm'
              className='absolute -top-1.5 -right-2 rounded-control px-1'
              aria-hidden='true'
            >
              8
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-80' align='end' sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className='flex items-center justify-between'>
              <span>Notifications</span>
              <button className='text-ui-foreground text-xs font-normal underline-offset-2 hover:underline'>
                Mark all as read
              </button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className='flex items-start gap-2 py-1'
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
                      <span className='text-ui-muted-foreground'>
                        {notification.action}
                      </span>{' '}
                      <span className='font-medium'>{notification.target}</span>
                    </p>
                    <span className='text-ui-muted-foreground'>
                      {notification.time}
                    </span>
                  </div>
                  {notification.unread && (
                    <span className='bg-ui-primary mt-2 size-1.5 shrink-0 rounded-full' />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='justify-center'>
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
