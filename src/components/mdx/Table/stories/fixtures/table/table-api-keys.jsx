import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent
} from '@gaudi/design-system/core/Card';
import {
  TableRoot as Table,
  TableBodyPrimitive as TableBody,
  TableCellPrimitive as TableCell,
  TableHeadPrimitive as TableHead,
  TableHeader,
  TableRowPrimitive as TableRow
} from '@gaudi/design-system/mdx/Table';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const apiKeys = [
  {
    name: 'Production API',
    token: 'sk_live_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20224f3a',
    permissions: ['read', 'write'],
    lastUsed: '2 minutes ago',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'Staging API',
    token: 'sk_test_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20228b2c',
    permissions: ['read', 'write', 'admin'],
    lastUsed: '1 hour ago',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'CI/CD Pipeline',
    token: 'sk_ci_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20221d9e',
    permissions: ['read'],
    lastUsed: '3 days ago',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'Legacy Integration',
    token: 'sk_old_\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u20227a5f',
    permissions: ['read', 'write'],
    lastUsed: '30 days ago',
    status: 'Expired',
    statusVariant: 'destructive-light'
  }
];
const permissionVariant = {
  read: 'outline',
  write: 'info-light',
  admin: 'warning-light'
};
export function Pattern() {
  return (
    <Card className='mx-auto flex w-full max-w-2xl p-0'>
      <CardContent className='p-0'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.name}>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>{key.name}</span>
                    <span className='text-text-muted text-xs'>
                      Last used: {key.lastUsed}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className='bg-surface-muted rounded px-1.5 py-0.5 font-mono text-xs'>
                    {key.token}
                  </code>
                </TableCell>
                <TableCell>
                  <div className='flex gap-1'>
                    {key.permissions.map((perm) => (
                      <Badge
                        key={perm}
                        variant={permissionVariant[perm] ?? 'outline'}
                        size='xs'
                      >
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={key.statusVariant} size='sm'>
                    {key.status}
                  </Badge>
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-1'>
                    <Button variant='ghost' size='icon' className='size-7'>
                      <RegistryIcon
                        lucide='CopyIcon'
                        className='size-3.5'
                        aria-hidden='true'
                      />
                      <span className='sr-only'>Copy key</span>
                    </Button>
                    <Button variant='ghost' size='icon' className='size-7'>
                      <RegistryIcon
                        lucide='RotateCcwIcon'
                        className='size-3.5'
                        aria-hidden='true'
                      />
                      <span className='sr-only'>Regenerate key</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
