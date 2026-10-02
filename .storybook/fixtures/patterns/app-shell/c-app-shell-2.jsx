'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { ProgressRing } from '../../../../src/components/core/Progress/parts/progress-ring.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../src/components/core/Tabs/index.js';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { AgentMark } from '../../../../src/components/chat/AgentMark/index.js';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const projects = [
  { id: 'redesign', label: 'Reader app redesign', done: 72 },
  { id: 'newsletter', label: 'Newsletter relaunch', done: 45 },
  { id: 'archive', label: 'Archive migration', done: 90 },
  { id: 'podcast', label: 'Podcast season 3', done: 18 }
];
const members = [
  { name: 'Priya Natarajan', avatar: 'women/44', status: 'online' },
  { name: 'Tom Becker', avatar: 'men/32', status: 'online' },
  { name: 'Ana Ruiz', avatar: 'women/68', status: 'away' },
  { name: 'Li Wei', avatar: 'men/75', status: 'offline' }
];
const agents = [
  { id: 'research', name: 'Research agent', task: 'Summarising 14 reader interviews', progress: 64, state: 'streaming' },
  { id: 'editor', name: 'Copy editor', task: 'Checking style on 3 drafts', progress: 30, state: 'thinking' },
  { id: 'publisher', name: 'Publisher', task: 'Scheduled the Friday issue', progress: 100, state: 'done' }
];
const feed = {
  mentions: [{ id: 'm1', who: 'Priya Natarajan', avatar: 'women/44', text: 'mentioned you in “Reader app redesign”', when: '6m' }],
  system: [{ id: 's1', text: 'Archive migration finished 2 of 3 batches', when: '20m' }, { id: 's2', text: 'Research agent needs approval to spend 4 credits', when: '1h' }],
  invites: [{ id: 'i1', who: 'Ana Ruiz', avatar: 'women/68', text: 'invited you to “Podcast season 3”', when: '2h' }]
};
const presence = { online: 'bg-success', away: 'bg-warning', offline: 'bg-text-subtle' };

