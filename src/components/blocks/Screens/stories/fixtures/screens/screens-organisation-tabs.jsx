'use client';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell } from '@gaudi/design-system/mdx/Table';
import { useState } from 'react';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldLabelPrimitive as FieldLabel
} from '@gaudi/design-system/core/Field';
import { Label } from '@gaudi/design-system/core/Field';
import { default as Input } from '@gaudi/design-system/core/Input';
import { SwitchRoot as Switch } from '@gaudi/design-system/core/Switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@gaudi/design-system/core/Tabs';
import {
  ToggleGroupRoot as ToggleGroup,
  ToggleGroupItem
} from '@gaudi/design-system/core/ToggleGroup';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const members = [
  ['Maya Lopez', 'person-23', 'Owner', 'Active'],
  ['Kerem Haddadin', 'person-43', 'Admin', 'Active'],
  ['Priyanka Nairn', 'person-14', 'Editor', 'Invited'],
  ['Lee Park', 'person-50', 'Viewer', 'Active']
];
// Each role grants a set of permissions; switching the role reloads the grid.
const permissionGroups = [
  { label: 'Content', items: ['Create documents', 'Publish', 'Delete documents', 'Export'] },
  { label: 'Workspace', items: ['Invite members', 'Manage billing', 'Edit integrations', 'View audit log'] }
];
const grants = {
  admin: ['Create documents', 'Publish', 'Delete documents', 'Export', 'Invite members', 'Manage billing', 'Edit integrations', 'View audit log'],
  editor: ['Create documents', 'Publish', 'Export', 'Invite members'],
  viewer: ['Export']
};
const integrations = [
  ['Google Workspace', 'Sign-in and directory sync', true],
  ['Okta', 'SAML single sign-on', false],
  ['Slack', 'Workspace notifications', true]
];

function Permissions() {
  const [role, setRole] = useState('editor');
  const [granted, setGranted] = useState(() => new Set(grants.editor));
  const pick = (next) => {
    if (!next) return;
    setRole(next);
    setGranted(new Set(grants[next]));
  };
  const toggle = (item, on) => setGranted((current) => {
    const next = new Set(current);
    on ? next.add(item) : next.delete(item);
    return next;
  });
  return (
    <div className='grid gap-4'>
      <ToggleGroup aria-label='Role' type='single' variant='outline' size='sm' spacing={0} value={role} onValueChange={pick} className='justify-self-start'>
        <ToggleGroupItem value='admin'>Admin</ToggleGroupItem>
        <ToggleGroupItem value='editor'>Editor</ToggleGroupItem>
        <ToggleGroupItem value='viewer'>Viewer</ToggleGroupItem>
      </ToggleGroup>
      <div className='grid gap-4 sm:grid-cols-2'>
        {permissionGroups.map((group) => (
          <fieldset key={group.label} className='grid gap-2 rounded-lg border p-3'>
            <legend className='px-1 text-xs font-medium text-text-muted'>{group.label}</legend>
            {group.items.map((item) => {
              const id = `perm-${item.replace(/\s+/g, '-').toLowerCase()}`;
              return (
                <div key={item} className='flex items-center justify-between gap-3'>
                  <Label htmlFor={id} className='font-normal'>{item}</Label>
                  <Switch id={id} size='sm' checked={granted.has(item)} onCheckedChange={(on) => toggle(item, on)} />
                </div>
              );
            })}
          </fieldset>
        ))}
      </div>
    </div>
  );
}

export function Pattern() {
  return (
    <Tabs defaultValue='members' className='bg-surface w-full max-w-3xl rounded-xl border p-5'>
      <div className='grid gap-1'>
        <h2 className='text-lg font-semibold'>Organisation</h2>
        <p className='text-text-muted text-sm'>Gaudi · 4 members</p>
      </div>
      <TabsList aria-label='Organisation settings' className='mt-2 w-full justify-start border-b'>
        <TabsTrigger value='profile'>Profile</TabsTrigger>
        <TabsTrigger value='members'>Members</TabsTrigger>
        <TabsTrigger value='permissions'>Permissions</TabsTrigger>
        <TabsTrigger value='integrations'>Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value='profile' className='grid gap-4 pt-3 sm:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='org-name'>Organisation name</FieldLabel>
          <Input id='org-name' defaultValue='Gaudi' />
        </Field>
        <Field>
          <FieldLabel htmlFor='org-domain'>Email domain</FieldLabel>
          <Input id='org-domain' defaultValue='northwind.io' />
          <FieldDescription>People with this domain can join without an invite.</FieldDescription>
        </Field>
      </TabsContent>
      <TabsContent value='members' className='pt-3'>
        <Table containerProps={{ role: 'region', 'aria-label': 'Organisation members', tabIndex: 0 }}>
          <TableHeader className='text-left'>
            <TableRow>
              <TableHead scope='col' >Member</TableHead>
              <TableHead scope='col' >Role</TableHead>
              <TableHead scope='col' >Status</TableHead>
              <TableHead scope='col' ><span className='sr-only'>Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map(([name, portrait, role, status]) => (
              <TableRow key={name} >
                <TableCell>
                  <span className='flex items-center gap-2'>
                    <Avatar size='sm'>
                      <AvatarImage src={`/avatars/${portrait}.svg`} alt={name} />
                      <AvatarFallback>{name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {name}
                  </span>
                </TableCell>
                <TableCell>{role}</TableCell>
                <TableCell><Badge size='sm' variant={status === 'Active' ? 'success-light' : 'warning-light'}>{status}</Badge></TableCell>
                <TableCell className='text-end'>
                  <Button size='xs' variant='ghost' aria-label={`Manage ${name}`}>
                    <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>
      <TabsContent value='permissions' className='pt-3'>
        <Permissions />
      </TabsContent>
      <TabsContent value='integrations' className='grid gap-2 pt-3'>
        {integrations.map(([name, purpose, connected]) => (
          <div key={name} className='flex items-center gap-3 rounded-lg border p-3'>
            <span className='grid flex-1 text-sm'>
              <span className='font-medium'>{name}</span>
              <span className='text-text-muted text-xs'>{purpose}</span>
            </span>
            {connected ? <Badge size='sm' variant='success-light'>Connected</Badge> : null}
            <Button size='sm' variant={connected ? 'outline' : 'default'}>{connected ? 'Configure' : 'Connect'}</Button>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}
