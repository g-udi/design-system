import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
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
} from '../../../../src/components/blocks/ResourceList/parts/item.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const members = [
  {
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    role: 'Admin',
    roleVariant: 'default'
  },
  {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar:
      'static/images/art/10.svg',
    role: 'Editor',
    roleVariant: 'info-light'
  },
  {
    name: 'Emily Park',
    email: 'emily@example.com',
    avatar:
      'static/images/art/1.svg',
    role: 'Viewer',
    roleVariant: 'outline'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md flex-col'>
      <ItemGroup>
        {members.map((member, _index) => (
          <div key={member.email}>
            <Item variant='outline' size='xs'>
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{member.name}</ItemTitle>
                <ItemDescription>{member.email}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={member.roleVariant} size='sm'>
                  {member.role}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='ml-1 size-7'>
                      <RegistryIcon lucide='MoreHorizontalIcon' />
                      <span className='sr-only'>Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant='destructive'>
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          </div>
        ))}
      </ItemGroup>
    </div>
  );
}
