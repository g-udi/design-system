'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from '../../../../src/components/core/Commander/parts/command.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { default as Kbd } from '../../../../src/components/core/Kbd/index.js';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel
} from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { useHotkey } from '../../../../src/hooks/interaction/use-hotkey.js';
import { ClaudeAiIcon } from '../../../../src/icons/brands/claudeAiIcon.jsx';
import { Openai } from '../../../../src/icons/brands/openai.jsx';
import { Stripe } from '../../../../src/icons/brands/stripe.jsx';

const organizations = [
  { id: 'stripe', name: 'Stripe', Logo: Stripe },
  { id: 'openai', name: 'OpenAI', Logo: Openai },
  { id: 'claude', name: 'Claude', Logo: ClaudeAiIcon }
];
const platform = [
  { id: 'overview', label: 'Overview', icon: 'LayoutGrid' },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'Users',
    defaultOpen: true,
    defaultValue: 'accounts',
    items: [
      { id: 'segments', label: 'Segments' },
      { id: 'accounts', label: 'Accounts' },
      { id: 'health-scores', label: 'Health Scores' }
    ]
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: 'CreditCard',
    items: [
      { id: 'plans', label: 'Plans' },
      { id: 'invoices', label: 'Invoices' },
      { id: 'coupons', label: 'Coupons' }
    ]
  },
  { id: 'revenue', label: 'Revenue', icon: 'BarChart3', indicator: 'success', status: 'new activity' },
  { id: 'automation', label: 'Automation', icon: 'Zap' },
  { id: 'support', label: 'Support', icon: 'LifeBuoy' }
];
const links = [
  { id: 'settings', label: 'Settings', icon: 'Settings' },
  { id: 'invite', label: 'Invite Team', icon: 'Users' },
  { id: 'docs', label: 'Documentation', icon: 'BookOpen' }
];
const pages = [...platform, ...links].flatMap((item) =>
  item.items ? item.items.map((child) => ({ ...child, section: item.label })) : [item]
);
const user = { handle: '@maya', photo: '/avatars/women/44.jpg' };
// Raised rows on the floating card: the current page sits on the plain surface with a hairline.
const raised =
  'data-active:bg-ui-background data-active:shadow-xs data-active:ring-1 data-active:ring-ui-sidebar-border';

function Brand() {
  return (
    <div className='flex items-center gap-2 group-data-[collapsible=icon]:flex-col'>
      <a
        href='#overview'
        className='flex min-w-0 flex-1 items-center gap-2 rounded-(--ds-radius-control) px-1 py-1 text-sm font-semibold outline-hidden focus-visible:ring-2 focus-visible:ring-ui-sidebar-ring group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:px-0'
        onClick={(event) => event.preventDefault()}
      >
        <span aria-hidden='true' className='bg-ui-foreground text-ui-background grid size-7 shrink-0 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Command' className='size-4' aria-hidden='true' />
        </span>
        <span className='truncate group-data-[collapsible=icon]:sr-only'>Gaudi</span>
      </a>
      <SidebarTrigger />
    </div>
  );
}

