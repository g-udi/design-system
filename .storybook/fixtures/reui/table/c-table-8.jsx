// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const projects = [
  {
    name: 'Website Redesign',
    description: 'Landing page and marketing site',
    status: 'In Progress',
    statusVariant: 'info-light',
    team: [
      {
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80',
        fallback: 'SC'
      },
      {
        src: 'https://randomuser.me/api/portraits/men/32.jpg',
        fallback: 'MJ'
      },
      {
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80',
        fallback: 'EP'
      }
    ],
    extra: 2,
    dueDate: 'Mar 15'
  },
  {
    name: 'Mobile App v2',
    description: 'iOS and Android release',
    status: 'Review',
    statusVariant: 'warning-light',
    team: [
      {
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80',
        fallback: 'DK'
      },
      {
        src: 'https://randomuser.me/api/portraits/women/44.jpg',
        fallback: 'SD'
      }
    ],
    extra: 0,
    dueDate: 'Apr 1'
  },
  {
    name: 'API Integration',
    description: 'Third-party payment gateway',
    status: 'Completed',
    statusVariant: 'success-light',
    team: [
      {
        src: 'https://randomuser.me/api/portraits/men/32.jpg',
        fallback: 'MJ'
      }
    ],
    extra: 0,
    dueDate: 'Feb 28'
  },
  {
    name: 'Analytics Dashboard',
    description: 'Real-time metrics and reporting',
    status: 'Planning',
    statusVariant: 'outline',
    team: [
      {
        src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80',
        fallback: 'SC'
      },
      {
        src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&dpr=2&q=80',
        fallback: 'DK'
      },
      {
        src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80',
        fallback: 'EP'
      }
    ],
    extra: 4,
    dueDate: 'May 10'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className='text-right'>Due</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <div className='bg-ui-muted rounded-sm flex size-8 shrink-0 items-center justify-center'>
                    <RegistryIcon
                      lucide='FolderIcon'
                      className='text-ui-muted-foreground size-4'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{project.name}</span>
                    <span className='text-ui-muted-foreground text-xs'>
                      {project.description}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={project.statusVariant} size='sm'>
                  {project.status}
                </Badge>
              </TableCell>
              <TableCell>
                <AvatarGroup>
                  {project.team.map((member) => (
                    <Avatar key={member.fallback} size='sm'>
                      <AvatarImage src={member.src} alt={member.fallback} />
                      <AvatarFallback>{member.fallback}</AvatarFallback>
                    </Avatar>
                  ))}
                  {project.extra > 0 && (
                    <AvatarGroupCount>
                      <span className='text-ui-muted-foreground text-[0.625rem]'>
                        +{project.extra}
                      </span>
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              </TableCell>
              <TableCell className='text-ui-muted-foreground text-right text-sm'>
                {project.dueDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
