// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Frame,
  FramePanel
} from '../../../../src/components/core/Card/parts/frame-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
const activities = [
  {
    user: 'Sarah Chen',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    action: 'Deployed',
    target: 'production',
    badge: 'success',
    timestamp: '2 minutes ago'
  },
  {
    user: 'Marcus Johnson',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    action: 'Merged',
    target: 'feat/auth-flow',
    badge: 'info',
    timestamp: '15 minutes ago'
  },
  {
    user: 'Emily Park',
    avatar:
      'static/images/art/1.svg',
    action: 'Commented',
    target: 'PR #284',
    badge: 'outline',
    timestamp: '1 hour ago'
  },
  {
    user: 'David Kim',
    avatar:
      'static/images/art/5.svg',
    action: 'Reverted',
    target: 'hotfix/api-crash',
    badge: 'destructive',
    timestamp: '3 hours ago'
  },
  {
    user: 'Sofia Davis',
    avatar:
      'static/images/art/7.svg',
    action: 'Created',
    target: 'issue #512',
    badge: 'secondary',
    timestamp: '5 hours ago'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Frame spacing='xs'>
        <FramePanel className='p-0!'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className='text-right'>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar size='sm'>
                        <AvatarImage
                          src={activity.avatar}
                          alt={activity.user}
                        />
                        <AvatarFallback>
                          {activity.user
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm font-medium'>
                        {activity.user}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={activity.badge} size='sm'>
                      {activity.action}
                    </Badge>
                  </TableCell>
                  <TableCell className='font-mono text-sm'>
                    {activity.target}
                  </TableCell>
                  <TableCell className='text-ui-muted-foreground text-right text-sm'>
                    {activity.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>
    </div>
  );
}
