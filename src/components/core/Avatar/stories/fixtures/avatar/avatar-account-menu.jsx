'use client';
import { useState } from 'react';
import Dialog from '@gaudi/design-system/core/Dialog';
import { Field, FieldInput, FieldLabel } from '@gaudi/design-system/core/Field';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuLabelPrimitive as DropdownMenuLabel,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
export function Pattern() {
  const [panel, setPanel] = useState(null);
  const [name, setName] = useState('Quentin Hale');
  const [signedIn, setSignedIn] = useState(true);
  const [team, setTeam] = useState(['Quentin Hale']);
  if (!signedIn) return <Button variant='outline' onClick={() => setSignedIn(true)}>Return to demo account</Button>;
  return (
    <><DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='rounded-control h-8 gap-1.5 pr-2.5 pl-1'
        >
          <Avatar className='border-ui-background size-6 border'>
            <AvatarImage
              src='/avatars/person-23.svg'
              alt=''
            />
            <AvatarFallback>QH</AvatarFallback>
          </Avatar>
          <span className='text-xs font-medium'>{name}</span>
          <RegistryIcon
            lucide='ChevronsUpDownIcon'
            className='size-3.5 opacity-60'
            aria-hidden='true'
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-44' align='center' sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Management</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setPanel('Profile')}>
            <RegistryIcon lucide='UserIcon' aria-hidden='true' />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPanel('Settings')}>
            <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => setPanel('Teams')}>
            <RegistryIcon lucide='UserIcon' aria-hidden='true' />
            <span>Teams</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPanel('Invite')}>
            <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
            <span>Invite</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onSelect={() => setSignedIn(false)}>
          <RegistryIcon lucide='LogOutIcon' aria-hidden='true' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {panel && <Dialog open onOpenChange={open => { if (!open) setPanel(null); }} title={panel} description={panel === 'Invite' ? 'Add a reader to this demo team.' : name + ' · Design team'}>
      {panel === 'Teams' ? <ul className='grid gap-2 text-sm'>{team.map(person => <li key={person}>{person}</li>)}</ul> : panel === 'Profile' ? <p className='text-sm'>{name} is a member of the Design team.</p> :
        <form className='grid gap-3' onSubmit={event => { event.preventDefault(); const value = String(new FormData(event.currentTarget).get('value')).trim(); if (!value) return;
          if (panel === 'Invite') setTeam(members => [...new Set([...members, value])]);
          else { setTeam(members => members.map(member => member === name ? value : member)); setName(value); }
          setPanel(panel === 'Invite' ? 'Teams' : 'Profile'); }}>
          <Field><FieldLabel htmlFor='avatar-account-field'>{panel === 'Invite' ? 'Reader name' : 'Display name'}</FieldLabel><FieldInput name='value' id='avatar-account-field' required defaultValue={panel === 'Settings' ? name : ''} /></Field>
          <Button type='submit' className='w-fit'>{panel === 'Invite' ? 'Add reader' : 'Save'}</Button>
        </form>}
    </Dialog>}</>
  );
}