function NotificationsPopover() {
  const all = [...feed.mentions, ...feed.system, ...feed.invites];
  const row = (item) => (
    <li key={item.id} className='flex gap-3 px-3 py-2.5 text-sm'>
      {item.avatar ? (
        <Avatar className='size-7'><AvatarImage src={`https://randomuser.me/api/portraits/${item.avatar}.jpg`} alt='' /><AvatarFallback>{item.who[0]}</AvatarFallback></Avatar>
      ) : (
        <AgentMark name='Gaudi' size='sm' decorative />
      )}
      <p className='min-w-0 flex-1'>
        {item.who ? <span className='font-medium'>{item.who} </span> : null}
        <span className='text-text-muted'>{item.text}</span>
        <span className='text-text-muted block text-xs'>{item.when} ago</span>
      </p>
    </li>
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='icon-sm' variant='ghost' tone='neutral' aria-label={`Notifications, ${all.length} new`} className='relative'>
          <RegistryIcon lucide='Bell' className='size-4' aria-hidden='true' />
          <span aria-hidden='true' className='bg-accent text-accent-foreground absolute -top-0.5 -end-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-xs leading-none font-semibold tabular-nums'>{all.length}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-80 p-0'>
        <Tabs defaultValue='all'>
          <TabsList variant='line' className='w-full justify-start border-b px-2'>
            <TabsTrigger value='all'>All</TabsTrigger>
            <TabsTrigger value='mentions'>Mentions</TabsTrigger>
            <TabsTrigger value='system'>System</TabsTrigger>
            <TabsTrigger value='invites'>Invites</TabsTrigger>
          </TabsList>
          <TabsContent value='all'><ul className='divide-y'>{all.map(row)}</ul></TabsContent>
          {Object.entries(feed).map(([key, items]) => <TabsContent key={key} value={key}><ul className='divide-y'>{items.map(row)}</ul></TabsContent>)}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}

export function Pattern() {
  const [active, setActive] = useState('redesign');
  const project = projects.find((entry) => entry.id === active) || projects[0];
  return (
    <SidebarProvider shortcut={false} className='bg-surface-muted relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border'>
      <Sidebar variant='inset' collapsible='icon' className='absolute h-full'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' tooltip='Gaudi Studio'>
                <span className='bg-accent text-accent-foreground grid size-8 shrink-0 place-items-center rounded-(--ds-radius-control)'><RegistryIcon lucide='Layers' className='size-4' aria-hidden='true' /></span>
                <span className='grid min-w-0 text-start leading-tight'><span className='truncate text-sm font-medium'>Gaudi Studio</span><span className='text-text-muted truncate text-xs'>4 active projects</span></span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((entry) => (
                  <SidebarMenuItem key={entry.id}>
                    <SidebarMenuButton tooltip={`${entry.label}, ${entry.done}% done`} isActive={entry.id === active} aria-current={entry.id === active ? 'page' : undefined} onClick={() => setActive(entry.id)}>
                      <ProgressRing value={entry.done} size='xs' tone={entry.done >= 90 ? 'success' : 'accent'} label={`${entry.label} completion`} />
                      <span>{entry.label}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>{entry.done}%</SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Agents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {agents.map((agent) => (
                  <SidebarMenuItem key={agent.id}>
                    <SidebarMenuButton tooltip={`${agent.name}: ${agent.task}`}>
                      <AgentMark name={agent.name} seed={agent.id} size='xs' state={agent.state} decorative />
                      <span>{agent.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <p className='text-text-muted px-2 text-xs group-data-[collapsible=icon]:sr-only'>Here now</p>
          <ul className='flex flex-wrap gap-1.5 px-1 group-data-[collapsible=icon]:flex-col' aria-label='Team presence'>
            {members.map((member) => (
              <li key={member.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span tabIndex={0} className='relative block rounded-full'>
                      <Avatar className='size-7'><AvatarImage src={`https://randomuser.me/api/portraits/${member.avatar}.jpg`} alt='' /><AvatarFallback>{member.name[0]}</AvatarFallback></Avatar>
                      <span aria-hidden='true' className={`ring-surface absolute -end-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ${presence[member.status]}`} />
                      <span className='sr-only'>{`${member.name}, ${member.status}`}</span>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side='right'>{member.name} · {member.status}</TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='bg-surface min-h-0 min-w-0 md:my-2 md:me-2 md:rounded-(--ds-radius-card) md:border'>
        <header className='flex h-14 shrink-0 items-center gap-2 border-b px-3'>
          <SidebarTrigger />
          <h1 className='min-w-0 truncate text-sm font-medium'>{project.label}</h1>
          <div className='ms-auto flex items-center gap-1'>
            <NotificationsPopover />
            <Button size='sm'><RegistryIcon lucide='Plus' className='size-4' aria-hidden='true' />New task</Button>
          </div>
        </header>
        <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
          <section aria-labelledby='project-progress' className='flex flex-wrap items-center gap-6 rounded-(--ds-radius-card) border p-4'>
            <ProgressRing value={project.done} size='md' showValue tone={project.done >= 90 ? 'success' : 'accent'} label={`${project.label} completion`} />
            <div className='min-w-0 flex-1'>
              <h2 id='project-progress' className='font-medium'>{project.done}% complete</h2>
              <p className='text-text-muted text-sm'>18 of 25 tasks done · next milestone Friday 9 October</p>
            </div>
            <Badge variant='success-light'>On track</Badge>
          </section>
          <h2 className='mt-6 text-sm font-medium'>Agents working on this project</h2>
          <ul className='mt-2 grid gap-3 lg:grid-cols-3'>
            {agents.map((agent) => (
              <li key={agent.id} className='rounded-(--ds-radius-card) border p-4'>
                <div className='flex items-center gap-2'>
                  <AgentMark name={agent.name} seed={agent.id} size='sm' state={agent.state} decorative />
                  <p className='text-sm font-medium'>{agent.name}</p>
                </div>
                <p className='text-text-muted mt-2 text-sm'>{agent.task}</p>
                <Progress value={agent.progress} className='mt-3' aria-label={`${agent.name} progress`} />
              </li>
            ))}
          </ul>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
