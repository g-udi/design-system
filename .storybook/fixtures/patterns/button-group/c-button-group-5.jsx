import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  ButtonGroup,
  ButtonGroupSeparator,
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
const Icon = ({ name, className }) => <RegistryIcon lucide={name} aria-hidden='true' className={className} />;
const team = [
  { name: 'Alex Johnson', src: '/avatars/men/32.jpg', fallback: 'AJ' },
  { name: 'Sarah Chen', src: '/avatars/women/44.jpg', fallback: 'SC' },
  { name: 'Emma Wilson', src: '/avatars/women/68.jpg', fallback: 'EW' }
];
const branches = ['main', 'develop', 'feature/auth'];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-wrap items-center gap-2'>
      <ButtonGroup aria-label='Branch'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline'>
              <Icon name='GitMergeIcon' />
              main
              <Icon name='ChevronDownIcon' className='size-3.5 opacity-60' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' className='w-48'>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Switch branch</DropdownMenuLabel>
              {branches.map((branch) => (
                <DropdownMenuItem key={branch}>
                  <Icon name='GitBranchIcon' />
                  {branch}
                  {branch === 'main' ? <Icon name='CheckIcon' className='ml-auto size-3.5 text-accent' /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <ButtonGroupText className='gap-1.5 border border-border px-2.5 text-xs text-text-muted'>
          <span className='size-1.5 animate-pulse rounded-full bg-success' />
          Production
        </ButtonGroupText>
        <Button variant='outline' size='icon' aria-label='Refresh'><Icon name='RefreshCwIcon' /></Button>
      </ButtonGroup>

      <ButtonGroup aria-label='Team'>
        <ButtonGroupText className='gap-2 border border-border px-2'>
          <AvatarGroup>
            {team.map((member) => (
              <Avatar key={member.name} className='size-5'>
                <AvatarImage src={member.src} alt={member.name} />
                <AvatarFallback>{member.fallback}</AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
          <span className='text-xs font-medium text-text-muted'>3 live</span>
        </ButtonGroupText>
        <Button variant='outline' size='icon' aria-label='Invite'><Icon name='PlusIcon' /></Button>
        <Button variant='outline' size='icon' aria-label='View recent activity'><Icon name='ClockIcon' /></Button>
      </ButtonGroup>

      <div className='flex items-center gap-2'>
        <Button variant='outline'><Icon name='EyeIcon' />Preview</Button>
        <ButtonGroup aria-label='Publish' className='**:data-[slot=button]:border-x-0'>
          <Button><Icon name='SendIcon' />Publish</Button>
          <ButtonGroupSeparator className='bg-ui-primary-foreground/20' />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' aria-label='More publish options'><Icon name='ChevronDownIcon' /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem><Icon name='CalendarIcon' />Schedule for later</DropdownMenuItem>
              <DropdownMenuItem><Icon name='FileIcon' />Save as draft</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' aria-label='More actions'><Icon name='MoreHorizontalIcon' /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuGroup>
              <DropdownMenuItem><Icon name='UserIcon' />Manage members</DropdownMenuItem>
              <DropdownMenuItem><Icon name='CopyIcon' />Duplicate</DropdownMenuItem>
              <DropdownMenuItem><Icon name='HistoryIcon' />View history</DropdownMenuItem>
              <DropdownMenuItem><Icon name='ArchiveIcon' />Archive</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive'><Icon name='TrashIcon' />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
