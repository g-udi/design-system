'use client';
import { useState } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldDescription,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Label } from '../../../../src/components/core/Field/parts/label.jsx';
import { default as Input } from '../../../../src/components/core/Input/index.js';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../../../src/components/core/Tabs/index.js';
import {
  ToggleGroup,
  ToggleGroupItem
} from '../../../../src/components/core/ToggleGroup/parts/toggle-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const members = [
  ['Maya Lopez', 'women/65', 'Owner', 'Active'],
  ['Omar Haddad', 'men/41', 'Admin', 'Active'],
  ['Priya Nair', 'women/23', 'Editor', 'Invited'],
  ['Lee Park', 'men/75', 'Viewer', 'Active']
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
        <table className='w-full text-sm'>
          <thead className='text-text-muted text-left text-xs'>
            <tr>
              <th className='pb-2 font-medium'>Member</th>
              <th className='pb-2 font-medium'>Role</th>
              <th className='pb-2 font-medium'>Status</th>
              <th className='pb-2'><span className='sr-only'>Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {members.map(([name, portrait, role, status]) => (
              <tr key={name} className='border-t'>
                <td className='py-2'>
                  <span className='flex items-center gap-2'>
                    <Avatar size='sm'>
                      <AvatarImage src={`/avatars/${portrait}.jpg`} alt={name} />
                      <AvatarFallback>{name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {name}
                  </span>
                </td>
                <td className='py-2'>{role}</td>
                <td className='py-2'><Badge size='sm' variant={status === 'Active' ? 'success-light' : 'warning-light'}>{status}</Badge></td>
                <td className='py-2 text-end'>
                  <Button size='xs' variant='ghost' aria-label={`Manage ${name}`}>
                    <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
