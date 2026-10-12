import { useState } from 'react';
import { useCopyToClipboard } from '@gaudi/design-system/hooks';
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
    token: 'demo_live_example_4f3a',
    permissions: ['read', 'write'],
    lastUsed: '2 minutes ago',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'Staging API',
    token: 'demo_test_example_8b2c',
    permissions: ['read', 'write', 'admin'],
    lastUsed: '1 hour ago',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'CI/CD Pipeline',
    token: 'demo_ci_example_1d9e',
    permissions: ['read'],
    lastUsed: '3 days ago',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    name: 'Legacy Integration',
    token: 'demo_old_example_7a5f',
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
  const [keys, setKeys] = useState(apiKeys);
  const [message, setMessage] = useState('Demo keys only. Regeneration changes local example data.');
  const { copy, copiedText, reset } = useCopyToClipboard({
    onCopy: () => setMessage('Demo key copied.'),
    onError: () => setMessage('Could not copy the key. Check clipboard permissions and try again.')
  });
  const regenerate = (name) => {
    const token = `demo_${crypto.randomUUID().replaceAll('-', '')}`;
    reset();
    setKeys((current) => current.map((key) => key.name === name
      ? { ...key, token, lastUsed: 'Never', status: 'Active', statusVariant: 'success-light' }
      : key));
    setMessage(`${name} demo key regenerated locally.`);
  };
  return (
    <Card className='mx-auto flex min-w-0 w-full max-w-2xl p-0'>
      <CardContent className='min-w-0 p-0'>
        <p role='status' className='px-4 py-3 text-sm text-text-muted'>{message}</p>
        <Table containerProps={{ role: 'region', 'aria-label': 'Demo API keys', tabIndex: 0 }}>
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
            {keys.map((key) => (
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
                    {`demo_••••••••${key.token.slice(-4)}`}
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
                    <Button variant='ghost' size='icon-sm' aria-label={`Copy ${key.name} key`} disabled={key.status === 'Expired'} onClick={() => copy(key.token)}>
                      <RegistryIcon
                        lucide={copiedText === key.token ? 'CheckIcon' : 'CopyIcon'}
                        className='size-3.5'
                        aria-hidden='true'
                      />
                    </Button>
                    <Button variant='ghost' size='icon-sm' aria-label={`Regenerate ${key.name} key`} onClick={() => regenerate(key.name)}>
                      <RegistryIcon
                        lucide='RotateCcwIcon'
                        className='size-3.5'
                        aria-hidden='true'
                      />
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
