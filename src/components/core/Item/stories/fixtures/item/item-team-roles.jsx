import { useState } from 'react';
import Link from '@gaudi/design-system/core/Link';
import { Badge } from '@gaudi/design-system/core/Pill';
import {
  AvatarRoot as Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '@gaudi/design-system/core/Item';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

// People rows: an avatar with presence, a role badge and a row menu, plus a
// pending invite whose action is a button instead.
const presence = { online: ['Online', 'bg-success'], away: ['Away', 'bg-warning'], offline: ['Offline', 'bg-ui-muted-foreground'] };
const members = [
  { name: 'Sabine Okafor', email: 'sabine@example.com', avatar: '/avatars/person-20.svg', role: 'Admin', roleVariant: 'default', presence: 'online' },
  { name: 'Anouk Varga', email: 'anouk@example.com', avatar: '/avatars/person-41.svg', role: 'Editor', roleVariant: 'info-light', presence: 'away' },
  { name: 'Juno Saarinen', email: 'juno@example.com', avatar: '/avatars/person-24.svg', role: 'Viewer', roleVariant: 'outline', presence: 'offline' },
  { name: 'Ottilie Nakamura', email: 'ottilie@example.com', avatar: '/avatars/person-50.svg', invited: true }
];
const initials = (name) => name.split(' ').map((part) => part[0]).join('');

export function Pattern() {
  const [people, setPeople] = useState(members);
  const [notice, setNotice] = useState('');
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        {people.map((member) => (
          <Item key={member.email} variant='outline' size='xs'>
            <ItemMedia>
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{initials(member.name)}</AvatarFallback>
                {member.presence ? (
                  <AvatarBadge className={presence[member.presence][1]}>
                    <span className='sr-only'>{presence[member.presence][0]}</span>
                  </AvatarBadge>
                ) : null}
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{member.name}</ItemTitle>
              <ItemDescription>{member.invited ? 'Invitation sent 2 days ago' : member.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              {member.invited ? (
                <Button variant='outline' size='sm' onClick={() => setNotice(`Invitation resent to ${member.name} in this demo.`)}>Resend</Button>
              ) : (
                <>
                  <Badge variant={member.roleVariant} size='sm'>{member.role}</Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='icon-sm'>
                        <RegistryIcon lucide='MoreHorizontalIcon' />
                        <span className='sr-only'>Actions for {member.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onSelect={() => setPeople((current) => current.map((person) => person.email === member.email ? { ...person, role: person.role === 'Viewer' ? 'Editor' : 'Viewer', roleVariant: 'outline' } : person))}>Change role</DropdownMenuItem>
                      <DropdownMenuItem asChild><Link variant='bare' href={`/team/${encodeURIComponent(member.email)}`}>View profile</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive' onSelect={() => { setPeople((current) => current.filter((person) => person.email !== member.email)); setNotice(`${member.name} removed from this demo.`); }}>Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
      <p role='status' className='text-xs text-text-muted'>{notice}</p>
      {people.length < members.length ? <Button variant='outline' size='sm' onClick={() => { setPeople(members); setNotice('Demo members restored.'); }}>Restore members</Button> : null}
    </div>
  );
}
