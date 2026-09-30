'use client';
import { cn } from '../../../../src/utilities/cn/index.js';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
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
  SidebarRail,
  SidebarTrigger
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import { TooltipProvider } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const NAV = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <RegistryIcon lucide='LayoutDashboardIcon' aria-hidden='true' />
  },
  {
    id: 'inbox',
    label: 'Inbox',
    badge: 12,
    icon: <RegistryIcon lucide='InboxIcon' aria-hidden='true' />
  },
  {
    id: 'deployments',
    label: 'Deployments',
    isActive: true,
    icon: <RegistryIcon lucide='RocketIcon' aria-hidden='true' />
  },
  {
    id: 'monitoring',
    label: 'Monitoring',
    icon: <RegistryIcon lucide='ActivityIcon' aria-hidden='true' />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <RegistryIcon lucide='BarChart3Icon' aria-hidden='true' />
  },
  {
    id: 'audit',
    label: 'Audit log',
    icon: <RegistryIcon lucide='ShieldCheckIcon' aria-hidden='true' />
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <RegistryIcon lucide='SettingsIcon' aria-hidden='true' />
  }
];
const MONITORS = [
  {
    id: 'edge',
    label: 'Edge network',
    value: '99.99%',
    icon: (
      <RegistryIcon
        lucide='GlobeIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    )
  },
  {
    id: 'webhooks',
    label: 'Webhook delivery',
    value: '42ms p95',
    icon: (
      <RegistryIcon
        lucide='ZapIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    )
  },
  {
    id: 'jobs',
    label: 'Background jobs',
    value: '12 queued',
    icon: (
      <RegistryIcon
        lucide='DatabaseIcon'
        className='text-ui-muted-foreground size-4 shrink-0'
        aria-hidden='true'
      />
    )
  }
];
function RailNav() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {NAV.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.label}
              >
                <a href='#'>
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
              {item.badge ? (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
function BrandMark({ className }) {
  return (
    <span
      aria-hidden='true'
      className={cn(
        'bg-ui-sidebar-primary text-ui-sidebar-primary-foreground flex size-6 shrink-0 items-center justify-center rounded-md',
        className
      )}
    >
      <svg
        viewBox='25.5002 25.1352 50 50'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='size-3'
      >
        <circle cx='70.634' cy='29.8334' r='4.69799' fill='currentColor' />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M25.668 57.0144V29.8332C25.668 27.2386 27.7713 25.1352 30.366 25.1352C32.9606 25.1352 35.0639 27.2386 35.0639 29.8332V57.0144C35.0639 61.833 38.9702 65.7392 43.7888 65.7392H57.2116C62.0302 65.7392 65.9364 61.833 65.9364 57.0144V43.7258C65.9364 41.1312 68.0398 39.0278 70.6344 39.0278C73.229 39.0278 75.3324 41.1312 75.3324 43.7258V57.0144C75.3324 67.0222 67.2194 75.1352 57.2116 75.1352H43.7888C33.7809 75.1352 25.668 67.0222 25.668 57.0144Z'
          fill='currentColor'
        />
      </svg>
    </span>
  );
}
function BrandButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size='lg' tooltip='Gaudi Workspace'>
          <a href='#'>
            <BrandMark className='size-8 rounded-lg [&>svg]:size-4' />
            <span className='grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:sr-only'>
              <span className='truncate text-sm font-medium'>Gaudi Workspace</span>
              <span className='text-ui-sidebar-foreground truncate text-xs'>
                Production
              </span>
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
function AccountButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size='lg' tooltip='Nadia Rahman'>
          <a href='#'>
            <Avatar>
              <AvatarImage src='https://randomuser.me/api/portraits/men/32.jpg' alt='' />
              <AvatarFallback>NR</AvatarFallback>
            </Avatar>
            <span className='grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:sr-only'>
              <span className='truncate text-sm font-medium'>Nadia Rahman</span>
              <span className='text-ui-sidebar-foreground truncate text-xs'>
                Owner
              </span>
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
export function Pattern() {
  return (
    <TooltipProvider>
      <SidebarProvider className='relative h-dvh min-h-0 w-full overflow-hidden'>
        <Sidebar collapsible='icon' className='absolute h-full'>
          <SidebarHeader>
            <BrandButton />
          </SidebarHeader>

          <SidebarContent role='navigation' aria-label='Primary'>
            <RailNav />
          </SidebarContent>

          <SidebarFooter>
            <AccountButton />
          </SidebarFooter>

          {/*
      SidebarRail ships its own `tabIndex={-1}` and `aria-label`, so the
      grab strip on the panel edge is a mouse affordance and the trigger in
      the inset header is the keyboard path. Two tab stops for one toggle
      would only slow a keyboard user down.
    */}
          <SidebarRail />
        </Sidebar>

        <SidebarInset className='min-w-0 overflow-hidden'>
          <header className='flex h-12 shrink-0 items-center gap-2 border-b px-3'>
            <SidebarTrigger />
            <h2 className='truncate text-sm font-medium'>Deployments</h2>
            <Button variant='outline' size='sm' className='ml-auto'>
              New deploy
            </Button>
          </header>

          <div className='min-w-0 flex-1 overflow-auto p-4'>
            <p className='text-ui-muted-foreground max-w-prose text-sm'>
              Every deploy runs against the edge network first. Collapse the
              rail with the panel button or the strip on its edge, and the
              labels give way to tooltips.
            </p>

            <dl className='mt-4 flex flex-col gap-3'>
              {MONITORS.map((monitor) => (
                <div
                  key={monitor.id}
                  className='flex items-center gap-2 text-sm'
                >
                  <dt className='flex min-w-0 flex-1 items-center gap-2'>
                    {monitor.icon}
                    <span className='truncate'>{monitor.label}</span>
                  </dt>
                  <dd className='shrink-0 tabular-nums'>{monitor.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
