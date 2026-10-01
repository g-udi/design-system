import { StatCard } from '../../../../src/components/blocks/StatCard/StatCard.jsx';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Progress } from '../../../../src/components/core/Progress/parts/progress.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

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
      <div className='relative overflow-x-auto rounded-xl border'>
        <table className='w-full min-w-[32rem] text-sm'>
          <caption className='p-4 text-left font-medium'>Invoice history</caption>
          <thead className='bg-surface-muted text-text-muted text-left text-xs'>
            <tr>
              <th className='px-4 py-2 font-medium'>Invoice</th>
              <th className='px-4 py-2 font-medium'>Date</th>
              <th className='px-4 py-2 font-medium'>Amount</th>
              <th className='px-4 py-2 font-medium'>Status</th>
              <th className='px-4 py-2'><span className='sr-only'>Download</span></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(([number, date, amount, state]) => (
              <tr key={number} className='border-t'>
                <td className='px-4 py-2 font-medium'>{number}</td>
                <td className='text-text-muted px-4 py-2'>{date}</td>
                <td className='px-4 py-2 tabular-nums'>{amount}</td>
                <td className='px-4 py-2'><Badge size='sm' variant={status[state]}>{state}</Badge></td>
                <td className='px-4 py-2 text-end'>
                  <Button size='xs' variant='ghost' aria-label={`Download ${number}`}>
                    <RegistryIcon lucide='DownloadIcon' aria-hidden='true' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
