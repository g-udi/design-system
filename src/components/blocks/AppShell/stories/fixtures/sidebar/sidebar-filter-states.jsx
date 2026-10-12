'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@gaudi/design-system/utilities/cn';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  CardRoot as Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@gaudi/design-system/core/Card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@gaudi/design-system/core/Input';
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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame } from '@gaudi/design-system/blocks/AppShell';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
const PINNED = [
  { id: 'checkout', name: 'Checkout API' },
  { id: 'design-system', name: 'Design system' },
  { id: 'status', name: 'Status page' }
];
const PROJECTS = [
  {
    id: 'checkout',
    name: 'Checkout API',
    open: 8,
    icon: <RegistryIcon lucide='PackageIcon' aria-hidden='true' />
  },
  {
    id: 'design-system',
    name: 'Design system',
    open: 3,
    icon: <RegistryIcon lucide='PaletteIcon' aria-hidden='true' />
  },
  {
    id: 'edge-cache',
    name: 'Edge cache',
    open: 2,
    icon: <RegistryIcon lucide='GlobeIcon' aria-hidden='true' />
  },
  {
    id: 'growth',
    name: 'Growth experiments',
    open: 11,
    icon: <RegistryIcon lucide='BarChart3Icon' aria-hidden='true' />
  },
  {
    id: 'marketing',
    name: 'Marketing site',
    open: 4,
    icon: <RegistryIcon lucide='FileTextIcon' aria-hidden='true' />
  },
  {
    id: 'mobile',
    name: 'Mobile client',
    open: 6,
    icon: <RegistryIcon lucide='SmartphoneIcon' aria-hidden='true' />
  },
  {
    id: 'payments',
    name: 'Payments ledger',
    open: 1,
    icon: <RegistryIcon lucide='DatabaseIcon' aria-hidden='true' />
  },
  {
    id: 'search',
    name: 'Search index',
    open: 5,
    icon: <RegistryIcon lucide='TerminalIcon' aria-hidden='true' />
  }
];
const RUNS = [
  { id: 'r-311', label: 'Overnight link checker', time: '08:12' },
  { id: 'r-310', label: 'Newsletter send rehearsal', time: '07:40', failed: true },
  { id: 'r-309', label: 'Index rebuild', time: '06:55' },
  { id: 'r-308', label: 'Locale export', time: '06:02' }
];
function PinnedProjects() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pinned</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {PINNED.map((project) => (
            <SidebarMenuItem key={project.id}>
              <SidebarMenuButton asChild>
                <a href='#'>
                  <RegistryIcon lucide='BookmarkIcon' aria-hidden='true' />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function RunRow({ run }) {
  return (
    <div className='flex items-center gap-2 text-sm'>
      {run.failed ? (
        <RegistryIcon
          lucide='AlertCircleIcon'
          className='text-ui-destructive size-3.5 shrink-0'
          aria-hidden='true'
        />
      ) : (
        <RegistryIcon
          lucide='CircleCheckIcon'
          className='text-success size-3.5 shrink-0'
          aria-hidden='true'
        />
      )}
      <span className='sr-only'>{run.failed ? 'Failed' : 'Succeeded'}</span>
      <span className='min-w-0 flex-1 truncate'>{run.label}</span>
      <span className='text-ui-muted-foreground shrink-0 text-xs tabular-nums'>
        {run.time}
      </span>
    </div>
  );
}
function ProjectFilter({ query, onChange }) {
  const searchRef = useRef(null);
  return (
    /*
      The form and the `py-0` group are shadcn's own SearchForm shape
      (blocks/sidebar-05): the form gives Enter somewhere to go instead of
      submitting the page, and the group lines the field up with the panel's
      gutter rather than the header's padding.
    */
    <form onSubmit={(event) => event.preventDefault()}>
      <SidebarGroup className='py-0'>
        <SidebarGroupContent>
          <InputGroup>
            <InputGroupAddon>
              <RegistryIcon lucide='SearchIcon' aria-hidden='true' />
            </InputGroupAddon>
            <InputGroupInput
              ref={searchRef}
              value={query}
              onChange={(event) => onChange(event.target.value)}
              placeholder='Filter projects'
              aria-label='Filter projects'
            />
            {query ? (
              <InputGroupAddon align='inline-end'>
                <InputGroupButton
                  size='icon-xs'
                  aria-label='Clear filter'
                  onClick={() => { onChange(''); searchRef.current?.focus(); }}
                >
                  <RegistryIcon lucide='XIcon' aria-hidden='true' />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
function ProjectList({ projects, loading, query, onRefresh }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>All projects</SidebarGroupLabel>
      <SidebarGroupAction type='button' onClick={onRefresh}>
        <RegistryIcon
          lucide='LoaderCircleIcon'
          className={cn('size-4', loading && 'animate-spin')}
          aria-hidden='true'
        />
        <span className='sr-only'>Refresh projects</span>
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu aria-busy={loading}>
          {loading
            ? Array.from({ length: 6 }, (_, index) => (
                <SidebarMenuItem key={`skeleton-${index}`}>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenuItem>
              ))
            : projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton asChild>
                    <a href='#'>
                      {project.icon}
                      <span>{project.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{project.open}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>
        {!loading && projects.length === 0 ? (
          <p className='text-ui-sidebar-foreground px-2 py-6 text-center text-xs'>
            No projects match{' '}
            <span className='text-ui-sidebar-foreground'>{query}</span>.
          </p>
        ) : null}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function ProjectOverview() {
  return (
    <SidebarInset className='min-w-0 overflow-hidden'>
      <header className='flex h-12 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ms-1' />
        <h2 className='truncate text-sm font-medium'>Checkout API</h2>
        <span className='text-ui-muted-foreground ml-auto shrink-0 text-xs'>
          Updated 4m ago
        </span>
      </header>

      <div className='min-w-0 flex-1 overflow-auto p-4'>
        <Card size='sm'>
          <CardHeader>
            <CardTitle>Recent runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-2.5'>
              {RUNS.map((run) => (
                <RunRow key={run.id} run={run} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  );
}
export function Pattern() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);
  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  function startRefresh() {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 900);
  }
  const needle = query.trim().toLowerCase();
  const visible = PROJECTS.filter((project) =>
    project.name.toLowerCase().includes(needle)
  );
  return (
    <AppShellFrame>
      <SidebarProvider className='relative h-full min-h-0 w-full overflow-hidden'>
        {/*
        NOT `collapsible="none"`. That branch is a bare
        `flex h-full w-(--sidebar-width) flex-col bg-sidebar` with no border, so
        against a page background this close to `--sidebar` the panel and the
        content blur into one another. Only the desktop branch draws
        `group-data-[side=left]:border-r`, and it is the branch the framed
        preview always takes, so the divider is real rather than hand-painted.
        `absolute h-full` pins that branch's `fixed inset-y-0 h-svh` container
        back inside the example.
      */}
        <Sidebar className='absolute h-full'>
          <SidebarHeader>
            <ProjectFilter query={query} onChange={setQuery} />
          </SidebarHeader>

          <SidebarContent role='navigation' aria-label='Projects'>
            <PinnedProjects />
            {/*
        `mx-0` is a fix, not a preference. SidebarSeparator ships `w-auto`
        to undo Separator's `data-horizontal:w-full`, but a variant
        selector outranks a plain utility, so the rule stays full width and
        the primitive's own `mx-2` then pushes it 8px past the panel's
        right edge. In this scrolling content that is 16px of horizontal
        scroll on the whole nav; in the footer it is a rule that misses the
        left gutter and overhangs the right.
      */}
            <SidebarSeparator className='mx-0' />
            <ProjectList
              projects={visible}
              loading={loading}
              query={query}
              onRefresh={startRefresh}
            />
          </SidebarContent>

          <SidebarFooter>
            <SidebarSeparator className='mx-0' />
            <p className='text-ui-sidebar-foreground px-2 text-xs'>
              Free plan, 8 of 10 projects
            </p>
            <Button variant='outline' size='sm' className='w-full'>
              Upgrade plan
            </Button>
          </SidebarFooter>
        </Sidebar>

        <ProjectOverview />
      </SidebarProvider>
    </AppShellFrame>
  );
}
