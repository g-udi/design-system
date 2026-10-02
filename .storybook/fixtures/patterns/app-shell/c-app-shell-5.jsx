'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from '../../../../src/components/core/Breadcrumb/parts/breadcrumb.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../../../../src/components/core/Commander/parts/command.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import { default as Kbd } from '../../../../src/components/core/Kbd/index.js';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '../../../../src/components/core/Sheet/parts/sheet.jsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../src/components/core/Tooltip/parts/tooltip.jsx';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from '../../../../src/components/blocks/AppShell/parts/sidebar.jsx';
import {
  AppShellBody,
  AppShellFrame,
  AppShellHeader,
  AppShellPanel,
  useAppShellFrame
} from '../../../../src/components/blocks/AppShell/parts/frame.jsx';
import { AppShellNav } from '../../../../src/components/blocks/AppShell/parts/nav.jsx';
import { AppShellPlaceholderGrid } from '../../../../src/components/blocks/AppShell/parts/placeholder.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
import { useHotkey } from '../../../../src/hooks/interaction/use-hotkey.js';

const portrait = (path) => `https://randomuser.me/api/portraits/${path}.jpg`;
const me = { name: 'Nick Bold', email: 'nick@gaudi.dev', photo: portrait('men/41') };
const organizations = [
  { id: 'acme', name: 'Acme Inc', plan: 'Pro', tone: 'bg-discovery' },
  { id: 'starter', name: 'Starter Kit', plan: 'Free', tone: 'bg-warning' },
  { id: 'enterprise', name: 'Enterprise', plan: 'Enterprise', tone: 'bg-info' }
];
const applications = ['Inventory', 'Storefront', 'Analytics'];
const environments = [
  { id: 'production', label: 'Production', tone: 'bg-success' },
  { id: 'staging', label: 'Staging', tone: 'bg-warning' },
  { id: 'development', label: 'Development', tone: 'bg-info' }
];
// Each rail section owns its secondary navigation and an optional widget at the foot of it.
const sections = [
  { id: 'home', label: 'Home', icon: 'House', groups: [
    { label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: 'LayoutGrid' }, { id: 'activity', label: 'Activity', icon: 'Activity' }, { id: 'reports', label: 'Reports', icon: 'FileText' }] }
  ] },
  { id: 'inventory', label: 'Inventory', icon: 'Package', widget: 'storage', groups: [
    { label: 'Catalog', items: [{ id: 'product-catalog', label: 'Product Catalog', icon: 'LayoutGrid' }, { id: 'categories', label: 'Categories', icon: 'Tag' }, { id: 'reviews', label: 'Customer Reviews', icon: 'Star', badge: { label: 20, variant: 'outline' } }] },
    { label: 'Operations', items: [{ id: 'transactions', label: 'Transactions', icon: 'ArrowLeftRight' }, { id: 'suppliers', label: 'Suppliers', icon: 'Truck' }, { id: 'warehouses', label: 'Warehouses', icon: 'House' }, { id: 'stock-alerts', label: 'Stock Alerts', icon: 'TriangleAlert', badge: { label: 4, variant: 'outline' } }] }
  ] },
  { id: 'orders', label: 'Orders', icon: 'ShoppingCart', widget: 'metrics', groups: [
    { label: 'Order Management', items: [{ id: 'all-orders', label: 'All Orders', icon: 'List' }, { id: 'pending', label: 'Pending', icon: 'Clock', badge: { label: 3, variant: 'outline' } }, { id: 'order-drafts', label: 'Drafts', icon: 'FileText' }] },
    { label: 'Fulfillment', items: [{ id: 'fulfilled', label: 'Fulfilled', icon: 'CircleCheck' }, { id: 'shipping', label: 'Shipping', icon: 'Truck' }, { id: 'returns', label: 'Returns', icon: 'RefreshCw' }, { id: 'refunds', label: 'Refunds', icon: 'CreditCard' }] }
  ] },
  { id: 'customers', label: 'Customers', icon: 'Users', groups: [
    { label: 'People', items: [{ id: 'all-customers', label: 'All Customers', icon: 'Users' }, { id: 'segments', label: 'Segments', icon: 'Tag' }, { id: 'loyalty', label: 'Loyalty', icon: 'Award' }] },
    { label: 'Support', items: [{ id: 'tickets', label: 'Support Tickets', icon: 'LifeBuoy', badge: { label: 7, variant: 'outline' } }, { id: 'feedback', label: 'Feedback', icon: 'MessageSquare' }] }
  ] },
  { id: 'messages', label: 'Messages', icon: 'MessageSquare', groups: [
    { label: 'Messages', items: [{ id: 'inbox', label: 'Inbox', icon: 'Inbox', badge: { label: 12, variant: 'outline' } }, { id: 'sent', label: 'Sent', icon: 'Send' }, { id: 'templates', label: 'Templates', icon: 'FileText' }] }
  ] },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart3', groups: [
    { label: 'Insights', items: [{ id: 'sales', label: 'Sales', icon: 'TrendingUp' }, { id: 'traffic', label: 'Traffic', icon: 'Activity' }, { id: 'conversion', label: 'Conversion', icon: 'Zap' }] }
  ] },
  { id: 'settings', label: 'Settings', icon: 'Settings', groups: [
    { label: 'Workspace', items: [{ id: 'general', label: 'General', icon: 'Settings' }, { id: 'team', label: 'Team', icon: 'Users' }, { id: 'billing', label: 'Billing', icon: 'CreditCard' }, { id: 'integrations', label: 'Integrations', icon: 'Zap' }] }
  ] }
];
const pages = sections.flatMap((section) => section.groups.flatMap((group) => group.items.map((item) => ({ ...item, section }))));
const initialNotifications = [
  { id: 'order', photo: 'women/44', title: 'Sarah Chen placed a new order #1284', body: 'Order #1284 · 3 items, $127.50', time: '2 min ago', unread: true },
  { id: 'stock', icon: 'Package', tone: 'text-warning', title: 'Low stock alert', tag: 'Urgent', body: 'Wireless Headphones Pro has dropped below 10 units.', actions: ['Reorder', 'Dismiss'], time: '15 min ago', unread: true },
  { id: 'review', photo: 'men/32', title: 'Marcus Rivera left a review on Smart Watch Elite', body: 'Great build quality and battery life exceeded expectations.', stars: 5, time: '1 hour ago', unread: true },
  { id: 'approval', icon: 'CircleCheck', tone: 'text-warning', title: 'Pending approval', body: 'The Q2 bulk discount campaign needs your approval before going live.', actions: ['Approve', 'Review'], time: '2 hours ago', unread: true },
  { id: 'delivered', photo: 'women/68', title: 'Shipment #1279 delivered', body: 'Order #1279 was delivered to Emily Watson.', time: '3 hours ago', unread: true },
  { id: 'staff', icon: 'Users', tone: 'text-success', title: '3 new staff joined your store', body: 'Sarah, James and Priya were added to the Inventory team.', people: ['women/44', 'men/46', 'women/90'], time: '4 hours ago', unread: true },
  { id: 'milestone', icon: 'Star', tone: 'text-success', title: 'Sales milestone reached!', body: '500 orders fulfilled this month.', progress: 100, time: '5 hours ago' }
];

