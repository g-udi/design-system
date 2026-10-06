'use client';
import { Badge } from '@gaudi/design-system/core/Pill';
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
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame } from '@gaudi/design-system/blocks/AppShell';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const ASSIGNEES = [
  {
    id: 'mara',
    name: 'Teo Kalnins',
    initials: 'TK',
    avatar:
      '/avatars/person-24.svg'
  },
  {
    id: 'tobias',
    name: 'Tobiah Reinholt',
    initials: 'TR',
    avatar:
      '/avatars/person-50.svg'
  },
  {
    id: 'priya',
    name: 'Priyanka Ramos',
    initials: 'PR',
    avatar:
      '/avatars/person-47.svg'
  }
];
const LINKED = [
  {
    id: 'subtasks',
    label: 'Sub-tasks',
    count: 6,
    icon: <RegistryIcon lucide='ListChecksIcon' aria-hidden='true' />
  },
  {
    id: 'pull-requests',
    label: 'Pull requests',
    count: 2,
    icon: <RegistryIcon lucide='GitPullRequestArrowIcon' aria-hidden='true' />
  },
  {
    id: 'incidents',
    label: 'Incidents',
    count: 1,
    icon: <RegistryIcon lucide='BugIcon' aria-hidden='true' />
  },
  {
    id: 'docs',
    label: 'Docs',
    count: 3,
    icon: <RegistryIcon lucide='BookOpenIcon' aria-hidden='true' />
  }
];
const ACTIVITY = [
  {
    id: 'review',
    label: 'Odile asked for edits',
    time: '2h',
    icon: <RegistryIcon lucide='MessageSquareIcon' aria-hidden='true' />
  },
  {
    id: 'deploy',
    label: 'Published to the preview site',
    time: '5h',
    icon: <RegistryIcon lucide='RocketIcon' aria-hidden='true' />
  },
  {
    id: 'assigned',
    label: 'Teo picked this up',
    time: 'Yesterday',
    icon: <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />
  }
];
function AssigneeRow({ assignee }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href='#'>
          <Avatar size='sm'>
            <AvatarImage src={assignee.avatar} alt='' />
            <AvatarFallback>{assignee.initials}</AvatarFallback>
          </Avatar>
          <span>{assignee.name}</span>
        </a>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            showOnHover
            aria-label={`Actions for ${assignee.name}`}
          >
            <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='left' align='start'>
          <DropdownMenuGroup>
            <DropdownMenuItem>Make owner</DropdownMenuItem>
            <DropdownMenuItem>Notify</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant='destructive'>Remove</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
function Inspector() {
  return (
    <Sidebar
      side='right'
      variant='floating'
      collapsible='offcanvas'
      className='absolute h-full'
    >
      <SidebarHeader>
        <div className='flex items-center gap-2'>
          <span className='truncate text-sm font-medium'>Details</span>
          <Badge variant='warning-light' className='ml-auto shrink-0'>
            In review
          </Badge>
        </div>
      </SidebarHeader>

      <SidebarContent role='complementary' aria-label='Issue details'>
        <SidebarGroup>
          <SidebarGroupLabel>Assignees</SidebarGroupLabel>
          <SidebarGroupAction type='button'>
            <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />
            <span className='sr-only'>Add assignee</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {ASSIGNEES.map((assignee) => (
                <AssigneeRow key={assignee.id} assignee={assignee} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Linked work</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {LINKED.map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      {entry.icon}
                      <span>{entry.label}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{entry.count}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Activity</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ACTIVITY.map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      {entry.icon}
                      <span className='min-w-0 flex-1 truncate'>
                        {entry.label}
                      </span>
                      <span className='text-ui-sidebar-foreground shrink-0 text-xs'>
                        {entry.time}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button variant='outline' size='sm' className='w-full'>
          Open in board
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
function IssueView() {
  return (
    <SidebarInset className='min-w-0 overflow-hidden'>
      <header className='flex h-12 shrink-0 items-center gap-2 border-b px-4'>
        <span className='text-ui-muted-foreground shrink-0 text-xs font-medium tabular-nums'>
          ENG-2481
        </span>
        <Button variant='outline' size='sm' className='ml-auto'>
          Share
        </Button>
        <SidebarTrigger />
      </header>

      <div className='min-w-0 flex-1 overflow-auto px-4 py-4'>
        <h1 className='text-base font-medium'>
          Retry failed webhook deliveries
        </h1>
        <p className='text-ui-muted-foreground mt-2 max-w-prose text-sm'>
          Deliveries that fail on a 5xx are dropped after the first attempt, so
          a customer whose endpoint restarts during a deploy never sees the
          event again.
        </p>
        <p className='text-ui-muted-foreground mt-2 max-w-prose text-sm'>
          Queue the failures and retry them with a backoff, then surface the
          attempt count on the delivery record.
        </p>

        <div className='mt-4 flex flex-wrap gap-2'>
          <Button variant='ghost' size='sm'>
            <RegistryIcon lucide='MessageSquareIcon' aria-hidden='true' />
            Comment
          </Button>
          <Button variant='ghost' size='sm'>
            <RegistryIcon lucide='PaperclipIcon' aria-hidden='true' />
            Attach
          </Button>
          <Button variant='ghost' size='sm'>
            <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
            Watch
          </Button>
        </div>
      </div>
    </SidebarInset>
  );
}
export function Pattern() {
  return (
    <AppShellFrame>
      <SidebarProvider className='relative h-full min-h-0 w-full overflow-hidden'>
        <IssueView />
        <Inspector />
      </SidebarProvider>
    </AppShellFrame>
  );
}
