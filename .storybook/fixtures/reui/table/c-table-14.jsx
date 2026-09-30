// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Card,
  CardContent
} from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const issues = [
  {
    id: 'ISS-421',
    title: 'Login page returns 500 on mobile',
    priority: 'Critical',
    priorityVariant: 'destructive',
    priorityIcon: (
      <RegistryIcon
        lucide='ArrowUpIcon'
        className='size-3'
        aria-hidden='true'
      />
    ),
    label: 'Bug',
    labelVariant: 'destructive-light',
    assignee: 'Sarah Chen',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80',
    status: 'Open',
    statusVariant: 'info-light'
  },
  {
    id: 'ISS-420',
    title: 'Add dark mode support',
    priority: 'High',
    priorityVariant: 'warning',
    priorityIcon: (
      <RegistryIcon
        lucide='ArrowUpIcon'
        className='size-3'
        aria-hidden='true'
      />
    ),
    label: 'Feature',
    labelVariant: 'info-light',
    assignee: 'Marcus Johnson',
    assigneeAvatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    status: 'In Progress',
    statusVariant: 'warning-light'
  },
  {
    id: 'ISS-419',
    title: 'Update user onboarding flow',
    priority: 'Medium',
    priorityVariant: 'info',
    priorityIcon: (
      <RegistryIcon
        lucide='ArrowRightIcon'
        className='size-3'
        aria-hidden='true'
      />
    ),
    label: 'Improvement',
    labelVariant: 'success-light',
    assignee: 'Emily Park',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80',
    status: 'In Review',
    statusVariant: 'info-light'
  },
  {
    id: 'ISS-418',
    title: 'Refactor API rate limiter module',
    priority: 'Low',
    priorityVariant: 'secondary',
    priorityIcon: (
      <RegistryIcon
        lucide='ArrowDownIcon'
        className='size-3'
        aria-hidden='true'
      />
    ),
    label: 'Tech Debt',
    labelVariant: 'outline',
    assignee: 'David Kim',
    assigneeAvatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80',
    status: 'Closed',
    statusVariant: 'success-light'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Card className='p-0'>
        <CardContent className='overflow-x-auto p-0'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-20'>ID</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className='text-ui-muted-foreground font-mono text-xs'>
                    {issue.id}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <span className='truncate text-sm font-medium'>
                        {issue.title}
                      </span>
                      <Badge variant='outline' size='xs'>
                        {issue.label}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2'>
                      <Avatar size='sm'>
                        <AvatarImage
                          src={issue.assigneeAvatar}
                          alt={issue.assignee}
                        />
                        <AvatarFallback>
                          {issue.assignee
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className='text-sm'>{issue.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.statusVariant} size='sm'>
                      {issue.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
