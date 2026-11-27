'use client';
import { useState } from 'react';
import { Field, FieldLabel } from '@gaudi/design-system/core/Field';
import Textarea from '@gaudi/design-system/core/Textarea';
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
function AssigneeRow({ assignee, owner, onOwner, onRemove }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div>
          <Avatar size='sm'>
            <AvatarImage src={assignee.avatar} alt='' />
            <AvatarFallback>{assignee.initials}</AvatarFallback>
          </Avatar>
          <span>{assignee.name}</span>{owner && <Badge size='xs'>Owner</Badge>}
        </div>
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
            <DropdownMenuItem onSelect={onOwner} disabled={owner}>Make owner</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant='destructive' onSelect={onRemove}>Remove</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
function Inspector({ assignees, owner, setOwner, setAssignees }) {
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
          {assignees.length < ASSIGNEES.length && <DropdownMenu><DropdownMenuTrigger asChild><SidebarGroupAction type='button'>
            <RegistryIcon lucide='UserPlusIcon' aria-hidden='true' />
            <span className='sr-only'>Add assignee</span>
          </SidebarGroupAction></DropdownMenuTrigger><DropdownMenuContent>{ASSIGNEES.filter(person => !assignees.includes(person.id)).map(person => <DropdownMenuItem key={person.id} onSelect={() => setAssignees(list => [...list, person.id])}>{person.name}</DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>}
          <SidebarGroupContent>
            <SidebarMenu>
              {ASSIGNEES.filter(person => assignees.includes(person.id)).map((assignee) => (
                <AssigneeRow key={assignee.id} assignee={assignee} owner={owner === assignee.id} onOwner={() => setOwner(assignee.id)} onRemove={() => { setAssignees(list => list.filter(id => id !== assignee.id)); if (owner === assignee.id) setOwner(null); }} />
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
                    <div>
                      {entry.icon}
                      <span>{entry.label}</span>
                    </div>
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
                    <div>
                      {entry.icon}
                      <span className='min-w-0 flex-1 truncate'>
                        {entry.label}
                      </span>
                      <span className='text-ui-sidebar-foreground shrink-0 text-xs'>
                        {entry.time}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


    </Sidebar>
  );
}
function IssueView() {
  const [watching, setWatching] = useState(false);
  const [writing, setWriting] = useState(false);
  const [comments, setComments] = useState([]);
  return (
    <SidebarInset className='min-w-0 overflow-hidden'>
      <header className='flex h-12 shrink-0 items-center gap-2 border-b px-4'>
        <span className='text-ui-muted-foreground shrink-0 text-xs font-medium tabular-nums'>
          ENG-2481
        </span>
        <span className='ms-auto' />
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
          <Button variant='ghost' size='sm' aria-expanded={writing} onClick={() => setWriting(value => !value)}>
            <RegistryIcon lucide='MessageSquareIcon' aria-hidden='true' />
            Comment
          </Button>
          <Button variant='ghost' size='sm' aria-pressed={watching} onClick={() => setWatching(value => !value)}>
            <RegistryIcon lucide='EyeIcon' aria-hidden='true' />
            {watching ? 'Watching' : 'Watch'}
          </Button>
        </div>
        {writing && <form className='mt-3 grid max-w-lg gap-2' onSubmit={event => { event.preventDefault(); const text = String(new FormData(event.currentTarget).get('comment')).trim(); if (text) { setComments(list => [...list, text]); setWriting(false); } }}>
          <Field><FieldLabel htmlFor='inspector-comment'>Comment</FieldLabel><Textarea name='comment' id='inspector-comment' required /></Field><Button className='w-fit' size='sm' type='submit'>Post comment</Button>
        </form>}
        {comments.length > 0 && <ul aria-label='Comments' className='mt-4 grid gap-2 text-sm'>{comments.map((comment, i) => <li key={i}>{comment}</li>)}</ul>}
      </div>
    </SidebarInset>
  );
}
export function Pattern() {
  const [assignees, setAssignees] = useState(ASSIGNEES.map(person => person.id));
  const [owner, setOwner] = useState(null);
  return (
    <AppShellFrame>
      <SidebarProvider className='relative h-full min-h-0 w-full overflow-hidden'>
        <IssueView />
        <Inspector assignees={assignees} setAssignees={setAssignees} owner={owner} setOwner={setOwner} />
      </SidebarProvider>
    </AppShellFrame>
  );
}
