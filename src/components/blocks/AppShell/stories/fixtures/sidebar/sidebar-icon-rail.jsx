'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import {
  AvatarRoot as Avatar,
  AvatarFallback,
  AvatarImage
} from '@gaudi/design-system/core/Avatar';
import { default as Button } from '@gaudi/design-system/core/Button';
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
} from '@gaudi/design-system/blocks/AppShell';
import { AppShellFrame } from '@gaudi/design-system/blocks/AppShell';
import { TooltipProvider } from '@gaudi/design-system/core/Tooltip';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
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

function BrandButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild size='lg' tooltip='Gaudi Workspace'>
          <a href='#' aria-label='Gaudi Workspace'>
            <GaudiLogo aria-hidden='true' className='hidden size-8 group-data-[collapsible=icon]:block' />
            <span className='grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden'>
              <span className='flex items-center gap-2 text-sm font-medium'><GaudiBrand className='text-sm' /><span>Workspace</span></span>
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
        <SidebarMenuButton asChild size='lg' tooltip='Nadira Rahimi'>
          <a href='#'>
            <Avatar>
              <AvatarImage src='/avatars/person-41.svg' alt='' />
              <AvatarFallback>NR</AvatarFallback>
            </Avatar>
            <span className='grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden'>
              <span className='truncate text-sm font-medium'>Nadira Rahimi</span>
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
    <AppShellFrame>
      <TooltipProvider>
        <SidebarProvider className='relative h-full min-h-0 w-full overflow-hidden'>
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
    </AppShellFrame>
  );
}
