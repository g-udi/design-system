// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const team = [
  { name: 'Shadcn', src: 'https://randomuser.me/api/portraits/men/32.jpg', fallback: 'CN' },
  { name: 'Max', src: 'https://randomuser.me/api/portraits/men/11.jpg', fallback: 'SR' },
  {
    name: 'Evil Rabbit',
    src: 'https://randomuser.me/api/portraits/women/68.jpg',
    fallback: 'ER'
  }
];
export function Pattern() {
  return (
    <ButtonGroup className='max-w-full overflow-x-auto'>
      {/* Team Context */}
      <Button variant='outline'>
        <RegistryIcon lucide='UsersIcon' aria-hidden='true' />
        <span>Team</span>
      </Button>

      {/* Active Members - Inspired by Avatar Patterns */}
      <ButtonGroupText className='gap-0 bg-transparent'>
        <AvatarGroup>
          {team.map((member) => (
            <Avatar key={member.name} className='size-5'>
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{member.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <div className='ml-2 flex items-center gap-1'>
          <span className='size-1.5 rounded-full bg-green-500' />
          <span className='text-ui-muted-foreground text-xs font-medium'>
            3 Live
          </span>
        </div>
      </ButtonGroupText>

      {/* Collaboration Actions */}
      <Button aria-label='Add' variant='outline' size='icon'>
        <RegistryIcon lucide='PlusIcon' aria-hidden='true' />
      </Button>
      <Button aria-label='View recent activity' variant='outline' size='icon'>
        <RegistryIcon lucide='ClockIcon' aria-hidden='true' />
      </Button>

      {/* Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label='More actions' variant='outline' size='icon'>
            <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='UserIcon' aria-hidden='true' />
              <span>Manage members</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
              <span>Team preferences</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <RegistryIcon lucide='ExternalLinkIcon' aria-hidden='true' />
            <span>Open dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}
