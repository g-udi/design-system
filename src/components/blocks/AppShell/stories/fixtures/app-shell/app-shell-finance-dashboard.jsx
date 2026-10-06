'use client';
import { GaudiLogo, GaudiBrand } from '@gaudi/design-system/icons/brands/gaudi';
import { useId, useRef, useState } from 'react';
import {
  AppShellBody, AppShellFrame, AppShellHeader, AppShellNav, AppShellPanel,
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger
} from '@gaudi/design-system/blocks/AppShell';
import { DashboardGrid, DashboardPanel } from '@gaudi/design-system/blocks/Dashboard';
import Button from '@gaudi/design-system/core/Button';
import { CardRoot, CardContent } from '@gaudi/design-system/core/Card';
import { AvatarRoot, AvatarFallback, AvatarImage } from '@gaudi/design-system/core/Avatar';
import { Badge } from '@gaudi/design-system/core/Pill';
import Select from '@gaudi/design-system/core/Select';
import DataTable from '@gaudi/design-system/core/DataTable';
import Dialog, { DialogRoot, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@gaudi/design-system/core/Dialog';
import EmptyState from '@gaudi/design-system/core/EmptyState';
import Kbd from '@gaudi/design-system/core/Kbd';
import {
  Command, CommandEmpty, CommandFooter, CommandGroup, CommandInput, CommandItem, CommandList
} from '@gaudi/design-system/core/Commander';
import { BarChart } from '@gaudi/design-system/charts/BarChart';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';
import { useHotkey } from '@gaudi/design-system/hooks/interaction/use-hotkey';

const navigation = [
  { label: 'Dashboard', items: [
    { id: 'finance', label: 'Finance', icon: 'Gauge' },
    { id: 'cash-flow', label: 'Cash flow', icon: 'Banknote' },
    { id: 'net-worth', label: 'Net worth', icon: 'PieChart' }
  ] },
  { label: 'Payments', items: [
    { id: 'transactions', label: 'Transactions', icon: 'ArrowLeftRight' },
    { id: 'invoices', label: 'Invoices', icon: 'Receipt' }
  ] },
  { label: 'Sales & customers', items: [
    { id: 'products', label: 'Products', icon: 'Package' },
    { id: 'customers', label: 'Customers', icon: 'Users' }
  ] },
  { label: 'Analytics', items: [
    { id: 'visitors', label: 'Visitors', icon: 'BarChart' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3' }
  ] }
];
const pages = navigation.flatMap(group => group.items);
const revenue = [
  { label: 'Jan', subscriptions: 14000, products: 6000, services: 0, expenses: 12000 },
  { label: 'Feb', subscriptions: 16000, products: 7000, services: 5000, expenses: 16000 },
  { label: 'Mar', subscriptions: 18000, products: 11000, services: 11000, expenses: 22000 },
  { label: 'Apr', subscriptions: 12000, products: 8000, services: 5000, expenses: 15000 },
  { label: 'May', subscriptions: 22000, products: 12000, services: 10000, expenses: 24000 },
  { label: 'Jun', subscriptions: 16000, products: 18000, services: 18000, expenses: 26000 },
  { label: 'Jul', subscriptions: 25000, products: 7000, services: 12000, expenses: 23500 }
].map(month => ({ ...month, income: month.subscriptions + month.products + month.services }));
const income = revenue.reduce((total, month) => total + month.income, 0);
const expenses = revenue.reduce((total, month) => total + month.expenses, 0);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
const devices = [
  { label: 'Desktop', value: 17, visits: 3913 },
  { label: 'Tablet', value: 65, visits: 14961 },
  { label: 'Mobile', value: 18, visits: 4144 }
];
const products = [
  { id: 'phone', name: 'Samsung Galaxy S25', category: 'Samsung', icon: 'Smartphone', sales: 32200, units: 46 },
  { id: 'laptop', name: 'Apple MacBook Pro', category: 'Apple', icon: 'Laptop', sales: 28990, units: 10 },
  { id: 'headphones', name: 'Sony WH-1000XM5', category: 'Sony', icon: 'Headphones', sales: 12460, units: 35 },
  { id: 'notebook', name: 'Dell XPS 13', category: 'Dell', icon: 'Monitor', sales: 9990, units: 10 },
  { id: 'watch', name: 'Smart Band 9', category: 'Xiaomi', icon: 'Clock', sales: 7400, units: 100 }
];
const customers = [
  { id: 'nadira', name: 'Nadira Rahimi', email: 'nadira@example.com', role: 'Maintainer', plan: 'Enterprise', billing: 'Auto debit', status: 'Active', photo: 'person-41' },
  { id: 'lina', name: 'Lina Sato', email: 'lina@example.com', role: 'Admin', plan: 'Enterprise', billing: 'Auto debit', status: 'Active', photo: 'person-20' },
  { id: 'owen', name: 'Owen Brooks', email: 'owen@example.com', role: 'Editor', plan: 'Team', billing: 'Manual', status: 'Active', photo: 'person-23' },
  { id: 'clara', name: 'Clara Jensen', email: 'clara@example.com', role: 'Viewer', plan: 'Starter', billing: 'Manual', status: 'Pending', photo: 'person-24' },
  { id: 'tomas', name: 'Tomas Rivera', email: 'tomas@example.com', role: 'Editor', plan: 'Team', billing: 'Auto debit', status: 'Active', photo: 'person-44' }
];
const payments = [
  { id: 'INV-1048', customer: 'Harbor Books', description: 'Enterprise subscription', date: '2026-07-28', amount: 2400, status: 'Paid' },
  { id: 'INV-1047', customer: 'Fabrikam Studio', description: 'Product order', date: '2026-07-27', amount: 1890, status: 'Paid' },
  { id: 'INV-1046', customer: 'Reading Room', description: 'Team subscription', date: '2026-07-26', amount: 640, status: 'Due' },
  { id: 'INV-1045', customer: 'Kestrel Kites', description: 'Consulting services', date: '2026-07-25', amount: 3200, status: 'Overdue' },
  { id: 'INV-1044', customer: 'Contoso Research', description: 'Enterprise subscription', date: '2026-07-24', amount: 2400, status: 'Paid' }
];

function FinanceOverview({ page, onReport }) {
  const title = pages.find(item => item.id === page)?.label || 'Finance';
  const chartData = page === 'net-worth' ? revenue.map((month, index) => ({ ...month, balance: 85000 + revenue.slice(0, index + 1).reduce((total, item) => total + item.income - item.expenses, 0) })) : revenue;
  const series = page === 'cash-flow' ? [{ key: 'income', label: 'Income' }, { key: 'expenses', label: 'Expenses' }]
    : page === 'net-worth' ? [{ key: 'balance', label: 'Net worth' }]
      : [{ key: 'subscriptions', label: 'Subscriptions' }, { key: 'products', label: 'Products' }, { key: 'services', label: 'Services' }];
  return (
    <CardRoot className='gap-0 py-0 shadow-none'>
      <CardContent className='grid min-w-0 gap-0 p-0 @3xl:grid-cols-[minmax(0,1.65fr)_minmax(15rem,1fr)]'>
        <section aria-label={`${title} overview`} className='min-w-0 p-4'>
          <div className='mb-4 flex flex-wrap items-start justify-between gap-2'>
            <div><h1 className='text-base font-semibold'>{title}</h1><p className='text-text-muted mt-1 text-xs'>January – July 2026</p></div>
            <span className='text-text-muted text-xs'>USD</span>
          </div>
          <BarChart framed={false} ariaLabel={`${title} by month`} data={chartData} series={series} stacked={page === 'finance'} barRadius={0} height={260} showLegend formatValue={{ style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 }} />
        </section>
        <section aria-label='Report summary' className='border-ui-border flex min-w-0 flex-col border-t p-4 @3xl:border-s @3xl:border-t-0'>
          <h2 className='text-base font-semibold'>Report</h2>
          <p className='text-text-muted mt-1 text-xs'>Monthly average {money(income / revenue.length)}</p>
          <dl className='my-5 grid flex-1 content-center gap-6'>
            {[
              { label: 'Total profit', value: income - expenses, icon: 'CircleDollarSign' },
              { label: 'Total income', value: income, icon: 'Wallet' },
              { label: 'Total expense', value: expenses, icon: 'CreditCard' }
            ].map(metric => <div key={metric.label} className='relative ps-12'>
              <dt className='text-sm'><span className='bg-ui-accent text-ui-accent-foreground absolute start-0 top-0 grid size-9 place-items-center rounded-full'><RegistryIcon lucide={metric.icon} className='size-4' aria-hidden='true' /></span>{metric.label}</dt>
              <dd className='text-text-muted mt-0.5 text-sm tabular-nums'>{money(metric.value)}</dd>
            </div>)}
          </dl>
          <Button className='w-full' onClick={onReport}>View report</Button>
        </section>
      </CardContent>
    </CardRoot>
  );
}

function VisitorsPanel({ onDetails, fullWidth = false }) {
  return <DashboardPanel title='Total visitors' span={fullWidth ? 12 : 6} spanMd={fullWidth ? 6 : 3} className='shadow-none' action={<Button variant='outline' size='xs' onClick={onDetails}>Details</Button>}>
    <div className='mb-4 flex items-center gap-3'><strong className='text-2xl font-semibold tabular-nums'>23,018</strong><Badge variant='success-light'>+6.2%</Badge></div>
    <p className='text-text-muted mb-4 text-xs'>Compared with the previous month</p>
    <ul className='border-ui-border grid grid-cols-3 border-t pt-4'>
      {devices.map((device, index) => <li key={device.label} className={`min-w-0 px-2 first:ps-0 last:pe-0 ${index ? 'border-ui-border border-s border-dashed' : ''}`}>
        <span className='text-text-muted text-xs'>{device.label}</span><p className='mt-2 text-xl font-semibold tabular-nums'>{device.value}%</p>
        <div aria-hidden='true' className='mt-3 flex h-24 items-end'><div className='bg-ui-primary/25 w-full rounded-(--ds-radius-control)' style={{ height: `${device.value * 1.4}%` }} /></div>
        <p className='text-text-muted mt-2 text-xs tabular-nums'>{device.visits.toLocaleString('en-US')} visits</p>
      </li>)}
    </ul>
  </DashboardPanel>;
}

function ProductsPanel({ onProduct, fullWidth = false }) {
  return <DashboardPanel title='Top products by sales' span={fullWidth ? 12 : 6} spanMd={fullWidth ? 6 : 3} className='shadow-none'>
    <ul className='grid gap-2'>
      {products.map(product => <li key={product.id}><Button variant='ghost' className='h-auto w-full justify-start gap-3 whitespace-normal px-0 py-2 text-start' onClick={() => onProduct(product)}>
        <span className='bg-ui-accent text-ui-accent-foreground grid size-9 shrink-0 place-items-center rounded-full'><RegistryIcon lucide={product.icon} className='size-4' aria-hidden='true' /></span>
        <span className='min-w-0 flex-1'><span className='block text-sm font-medium'>{product.name}</span><span className='text-text-muted mt-0.5 block text-xs font-normal'>{product.category}</span></span>
        <span className='shrink-0 text-xs tabular-nums'>{money(product.sales)}</span>
      </Button></li>)}
    </ul>
  </DashboardPanel>;
}

function CustomersPanel({ onCustomer }) {
  const [role, setRole] = useState('all');
  const [plan, setPlan] = useState('all');
  const id = useId();
  const visible = customers.filter(customer => (role === 'all' || customer.role === role) && (plan === 'all' || customer.plan === plan));
  const reset = () => { setRole('all'); setPlan('all'); };
  return <DashboardPanel title='Customers' description='Manage account access and billing' className='shadow-none' contentClassName='px-0'>
    <div className='mb-4 grid gap-3 px-3 @lg:grid-cols-2'>
      <div><label htmlFor={`${id}-role`} className='mb-1.5 block text-xs'>Select role</label><Select id={`${id}-role`} className='max-w-none' value={role} onValueChange={setRole} options={['all', 'Maintainer', 'Admin', 'Editor', 'Viewer'].map(value => ({ value, label: value === 'all' ? 'All roles' : value }))} /></div>
      <div><label htmlFor={`${id}-plan`} className='mb-1.5 block text-xs'>Select plan</label><Select id={`${id}-plan`} className='max-w-none' value={plan} onValueChange={setPlan} options={['all', 'Enterprise', 'Team', 'Starter'].map(value => ({ value, label: value === 'all' ? 'All plans' : value }))} /></div>
    </div>
    {visible.length ? <DataTable caption='Customer accounts' className='rounded-none border-x-0 shadow-none' rows={visible} sortable selectable getRowLabel={customer => customer.name} headerVariant='plain' density='compact' columns={[
      { key: 'name', header: 'User', render: customer => <span className='flex items-center gap-2'><AvatarRoot className='size-8'><AvatarImage src={`/avatars/${customer.photo}.svg`} alt='' /><AvatarFallback>{customer.name.slice(0, 1)}</AvatarFallback></AvatarRoot><span><span className='block font-medium'>{customer.name}</span><span className='text-text-muted block text-xs'>{customer.email}</span></span></span> },
      { key: 'role', header: 'Role' }, { key: 'plan', header: 'Plan' }, { key: 'billing', header: 'Billing' },
      { key: 'status', header: 'Status', render: customer => <Badge variant={customer.status === 'Active' ? 'success-light' : 'warning-light'}>{customer.status}</Badge> }
    ]} onRowClick={onCustomer} /> : <EmptyState compact title='No matching customers' description='Try a different role or plan to find an account.' actions={<Button variant='outline' size='sm' onClick={reset}>Clear filters</Button>} />}
    <p className='text-text-muted mt-3 px-3 text-xs' role='status'>{visible.length} of {customers.length} customers</p>
  </DashboardPanel>;
}

function FinanceShell() {
  const [page, setPage] = useState('finance');
  const [searchOpen, setSearchOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const frame = useRef(null);
  const panel = useRef(null);
  const searchButton = useRef(null);
  const detailTrigger = useRef(null);
  const shortcut = useHotkey('mod+k', () => setSearchOpen(true), { target: frame });
  const choosePage = id => { setPage(id); setSearchOpen(false); panel.current?.scrollTo({ top: 0 }); };
  const openDetails = value => {
    detailTrigger.current = frame.current?.contains(document.activeElement) ? document.activeElement : searchButton.current;
    setDetails(value);
  };
  const showCustomer = customer => openDetails({ title: customer.name, description: 'Customer account', fields: { Email: customer.email, Role: customer.role, Plan: customer.plan, Billing: customer.billing, Status: customer.status } });
  const showProduct = product => openDetails({ title: product.name, description: product.category, fields: { 'Total sales': money(product.sales), 'Units sold': product.units, Period: 'January – July 2026' } });
  const showVisitors = () => openDetails({ title: 'Visitor details', description: 'July 2026 · 23,018 visits', fields: Object.fromEntries(devices.map(device => [device.label, `${device.visits.toLocaleString('en-US')} visits · ${device.value}%`])) });
  const showReport = () => choosePage('reports');
  const overview = ['finance', 'cash-flow', 'net-worth'].includes(page);
  const current = pages.find(item => item.id === page);
  return <DialogRoot open={searchOpen} onOpenChange={setSearchOpen}><div ref={frame} className='w-full min-w-0'>
    <AppShellFrame label='Finance workspace' surface='default' height='62rem' style={{ '--ds-app-shell-frame-height-compact': '40rem' }}>
      <SidebarProvider shortcut={false} defaultWidth={248}>
        <Sidebar collapsible='icon' mobileTitle='Finance navigation'>
          <SidebarHeader className='px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0'>
            <div className='flex h-8 items-center gap-2 overflow-hidden'><GaudiLogo className='hidden size-8 group-data-[collapsible=icon]:block' /><GaudiBrand className='text-sm group-data-[collapsible=icon]:hidden' /><span className='truncate text-base font-semibold group-data-[collapsible=icon]:hidden'>Finance</span></div>
          </SidebarHeader>
          <SidebarContent role='navigation' aria-label='Finance navigation' className='gap-4'>
            {navigation.map(group => <AppShellNav key={group.label} label={group.label} items={group.items} value={page} onValueChange={choosePage} labelClassName='uppercase tracking-wide text-[10px] font-normal' />)}
          </SidebarContent>
          <SidebarFooter className='border-ui-border border-t p-3'><span className='text-text-muted text-xs group-data-[collapsible=icon]:sr-only'>Demo workspace · sample data</span></SidebarFooter>
        </Sidebar>
        <AppShellPanel ref={panel} inset={false}>
          <AppShellHeader bordered>
            <SidebarTrigger />
            <span aria-hidden='true' className='bg-ui-border mx-1 h-4 w-px shrink-0' />
            <DialogTrigger asChild><Button ref={searchButton} variant='ghost' className='text-text-muted min-w-0 flex-1 justify-start font-normal' aria-label='Search finance workspace' aria-keyshortcuts={shortcut.ariaKeyShortcuts}><RegistryIcon lucide='Search' aria-hidden='true' /><span className='truncate'>Type to search…</span><span className='ms-auto hidden @sm:inline-flex'><Kbd keys={shortcut.kbdKeys} /></span></Button></DialogTrigger>
          </AppShellHeader>
          <AppShellBody className='gap-4'>
            {overview ? <FinanceOverview page={page} onReport={showReport} /> : <div><h1 className='text-base font-semibold'>{current.label}</h1><p className='text-text-muted mt-1 text-xs'>January – July 2026</p></div>}
            <DashboardGrid label={`${current.label} dashboard`}>
              {overview || page === 'visitors' ? <VisitorsPanel onDetails={showVisitors} fullWidth={!overview} /> : null}
              {overview || page === 'products' ? <ProductsPanel onProduct={showProduct} fullWidth={!overview} /> : null}
              {overview || page === 'customers' ? <CustomersPanel onCustomer={showCustomer} /> : null}
              {page === 'reports' ? <DashboardPanel title='Income and expenses' description='Monthly report · USD' className='shadow-none' footer={`Total profit: ${money(income - expenses)}`}><DataTable caption='Monthly finance report' rows={revenue.map(month => ({ ...month, id: month.label, profit: month.income - month.expenses }))} sortable exportable={{ filename: 'finance-report' }} columns={[{ key: 'label', header: 'Month' }, ...['income', 'expenses', 'profit'].map(key => ({ key, header: key[0].toUpperCase() + key.slice(1), align: 'right', render: row => money(row[key]) }))]} /></DashboardPanel> : null}
              {page === 'transactions' || page === 'invoices' ? <DashboardPanel title={page === 'invoices' ? 'Outstanding invoices' : 'Recent transactions'} description={page === 'invoices' ? 'Invoices awaiting payment' : 'Payments received this month'} className='shadow-none'><DataTable caption={current.label} rows={payments.filter(payment => page === 'invoices' ? payment.status !== 'Paid' : payment.status === 'Paid')} searchable sortable exportable={{ filename: current.id }} columns={[{ key: 'id', header: 'Invoice' }, { key: 'customer', header: 'Customer' }, { key: 'description', header: 'Description' }, { key: 'date', header: 'Issued' }, { key: 'amount', header: 'Amount', align: 'right', render: row => money(row.amount) }, { key: 'status', header: 'Status', render: row => <Badge variant={row.status === 'Paid' ? 'success-light' : row.status === 'Overdue' ? 'danger-light' : 'warning-light'}>{row.status}</Badge> }]} /></DashboardPanel> : null}
            </DashboardGrid>
          </AppShellBody>
        </AppShellPanel>
      </SidebarProvider>
    </AppShellFrame>
    <DialogContent className='ds-part-command-dialog top-1/3 translate-y-0 overflow-hidden p-0' showCloseButton={false}>
      <DialogHeader className='sr-only'><DialogTitle>Search finance workspace</DialogTitle><DialogDescription>Find a page, customer or product.</DialogDescription></DialogHeader>
      <Command><CommandInput placeholder='Search pages, customers, products…' /><CommandList><CommandEmpty>No results. Try a page or customer name.</CommandEmpty>
        <CommandGroup heading='Pages'>{pages.map(item => <CommandItem key={item.id} value={item.label} onSelect={() => choosePage(item.id)}><RegistryIcon lucide={item.icon} aria-hidden='true' />{item.label}</CommandItem>)}</CommandGroup>
        <CommandGroup heading='Customers'>{customers.map(customer => <CommandItem key={customer.id} value={`${customer.name} ${customer.email}`} onSelect={() => { setSearchOpen(false); showCustomer(customer); }}><RegistryIcon lucide='User' aria-hidden='true' />{customer.name}</CommandItem>)}</CommandGroup>
        <CommandGroup heading='Products'>{products.map(product => <CommandItem key={product.id} value={product.name} onSelect={() => { setSearchOpen(false); showProduct(product); }}><RegistryIcon lucide={product.icon} aria-hidden='true' />{product.name}</CommandItem>)}</CommandGroup>
      </CommandList></Command>
      <CommandFooter />
    </DialogContent>
    <Dialog open={Boolean(details)} onOpenChange={open => { if (!open) setDetails(null); }} title={details?.title || 'Details'} description={details?.description} contentProps={{ onCloseAutoFocus: event => {
      event.preventDefault();
      (detailTrigger.current?.isConnected ? detailTrigger.current : searchButton.current)?.focus();
    } }}>
      <dl className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm'>{Object.entries(details?.fields || {}).map(([label, value]) => <div key={label} className='contents'><dt className='text-text-muted'>{label}</dt><dd className='break-words text-end tabular-nums'>{value}</dd></div>)}</dl>
    </Dialog>
  </div></DialogRoot>;
}

export function Pattern() { return <FinanceShell />; }
