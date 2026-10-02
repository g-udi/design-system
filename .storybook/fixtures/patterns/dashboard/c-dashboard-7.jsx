'use client';
import { useState } from 'react';
import { DashboardGrid, DashboardPanel } from '../../../../src/components/blocks/Dashboard/index.js';
import { ComposedChart } from '../../../../src/components/charts/ComposedChart/index.js';
import { default as DataTable } from '../../../../src/components/core/DataTable/index.js';
import { default as Progress, ProgressRing } from '../../../../src/components/core/Progress/index.js';
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';

const money = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const receipts = [
  { label: 'Apr', receipts: 3120, buffer: 900 },
  { label: 'May', receipts: 3480, buffer: 950 },
  { label: 'Jun', receipts: 3290, buffer: 980 },
  { label: 'Jul', receipts: 4010, buffer: 1040 },
  { label: 'Aug', receipts: 4380, buffer: 1100 },
  { label: 'Sep', receipts: 4720, buffer: 1150 }
];
const initialLanes = [
  { id: 'bank', name: 'Bank transfer', detail: 'Account ending 4471 · weekly on Fridays', share: 70, auto: true },
  { id: 'card', name: 'Debit card', detail: 'Instant · 1% fee', share: 20, auto: false },
  { id: 'reserve', name: 'Tax reserve', detail: 'Held in Gaudi · released each quarter', share: 10, auto: true }
];
const ledger = [
  { id: 'tx-9031', date: 'Oct 1', description: 'Paid subscriptions · The Long Read', type: 'Receipt', amount: 1240.5 },
  { id: 'tx-9030', date: 'Sep 30', description: 'Tips on “Small tools, long lifetimes”', type: 'Receipt', amount: 186 },
  { id: 'tx-9027', date: 'Sep 29', description: 'Weekly payout to bank', type: 'Payout', amount: -2800 },
  { id: 'tx-9024', date: 'Sep 28', description: 'Sponsorship · Harbor Books', type: 'Receipt', amount: 900 },
  { id: 'tx-9022', date: 'Sep 27', description: 'Refund · annual plan', type: 'Refund', amount: -60 },
  { id: 'tx-9019', date: 'Sep 26', description: 'Paid subscriptions · Field Notes', type: 'Receipt', amount: 1310.2 },
  { id: 'tx-9015', date: 'Sep 24', description: 'Platform fee, September', type: 'Fee', amount: -142.8 },
  { id: 'tx-9012', date: 'Sep 22', description: 'Workshop tickets', type: 'Receipt', amount: 640 }
];
const typeTone = { Receipt: 'success-light', Payout: 'info-light', Refund: 'warning-light', Fee: 'secondary' };

export function Pattern() {
  const [claimable, setClaimable] = useState(3214.6);
  const [pending, setPending] = useState(0);
  const [lanes, setLanes] = useState(initialLanes);
  const threshold = 5000;
  const claim = () => {
    setPending(claimable);
    setClaimable(0);
  };
  return (
    <div className='grid w-full gap-4'>
      <header>
        <p className='text-text-muted text-xs'>Gaudi · Creator earnings</p>
        <h2 className='text-xl font-semibold'>Payouts</h2>
      </header>
      <DashboardGrid label='Payouts'>
        <section aria-label='Claimable balance' className='bg-surface-muted col-span-full grid gap-4 rounded-(--ds-radius-card) border p-4 @2xl/dashboard:grid-cols-[1fr_auto] @2xl/dashboard:items-center'>
          <div className='flex items-center gap-4'>
            <ProgressRing value={claimable + pending} max={threshold} size='lg' label={`${Math.round(((claimable + pending) / threshold) * 100)}% of the monthly payout goal`} showValue />
            <div className='grid gap-1'>
              <p className='text-text-muted text-sm'>Claimable now</p>
              <p className='text-3xl font-semibold tabular-nums'>{money(claimable)}</p>
              <p aria-live='polite' className='text-text-muted text-xs'>{pending ? `${money(pending)} on its way, arriving Monday` : 'Next automatic payout Friday, October 2'}</p>
            </div>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' tone='neutral'><RegistryIcon lucide='DownloadIcon' aria-hidden='true' />Statement</Button>
            <Button onClick={claim} disabled={!claimable}><RegistryIcon lucide='WalletIcon' aria-hidden='true' />{claimable ? `Claim ${money(claimable)}` : 'Claimed'}</Button>
          </div>
        </section>
        <DashboardPanel span={7} title='Receipts and buffer' description='Monthly receipts with the reserve kept back for refunds'>
          <ComposedChart
            framed={false}
            ariaLabel='Monthly receipts and refund buffer'
            data={receipts}
            height={240}
            showLegend
            formatValue={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
            series={[{ key: 'receipts', label: 'Receipts', type: 'bar' }, { key: 'buffer', label: 'Refund buffer', type: 'line' }]}
          />
        </DashboardPanel>
        <DashboardPanel span={5} title='Payout sweeps' description='Where each payout goes'>
          <ul className='grid gap-4'>
            {lanes.map((lane) => (
              <li key={lane.id} className='grid gap-2'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='min-w-0'>
                    <p className='text-sm font-medium'>{lane.name}</p>
                    <p className='text-text-muted text-xs'>{lane.detail}</p>
                  </div>
                  <label className='text-text-muted flex items-center gap-2 text-xs'>
                    <Switch size='sm' checked={lane.auto} onCheckedChange={(auto) => setLanes((current) => current.map((entry) => (entry.id === lane.id ? { ...entry, auto } : entry)))} aria-label={`Automatic sweep to ${lane.name}`} />
                    Auto
                  </label>
                </div>
                <Progress label={`${lane.share}% of each payout`} value={lane.share} tone={lane.auto ? 'accent' : 'neutral'} />
              </li>
            ))}
          </ul>
        </DashboardPanel>
        <DashboardPanel span={12} title='Ledger' description='Every receipt, payout, refund and fee'>
          <DataTable
            caption='Ledger'
            rows={ledger}
            searchable
            searchLabel='Search the ledger'
            sortable
            density='compact'
            exportable={{ filename: 'gaudi-ledger' }}
            footer
            columns={[
              { key: 'date', header: 'Date', width: 90 },
              { key: 'description', header: 'Description' },
              { key: 'type', header: 'Type', render: (row) => <Badge variant={typeTone[row.type]}>{row.type}</Badge> },
              { key: 'amount', header: 'Amount', align: 'right', render: (row) => <span className={row.amount < 0 ? 'text-text-muted' : 'font-medium'}>{money(row.amount)}</span>, exportValue: (value) => value, footer: (rows) => money(rows.reduce((total, row) => total + row.amount, 0)) }
            ]}
          />
        </DashboardPanel>
      </DashboardGrid>
    </div>
  );
}