function SearchButton({ onOpen, shortcut }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton variant='outline' tooltip='Search' onClick={onOpen} aria-keyshortcuts={shortcut.ariaKeyShortcuts}>
          <RegistryIcon lucide='Search' aria-hidden='true' />
          <span className='text-text-muted'>Search...</span>
          <span aria-hidden='true' className='ms-auto group-data-[collapsible=icon]:hidden'>
            <Kbd keys={shortcut.kbdKeys} size='sm' />
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function OrganizationSwitcher({ organization, onChange }) {
  const { isMobile } = useSidebar();
  const { Logo } = organization;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton aria-label={`Organization: ${organization.name}`} className='data-[state=open]:bg-ui-sidebar-accent'>
              <Logo aria-hidden='true' className='size-4' />
              <span className='truncate font-medium'>{organization.name}</span>
              <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='ms-auto opacity-60' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-56'>
            <DropdownMenuRadioGroup
              value={organization.id}
              onValueChange={(id) => onChange(organizations.find((entry) => entry.id === id))}
            >
              {organizations.map((entry) => (
                <DropdownMenuRadioItem key={entry.id} value={entry.id} className='gap-2'>
                  <entry.Logo aria-hidden='true' className='size-4' />
                  {entry.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              New Organization
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RegistryIcon lucide='Settings' aria-hidden='true' />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='LogOut' aria-hidden='true' />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function PageHeader({ organization, page }) {
  const { isMobile } = useSidebar();
  const { Logo } = organization;
  return (
    <AppShellHeader>
      {isMobile ? <SidebarTrigger className='-ms-1' /> : null}
      <Breadcrumb className='min-w-0'>
        <BreadcrumbList className='flex-nowrap'>
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbLink href='#workspace' className='flex items-center gap-1.5' onClick={(event) => event.preventDefault()}>
              <Logo aria-hidden='true' className='size-4 shrink-0' />
              {/* Narrow frames keep the marks and speak the names. */}
              <span className={isMobile ? 'sr-only' : 'truncate'}>Workspace</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbLink href='#profile' className='flex items-center gap-1.5' onClick={(event) => event.preventDefault()}>
              <Avatar className='size-5'>
                <AvatarImage src={user.photo} alt='' />
                <AvatarFallback>M</AvatarFallback>
              </Avatar>
              <span className={isMobile ? 'sr-only' : 'truncate'}>{user.handle}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='min-w-0'>
            <BreadcrumbPage className='truncate'>{page}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </AppShellHeader>
  );
}

export function Pattern() {
  const [page, setPage] = useState('overview');
  const [organization, setOrganization] = useState(organizations[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  // ⌘K on macOS, Ctrl+K elsewhere, from anywhere on the page.
  const shortcut = useHotkey('mod+k', () => setSearchOpen((open) => !open), { enableInInputs: true });
  const go = (id) => {
    setPage(id);
    setSearchOpen(false);
  };
  const current = pages.find((entry) => entry.id === page);
  return (
    <AppShellFrame surface='default'>
      <SidebarProvider>
        <Sidebar variant='floating' collapsible='icon'>
          <SidebarHeader>
            <Brand />
            <SearchButton onOpen={() => setSearchOpen(true)} shortcut={shortcut} />
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Workspace'>
            <AppShellNav label='Platform' items={platform} value={page} onValueChange={setPage} itemClassName={raised} />
            <AppShellNav className='mt-auto' size='sm' items={links} value={page} onValueChange={setPage} itemClassName={raised} />
          </SidebarContent>
          <SidebarFooter>
            <SidebarSeparator className='mx-0' />
            <OrganizationSwitcher organization={organization} onChange={setOrganization} />
          </SidebarFooter>
        </Sidebar>
        <AppShellPanel inset={false}>
          <PageHeader organization={organization} page={current?.label ?? 'Overview'} />
          <AppShellBody>
            <AppShellPlaceholderGrid preset='dashboard' variant='solid' />
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen} title='Search' description='Search your workspace content.'>
        <Command>
          <CommandInput placeholder='Type to search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Pages'>
              {pages.map((entry) => (
                <CommandItem key={entry.id} value={`${entry.section ?? ''} ${entry.label}`} onSelect={() => go(entry.id)}>
                  <RegistryIcon lucide={entry.icon || 'CornerDownRight'} aria-hidden='true' />
                  {entry.section ? <span className='text-text-muted'>{entry.section} /</span> : null}
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading='Actions'>
              <CommandItem onSelect={() => go('invite')}>
                <RegistryIcon lucide='UserPlus' aria-hidden='true' />
                Invite a teammate
              </CommandItem>
              <CommandItem onSelect={() => go('settings')}>
                <RegistryIcon lucide='Settings' aria-hidden='true' />
                Open settings
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </AppShellFrame>
  );
}