function RailItem({ section, current, onSelect }) {
  const { isMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={current}
        aria-current={current ? 'page' : undefined}
        // The rail is always icons, so its names show as tooltips on every desktop state.
        tooltip={{ children: section.label, hidden: isMobile }}
        onClick={() => onSelect(section.id)}
        className='justify-center data-active:bg-ui-background data-active:shadow-xs'
      >
        <RegistryIcon lucide={section.icon} aria-hidden='true' />
        <span className='sr-only'>{section.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function StorageWidget() {
  return (
    <div className='border-ui-border grid gap-2 border-t p-3 text-xs'>
      <p className='text-ui-warning-ink font-medium'>Storage Usage</p>
      <p className='text-text-muted leading-snug'>Warehouse capacity across all locations</p>
      <Progress value={74} aria-label='Warehouse capacity used' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-warning' />
      <div className='flex justify-between'>
        <span><b className='font-semibold tabular-nums'>74%</b> <span className='text-text-muted'>Used</span></span>
        <span><b className='font-semibold tabular-nums'>26%</b> <span className='text-text-muted'>Free</span></span>
      </div>
    </div>
  );
}

function MetricsWidget() {
  return (
    <div className='border-ui-border grid gap-2 border-t p-3 text-xs'>
      <p className='flex items-center gap-1.5 font-medium'>
        <RegistryIcon lucide='Activity' aria-hidden='true' className='text-ui-danger-ink size-3.5' />
        Live Metrics
        <Badge variant='destructive' size='sm' className='ms-auto'>Alert</Badge>
      </p>
      <dl className='grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5'>
        <dt className='text-text-muted'>Orders per minute</dt>
        <dd className='text-ui-info-ink font-semibold tabular-nums'>10.9</dd>
        <dt className='text-text-muted'>Fulfillment rate</dt>
        <dd className='text-ui-danger-ink font-semibold tabular-nums'>91%</dd>
      </dl>
    </div>
  );
}

/** The section's own navigation: beside the content on desktop, beside the rail in the phone sheet. */
function SectionNav({ section, page, onPage }) {
  return (
    <nav aria-label={`${section.label} navigation`} className='flex h-full min-h-0 flex-col'>
      <div className='min-h-0 flex-1 overflow-y-auto py-1'>
        {section.groups.map((group, index) => (
          <AppShellNav
            key={group.label}
            label={group.label}
            items={group.items}
            value={page}
            onValueChange={onPage}
            className={index ? 'border-ui-border border-t' : undefined}
          />
        ))}
      </div>
      {section.widget === 'storage' ? <StorageWidget /> : null}
      {section.widget === 'metrics' ? <MetricsWidget /> : null}
    </nav>
  );
}

function AccountMenu() {
  const { isMobile } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' aria-label={`Account: ${me.name}`}>
          <Avatar className='size-7'>
            <AvatarImage src={me.photo} alt='' />
            <AvatarFallback>NB</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={isMobile ? 'top' : 'right'} align='end' sideOffset={8} className='w-56'>
        <DropdownMenuLabel className='grid font-normal leading-tight'>
          <span className='font-medium'>{me.name}</span>
          <span className='text-text-muted text-xs'>{me.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='User' aria-hidden='true' />
          Profile
          <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Settings' aria-hidden='true' />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuItem>
          <RegistryIcon lucide='Users' aria-hidden='true' />
          Manage Accounts
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RegistryIcon lucide='LogOut' aria-hidden='true' />
          Sign Out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** One crumb that switches between options (organization, application, environment). */
function Switcher({ label, value, options, onChange, hideLabelOnPhone, className }) {
  const current = options.find((option) => option.id === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='sm' aria-label={`${label}: ${current.label}`} className={`min-w-0 gap-1.5 px-2 ${className || ''}`}>
          {current.tone ? <span aria-hidden='true' className={`size-2.5 shrink-0 rounded-full ${current.tone}`} /> : null}
          <span className={`truncate ${hideLabelOnPhone ? 'sr-only @lg:not-sr-only' : ''}`}>{current.label}</span>
          <RegistryIcon lucide='ChevronsUpDown' aria-hidden='true' className='opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-56'>
        <DropdownMenuLabel className='text-text-muted text-xs font-normal'>{label === 'Organization' ? 'Organizations' : `${label}s`}</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.id} value={option.id} className='gap-2'>
              {option.tone ? <span aria-hidden='true' className={`size-3 shrink-0 rounded-full ${option.tone}`} /> : null}
              <span className='grid leading-tight'>
                {option.label}
                {option.plan ? <span className='text-text-muted text-xs'>{option.plan}</span> : null}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        {label === 'Environment' ? null : (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <RegistryIcon lucide='Plus' aria-hidden='true' />
              Create {label}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationsSheet({ open, onOpenChange }) {
  const frame = useAppShellFrame();
  const [items, setItems] = useState(initialNotifications);
  const unread = items.filter((item) => item.unread).length;
  const act = (id, action) => setItems((list) => list.map((item) => (item.id === id ? { ...item, done: action, unread: false } : item)));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent container={frame?.container ?? undefined} side='right' showCloseButton={false} className='w-96 max-w-[90%] gap-0 p-0'>
        <SheetHeader className='border-ui-border flex-row items-center gap-2 border-b px-4 py-3'>
          <SheetTitle className='text-sm'>Notifications</SheetTitle>
          {unread ? <Badge variant='invert' size='sm' className='rounded-full'>{unread}</Badge> : null}
          <SheetDescription className='sr-only'>Orders, stock, reviews and team activity.</SheetDescription>
          <div className='ms-auto flex gap-0.5'>
            <Button variant='ghost' size='icon-sm' aria-label='Mark all as read' onClick={() => setItems((list) => list.map((item) => ({ ...item, unread: false })))}>
              <RegistryIcon lucide='CheckCheck' aria-hidden='true' />
            </Button>
            <Button variant='ghost' size='icon-sm' aria-label='Close notifications' onClick={() => onOpenChange(false)}>
              <RegistryIcon lucide='X' aria-hidden='true' />
            </Button>
          </div>
        </SheetHeader>
        <ul aria-label='Store notifications' className='min-h-0 flex-1 overflow-y-auto overscroll-contain'>
          {items.map((item) => (
            <li key={item.id} className='border-ui-border relative flex gap-3 border-b px-4 py-3 text-sm'>
              {item.photo ? (
                <Avatar className='size-7'>
                  <AvatarImage src={portrait(item.photo)} alt='' />
                  <AvatarFallback>·</AvatarFallback>
                </Avatar>
              ) : (
                <span aria-hidden='true' className={`grid size-7 shrink-0 place-items-center ${item.tone}`}>
                  <RegistryIcon lucide={item.icon} className='size-4' />
                </span>
              )}
              <div className='grid min-w-0 flex-1 gap-1.5'>
                <p className='flex items-start gap-2 pe-3 leading-snug font-medium'>
                  {item.title}
                  {item.tag ? <Badge variant='outline' size='sm' className='ms-auto'>{item.tag}</Badge> : null}
                  {item.unread ? <span className='sr-only'> (unread)</span> : null}
                </p>
                <p className='text-text-muted leading-snug'>{item.body}</p>
                {item.stars ? (
                  <span role='img' aria-label={`${item.stars} out of 5 stars`} className='text-warning flex gap-0.5'>
                    {Array.from({ length: item.stars }, (_, index) => (
                      <RegistryIcon key={index} lucide='Star' aria-hidden='true' className='size-3.5 fill-current' />
                    ))}
                  </span>
                ) : null}
                {item.people ? (
                  <AvatarGroup className='-space-x-1.5'>
                    {item.people.map((path) => (
                      <Avatar key={path} className='size-6'>
                        <AvatarImage src={portrait(path)} alt='' />
                        <AvatarFallback>·</AvatarFallback>
                      </Avatar>
                    ))}
                  </AvatarGroup>
                ) : null}
                {item.progress ? (
                  <Progress value={item.progress} aria-label='Monthly goal' className='bg-ui-muted h-1.5 rounded-full [&>[data-slot=progress-indicator]]:bg-success' />
                ) : null}
                {item.actions ? (
                  item.done ? (
                    <Badge variant='success-light' className='w-fit'>{item.done}</Badge>
                  ) : (
                    <div className='flex gap-1.5'>
                      <Button size='xs' onClick={() => act(item.id, item.actions[0] === 'Approve' ? 'Approved' : 'Reorder placed')}>{item.actions[0]}</Button>
                      <Button size='xs' variant='outline' onClick={() => act(item.id, item.actions[1] === 'Review' ? 'In review' : 'Dismissed')}>{item.actions[1]}</Button>
                    </div>
                  )
                ) : null}
                <span className='text-text-muted text-xs'>{item.time}</span>
              </div>
              {item.unread ? <span aria-hidden='true' className='bg-ui-foreground absolute top-4 end-4 size-1.5 rounded-full' /> : null}
            </li>
          ))}
        </ul>
        <div className='border-ui-border border-t p-1'>
          <Button variant='ghost' size='sm' className='w-full'>View all notifications</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SearchPalette({ open, onOpenChange, onSelect }) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title='Search' description='Search pages across every section.'>
      <Command>
        <CommandInput placeholder='Type to search...' />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {sections.map((section) => (
            <CommandGroup key={section.id} heading={section.label}>
              {pages.filter((entry) => entry.section.id === section.id).map((entry) => (
                <CommandItem key={entry.id} value={`${section.label} ${entry.label}`} onSelect={() => onSelect(entry)}>
                  <RegistryIcon lucide={entry.icon} aria-hidden='true' />
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

function InventoryShell() {
  const frame = useAppShellFrame();
  const [sectionId, setSectionId] = useState('inventory');
  const [page, setPage] = useState('product-catalog');
  const [organization, setOrganization] = useState('acme');
  const [application, setApplication] = useState('Inventory');
  const [environment, setEnvironment] = useState('production');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  // ⌘K / Ctrl+K opens search while focus is inside this window.
  const shortcut = useHotkey('mod+k', () => setSearchOpen((value) => !value), { enableInInputs: true, target: frame?.container ?? null });
  const section = sections.find((entry) => entry.id === sectionId);
  const chooseSection = (id) => {
    setSectionId(id);
    setPage(sections.find((entry) => entry.id === id).groups[0].items[0].id);
  };
  return (
    <SidebarProvider shortcut={false} style={{ '--sidebar-width': '3.5rem', '--sidebar-width-icon': '3.5rem' }}>
      <Sidebar collapsible='icon'>
        <InnerSidebar section={section} page={page} onPage={setPage} onSection={chooseSection} />
      </Sidebar>
      <AppShellPanel>
        <AppShellHeader bordered className='gap-1 px-2'>
          <SidebarTrigger />
          <Breadcrumb className='min-w-0'>
            <BreadcrumbList className='flex-nowrap gap-0.5 sm:gap-0.5'>
              <BreadcrumbItem className='min-w-0'>
                <Switcher
                  label='Organization'
                  value={organization}
                  options={organizations.map((entry) => ({ ...entry, label: entry.name }))}
                  onChange={setOrganization}
                  hideLabelOnPhone
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator className='hidden @lg:block' />
              <BreadcrumbItem className='hidden min-w-0 @lg:inline-flex'>
                <Switcher
                  label='Application'
                  value={application}
                  options={applications.map((name) => ({ id: name, label: name }))}
                  onChange={setApplication}
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='min-w-0'>
                <Switcher label='Environment' value={environment} options={environments} onChange={setEnvironment} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className='ms-auto flex shrink-0 items-center gap-1 @5xl:absolute @5xl:start-1/2 @5xl:ms-0 @5xl:-translate-x-1/2'>
            <Button
              variant='outline'
              size='sm'
              aria-label='Search'
              aria-keyshortcuts={shortcut.ariaKeyShortcuts}
              onClick={() => setSearchOpen(true)}
              className='text-text-muted w-8 justify-start px-0 @3xl:w-56 @3xl:px-2.5 @6xl:w-80'
            >
              <RegistryIcon lucide='Search' aria-hidden='true' className='mx-auto @3xl:mx-0' />
              <span className='hidden @3xl:inline'>Search...</span>
              <span aria-hidden='true' className='ms-auto hidden @3xl:inline-flex'>
                <Kbd keys={shortcut.kbdKeys} size='sm' />
              </span>
            </Button>
          </div>
          <div className='flex shrink-0 items-center gap-1 @5xl:ms-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='sm' aria-label='Create' className='px-2 @lg:px-2.5'>
                  <RegistryIcon lucide='Plus' aria-hidden='true' />
                  <span className='hidden @lg:inline'>Create</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-52'>
                <DropdownMenuItem><RegistryIcon lucide='Package' aria-hidden='true' />New Product</DropdownMenuItem>
                <DropdownMenuItem><RegistryIcon lucide='ShoppingCart' aria-hidden='true' />New Order</DropdownMenuItem>
                <DropdownMenuItem><RegistryIcon lucide='UserPlus' aria-hidden='true' />New Customer</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><RegistryIcon lucide='Download' aria-hidden='true' />Import Data</DropdownMenuItem>
                <DropdownMenuItem><RegistryIcon lucide='FileText' aria-hidden='true' />Generate Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' size='icon-sm' aria-label='Notifications' className='relative' onClick={() => setNotificationsOpen(true)}>
                  <RegistryIcon lucide='Bell' aria-hidden='true' />
                  <span aria-hidden='true' className='bg-ui-foreground absolute top-1 end-1.5 size-1.5 rounded-full' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='bottom'>Notifications</TooltipContent>
            </Tooltip>
          </div>
        </AppShellHeader>
        <div className='flex min-h-0 flex-1'>
          <SecondaryAside section={section} page={page} onPage={setPage} />
          <AppShellBody className='@container min-w-0 flex-1 overflow-y-auto pt-4'>
            <AppShellPlaceholderGrid preset='grid' />
          </AppShellBody>
        </div>
      </AppShellPanel>
      <SearchPalette
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={(entry) => {
          setSectionId(entry.section.id);
          setPage(entry.id);
          setSearchOpen(false);
        }}
      />
      <NotificationsSheet open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </SidebarProvider>
  );
}

/** The rail, and in the phone sheet the section navigation beside it. */
function InnerSidebar({ section, page, onPage, onSection }) {
  const { isMobile } = useSidebar();
  const rail = (
    <div className='flex h-full w-14 shrink-0 flex-col'>
      <SidebarHeader className='items-center py-3'>
        <span aria-hidden='true' className='bg-ui-foreground text-ui-background grid size-8 place-items-center rounded-(--ds-radius-control)'>
          <RegistryIcon lucide='Command' className='size-4' />
        </span>
      </SidebarHeader>
      <SidebarContent role='navigation' aria-label='Sections'>
        <SidebarMenu className='gap-1 px-2'>
          {sections.map((entry) => (
            <RailItem key={entry.id} section={entry} current={entry.id === section.id} onSelect={onSection} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='items-center'>
        <AccountMenu />
      </SidebarFooter>
    </div>
  );
  if (!isMobile) return rail;
  return (
    <div className='flex h-full'>
      {rail}
      <div className='bg-ui-background border-ui-border min-w-0 flex-1 border-s'>
        <SectionNav section={section} page={page} onPage={onPage} />
      </div>
    </div>
  );
}

/** The section navigation inside the panel; the trigger folds it away so only the rail remains. */
function SecondaryAside({ section, page, onPage }) {
  const { open, isMobile } = useSidebar();
  if (isMobile) return null;
  return (
    <div
      inert={!open}
      className={`border-ui-border shrink-0 overflow-hidden transition-[width] duration-200 ease-linear motion-reduce:transition-none ${open ? 'w-52 border-e' : 'w-0'}`}
    >
      <div className='h-full w-52'>
        <SectionNav section={section} page={page} onPage={onPage} />
      </div>
    </div>
  );
}

export function Pattern() {
  return (
    <AppShellFrame>
      <InventoryShell />
    </AppShellFrame>
  );
}
