import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import {
  TableRoot as Table,
  TableBodyPrimitive as TableBody,
  TableCellPrimitive as TableCell,
  TableHeadPrimitive as TableHead,
  TableHeader,
  TableRowPrimitive as TableRow
} from '@gaudi/design-system/mdx/Table';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const projects = [
  {
    name: 'Website Redesign',
    description: 'New home page and newsletter signup',
    status: 'In Progress',
    statusVariant: 'info-light',
    team: [
      {
        src: '/avatars/person-41.svg',
        fallback: 'SC'
      },
      {
        src: '/avatars/person-20.svg',
        fallback: 'MJ'
      },
      {
        src: '/avatars/person-41.svg',
        fallback: 'EP'
      }
    ],
    extra: 2,
    dueDate: 'Mar 15'
  },
  {
    name: 'Mobile App v2',
    description: 'Offline reading on phones',
    status: 'Review',
    statusVariant: 'warning-light',
    team: [
      {
        src: '/avatars/person-23.svg',
        fallback: 'DK'
      },
      {
        src: '/avatars/person-47.svg',
        fallback: 'SD'
      }
    ],
    extra: 0,
    dueDate: 'Apr 1'
  },
  {
    name: 'API Integration',
    description: 'Paid memberships at checkout',
    status: 'Completed',
    statusVariant: 'success-light',
    team: [
      {
        src: '/avatars/person-25.svg',
        fallback: 'MJ'
      }
    ],
    extra: 0,
    dueDate: 'Feb 28'
  },
  {
    name: 'Analytics Dashboard',
    description: 'Reader statistics for each post',
    status: 'Planning',
    statusVariant: 'outline',
    team: [
      {
        src: '/avatars/person-43.svg',
        fallback: 'SC'
      },
      {
        src: '/avatars/person-19.svg',
        fallback: 'DK'
      },
      {
        src: '/avatars/person-38.svg',
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
                  <div className='bg-surface-muted rounded-sm flex size-8 shrink-0 items-center justify-center'>
                    <RegistryIcon
                      lucide='FolderIcon'
                      className='text-text-muted size-4'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{project.name}</span>
                    <span className='text-text-muted text-xs'>
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
                      <span className='text-text-muted text-xs'>
                        +{project.extra}
                      </span>
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>
              </TableCell>
              <TableCell className='text-text-muted text-right text-sm'>
                {project.dueDate}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
