import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { Badge } from '@gaudi/design-system/core/Pill';
import { default as Button } from '@gaudi/design-system/core/Button';
import { ProgressRoot as Progress } from '@gaudi/design-system/core/Progress';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const usage = [
  { label: 'Seats', value: '8 of 10', used: 80, icon: 'UsersIcon', tone: 'info' },
  { label: 'Storage', value: '42 of 100 GB', used: 42, icon: 'DatabaseIcon', tone: 'discovery' },
  { label: 'API calls', value: '91k of 100k', used: 91, icon: 'ZapIcon', tone: 'warning' }
];
const invoices = [
  ['INV-2026-010', 'Oct 1, 2026', '€48.00', 'Paid'],
  ['INV-2026-009', 'Sep 1, 2026', '€48.00', 'Paid'],
  ['INV-2026-008', 'Aug 1, 2026', '€62.40', 'Refunded'],
  ['INV-2026-007', 'Jul 1, 2026', '€48.00', 'Paid']
];
const status = { Paid: 'success-light', Refunded: 'secondary', Failed: 'destructive-light' };

export function Pattern() {
  return (
    <section aria-labelledby='billing-title' className='grid w-full max-w-4xl gap-5'>
      <header className='flex flex-wrap items-start justify-between gap-4 rounded-xl border p-5'>
        <div className='grid gap-1'>
          <p className='text-text-muted text-sm'>Current plan</p>
          <h2 id='billing-title' className='flex items-center gap-2 text-xl font-semibold'>
            Team
            <Badge size='sm' variant='primary-light'>Monthly</Badge>
          </h2>
          <p className='text-text-muted text-sm'>€48 per month · renews November 1, 2026 · Visa ending 4242</p>
        </div>
        <div className='flex gap-2'>
          <Button variant='outline'>Cancel plan</Button>
          <Button>Upgrade</Button>
        </div>
      </header>
      <div className='grid gap-3 sm:grid-cols-3'>
        {usage.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} icon={item.icon} tone={item.tone}>
            <Progress value={item.used} aria-label={`${item.label} used`} className='h-1.5' />
            <p className={item.used > 85 ? 'text-warning text-xs font-medium' : 'text-text-muted text-xs'}>
              {item.used > 85 ? 'Close to the limit' : `${item.used}% used`}
            </p>
          </StatCard>
        ))}
      </div>
      <Table containerProps={{ role: 'region', 'aria-label': 'Invoice history', tabIndex: 0, className: 'rounded-xl border' }} className='min-w-[32rem]'>
        <TableCaption className='p-4 text-left font-medium'>Invoice history</TableCaption>
        <TableHeader className='text-left'>
          <TableRow>
            <TableHead scope='col'>Invoice</TableHead>
            <TableHead scope='col'>Date</TableHead>
            <TableHead scope='col'>Amount</TableHead>
            <TableHead scope='col'>Status</TableHead>
            <TableHead scope='col'><span className='sr-only'>Download</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(([number, date, amount, state]) => (
            <TableRow key={number}>
              <TableCell className='font-medium'>{number}</TableCell>
              <TableCell className='text-text-muted'>{date}</TableCell>
              <TableCell className='tabular-nums'>{amount}</TableCell>
              <TableCell><Badge size='sm' variant={status[state]}>{state}</Badge></TableCell>
              <TableCell className='text-end'>
                <Button size='xs' variant='ghost' aria-label={`Download ${number}`}>
                  <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
