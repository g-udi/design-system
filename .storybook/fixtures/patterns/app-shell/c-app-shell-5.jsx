'use client';
import { useEffect, useState } from 'react';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../src/components/core/Popover/parts/popover.jsx';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const scopes = {
  organisation: { label: 'Organisation', options: ['Gaudi', 'Gaudi Labs'] },
  app: { label: 'App', options: ['Reader web', 'Newsletter API', 'Search worker'] },
  environment: { label: 'Environment', options: ['Production', 'Staging', 'Preview'] }
};
const sections = [
  { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', pages: [['Health', null], ['Usage', null], ['Activity', 12]] },
  { id: 'deploys', label: 'Deploys', icon: 'Rocket', pages: [['All deploys', null], ['Pending', 2], ['Rollbacks', null]] },
  { id: 'logs', label: 'Logs', icon: 'Terminal', pages: [['Live tail', null], ['Errors', 7], ['Saved queries', null]] },
  { id: 'settings', label: 'Settings', icon: 'Settings', pages: [['General', null], ['Domains', null], ['Secrets', null]] }
];
const deploys = [
  { id: 'd-482', commit: 'Faster article search', author: 'Tom Becker', when: '12m ago', status: 'Live', tone: 'success-light' },
  { id: 'd-481', commit: 'Newsletter preview fix', author: 'Priya Natarajan', when: '2h ago', status: 'Superseded', tone: 'secondary' },
  { id: 'd-480', commit: 'Image CDN migration', author: 'Li Wei', when: 'Yesterday', status: 'Rolled back', tone: 'warning-light' }
];

function ScopeSwitcher({ id, value, onChange }) {
  const scope = scopes[id];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size='xs' variant='ghost' tone='neutral' aria-label={`${scope.label}: ${value}`}>
          {value}
          <RegistryIcon lucide='ChevronsUpDown' className='size-3.5' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuLabel>{scope.label}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {scope.options.map((option) => <DropdownMenuRadioItem key={option} value={option}>{option}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Readings drift every two seconds while the monitor is open; the numbers are not announced on every tick.
function SystemMonitor({ environment }) {
  const [open, setOpen] = useState(false);
  const [reading, setReading] = useState({ cpu: 38, memory: 61, requests: 1240 });
  useEffect(() => {
    if (!open) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setInterval(() => {
      setReading((current) => ({
        cpu: Math.min(95, Math.max(12, current.cpu + Math.round(Math.random() * 10 - 5))),
        memory: Math.min(92, Math.max(40, current.memory + Math.round(Math.random() * 4 - 2))),
        requests: Math.max(800, current.requests + Math.round(Math.random() * 120 - 60))
      }));
    }, reduce ? 6000 : 2000);
    return () => window.clearInterval(timer);
  }, [open]);
  const meter = (label, value, suffix = '%') => (
    <div className='grid gap-1.5'>
      <div className='flex justify-between text-xs'><span className='text-text-muted'>{label}</span><span className='font-medium tabular-nums'>{value}{suffix}</span></div>
      <Progress value={value} aria-label={label} />
    </div>
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size='sm' variant='outline' tone='neutral'>
          <span aria-hidden='true' className='bg-success size-2 rounded-full' />
          <span className='hidden sm:inline'>System</span>
          <span className='sr-only sm:hidden'>System monitor</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='grid w-72 gap-3'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium'>{environment} · live</p>
          <Badge variant='success-light'>Healthy</Badge>
        </div>
        {meter('CPU', reading.cpu)}
        {meter('Memory', reading.memory)}
        <p className='text-text-muted flex justify-between text-xs'><span>Requests per minute</span><span className='text-text font-medium tabular-nums'>{reading.requests.toLocaleString('en')}</span></p>
      </PopoverContent>
    </Popover>
  );
}

export function Pattern() {
  const [scope, setScope] = useState({ organisation: 'Gaudi', app: 'Reader web', environment: 'Production' });
  const [section, setSection] = useState('deploys');
  const [page, setPage] = useState('All deploys');
  const current = sections.find((entry) => entry.id === section);
  const choose = (id) => {
    setSection(id);
    setPage(sections.find((entry) => entry.id === id).pages[0][0]);
  };
  return (
    <SidebarProvider shortcut={false} className='bg-surface-muted relative h-[44rem] min-h-0 w-full overflow-hidden rounded-(--ds-radius-card) border' style={{ '--sidebar-width': '14rem' }}>
      <nav aria-label='Console sections' className='hidden w-14 shrink-0 flex-col items-center gap-1 py-3 md:flex'>
        <span className='bg-accent text-accent-foreground mb-2 grid size-8 place-items-center rounded-(--ds-radius-control)'><RegistryIcon lucide='Server' className='size-4' aria-label='Gaudi console' /></span>
        {sections.map((entry) => (
          <Tooltip key={entry.id}>
            <TooltipTrigger asChild>
              <Button size='icon-sm' variant={section === entry.id ? 'soft' : 'ghost'} tone='neutral' aria-label={entry.label} aria-current={section === entry.id ? 'page' : undefined} onClick={() => choose(entry.id)}>
                <RegistryIcon lucide={entry.icon} className='size-4' aria-hidden='true' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='right'>{entry.label}</TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <Sidebar variant='inset' collapsible='offcanvas' className='absolute h-full md:left-14!'>
        <SidebarHeader>
          <p className='px-2 pt-1 text-sm font-semibold'>{current.label}</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{scope.app}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {current.pages.map(([label, count]) => (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton isActive={page === label} aria-current={page === label ? 'page' : undefined} onClick={() => setPage(label)}>
                      <span>{label}</span>
                    </SidebarMenuButton>
                    {count ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup className='md:hidden'>
            <SidebarGroupLabel>Sections</SidebarGroupLabel>
            <SidebarMenu>
              {sections.map((entry) => (
                <SidebarMenuItem key={entry.id}>
                  <SidebarMenuButton isActive={section === entry.id} onClick={() => choose(entry.id)}>
                    <RegistryIcon lucide={entry.icon} aria-hidden='true' />
                    <span>{entry.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className='bg-surface min-h-0 min-w-0 md:my-2 md:me-2 md:rounded-(--ds-radius-card) md:border'>
        <header className='flex h-14 shrink-0 items-center gap-2 border-b px-3'>
          <SidebarTrigger />
          <Breadcrumb className='min-w-0'>
            <BreadcrumbList className='flex-nowrap'>
              <BreadcrumbItem className='hidden sm:inline-flex'><ScopeSwitcher id='organisation' value={scope.organisation} onChange={(value) => setScope((s) => ({ ...s, organisation: value }))} /></BreadcrumbItem>
              <BreadcrumbSeparator className='hidden sm:inline-flex' />
              <BreadcrumbItem><ScopeSwitcher id='app' value={scope.app} onChange={(value) => setScope((s) => ({ ...s, app: value }))} /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><ScopeSwitcher id='environment' value={scope.environment} onChange={(value) => setScope((s) => ({ ...s, environment: value }))} /></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='ms-auto flex items-center gap-1'>
            <SystemMonitor environment={scope.environment} />
            <Button size='icon-sm' variant='ghost' tone='neutral' aria-label='Notifications'><RegistryIcon lucide='Bell' className='size-4' aria-hidden='true' /></Button>
          </div>
        </header>
        <div className='min-h-0 flex-1 overflow-y-auto p-4 sm:p-6'>
          <div className='flex flex-wrap items-end justify-between gap-3'>
            <div>
              <h1 className='text-xl font-semibold'>{page}</h1>
              <p className='text-text-muted text-sm'>{scope.app} in {scope.environment.toLowerCase()}</p>
            </div>
            <Button size='sm'><RegistryIcon lucide='Rocket' className='size-4' aria-hidden='true' />Deploy</Button>
          </div>
          <ul className='mt-6 divide-y rounded-(--ds-radius-card) border'>
            {deploys.map((deploy) => (
              <li key={deploy.id} className='flex flex-wrap items-center gap-3 px-4 py-3 text-sm'>
                <code className='text-text-muted text-xs'>{deploy.id}</code>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate font-medium'>{deploy.commit}</span>
                  <span className='text-text-muted text-xs'>{deploy.author} · {deploy.when}</span>
                </span>
                <Badge variant={deploy.tone}>{deploy.status}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
