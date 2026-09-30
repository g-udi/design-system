// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const files = [
  {
    name: 'Q4 Financial Report.pdf',
    icon: (
      <RegistryIcon
        lucide='FileTextIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    ),
    size: '2.4 MB',
    owner: 'Sarah Chen',
    ownerAvatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    sharing: 'Team',
    sharingVariant: 'info-light',
    modified: '2 hours ago'
  },
  {
    name: 'Brand Guidelines',
    icon: (
      <RegistryIcon
        lucide='FolderIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    ),
    size: '\u2014',
    owner: 'Emily Park',
    ownerAvatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    sharing: 'Public',
    sharingVariant: 'success-light',
    modified: '1 day ago'
  },
  {
    name: 'Product Roadmap 2025.xlsx',
    icon: (
      <RegistryIcon
        lucide='FileSpreadsheetIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    ),
    size: '856 KB',
    owner: 'Marcus Johnson',
    ownerAvatar:
      'static/images/art/10.svg',
    sharing: 'Private',
    sharingVariant: 'outline',
    modified: '3 days ago'
  },
  {
    name: 'App Screenshots',
    icon: (
      <RegistryIcon
        lucide='ImageIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    ),
    size: '48.2 MB',
    owner: 'David Kim',
    ownerAvatar:
      'static/images/art/5.svg',
    sharing: 'Team',
    sharingVariant: 'info-light',
    modified: '1 week ago'
  },
  {
    name: 'Architecture Diagram.fig',
    icon: (
      <RegistryIcon
        lucide='PenToolIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    ),
    size: '12.8 MB',
    owner: 'Sofia Davis',
    ownerAvatar:
      'static/images/art/7.svg',
    sharing: 'Restricted',
    sharingVariant: 'warning-light',
    modified: '2 weeks ago'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Sharing</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className='text-right'>Modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.name}>
              <TableCell>
                <div className='flex items-center gap-3'>
                  {file.icon}
                  <span className='text-sm font-medium'>{file.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Avatar size='sm'>
                    <AvatarImage src={file.ownerAvatar} alt={file.owner} />
                    <AvatarFallback>
                      {file.owner
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className='text-sm'>{file.owner}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={file.sharingVariant} size='sm'>
                  {file.sharing}
                </Badge>
              </TableCell>
              <TableCell className='text-ui-muted-foreground text-sm'>
                {file.size}
              </TableCell>
              <TableCell className='text-ui-muted-foreground text-right text-sm'>
                {file.modified}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
