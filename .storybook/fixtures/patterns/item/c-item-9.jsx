import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle
} from '../../../../src/components/core/Item/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

// People rows: an avatar with presence, a role badge and a row menu, plus a
// pending invite whose action is a button instead.
const presence = { online: ['Online', 'bg-success'], away: ['Away', 'bg-warning'], offline: ['Offline', 'bg-ui-muted-foreground'] };
const members = [
  { name: 'Sarah Chen', email: 'sarah@example.com', avatar: '/avatars/women/44.jpg', role: 'Admin', roleVariant: 'default', presence: 'online' },
  { name: 'Alex Johnson', email: 'alex@example.com', avatar: '/avatars/men/32.jpg', role: 'Editor', roleVariant: 'info-light', presence: 'away' },
  { name: 'Emily Park', email: 'emily@example.com', avatar: '/avatars/women/68.jpg', role: 'Viewer', roleVariant: 'outline', presence: 'offline' },
  { name: 'David Kim', email: 'david@example.com', avatar: '/avatars/men/75.jpg', invited: true }
];
const initials = (name) => name.split(' ').map((part) => part[0]).join('');

export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        {members.map((member) => (
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
                <Button variant='outline' size='sm'>Resend</Button>
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
                      <DropdownMenuItem>Change role</DropdownMenuItem>
                      <DropdownMenuItem>View profile</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant='destructive'>Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
