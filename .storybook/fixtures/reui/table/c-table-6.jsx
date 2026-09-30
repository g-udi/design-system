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
const members = [
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Admin',
    roleVariant: 'default',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@example.com',
    avatar:
      'static/images/art/10.svg',
    role: 'Developer',
    roleVariant: 'info-light',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'Emily Park',
    email: 'emily@example.com',
    avatar:
      'static/images/art/1.svg',
    role: 'Designer',
    roleVariant: 'warning-light',
    status: 'Away',
    statusVariant: 'warning-light'
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    avatar:
      'static/images/art/5.svg',
    role: 'Viewer',
    roleVariant: 'outline',
    status: 'Offline',
    statusVariant: 'outline'
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
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.email}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <Avatar size='sm'>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>
                          {member.name}
                        </span>
                        <span className='text-ui-muted-foreground text-xs'>
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.roleVariant} size='sm'>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.statusVariant} size='sm'>
                      {member.status}
                    </Badge>
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
