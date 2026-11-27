'use client';
import { StatusDot } from '@gaudi/design-system/core/Pill';
import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { default as Button } from '@gaudi/design-system/core/Button';
import { downloadCsv, toCsv } from '@gaudi/design-system/core/DataTable';
import Dialog from '@gaudi/design-system/core/Dialog';
import { useState } from 'react';

import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuTrigger
} from '@gaudi/design-system/core/DropdownMenu';
import { RegistryIcon } from '@gaudi/design-system/icons/RegistryIcon';

const rows = [
  ['Subscriptions', '$31,420', 'success'],
  ['One-off sales', '$12,180', 'info'],
  ['Services', '$4,690', 'discovery'],
  ['Refunds', '−$1,240', 'danger']
];
const dot = { success: 'bg-success', info: 'bg-info', discovery: 'bg-discovery', danger: 'bg-danger' };

export function Pattern() {
  const [reportOpen, setReportOpen] = useState(false);
  const fields = [
    { header: 'Source', value: (row) => row[0] },
    { header: 'Revenue', value: (row) => row[1] }
  ];
  return (
    <>
      <StatCard
        className='w-full max-w-sm'
        label='Total revenue'
        value='$47,050'
        delta='18.2%'
        deltaDirection='up'
        deltaTone='success'
        description='$7,240 more than August'
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon-xs' aria-label='Revenue actions'>
                <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onSelect={() => setReportOpen(true)}>Compare periods</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => downloadCsv(toCsv(rows, fields), 'revenue-breakdown.csv')}>
                Download revenue breakdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        footer={
          <Button variant='ghost' size='xs' onClick={() => setReportOpen(true)}>
            View period comparison
          </Button>
        }
      >
        <dl className='mt-1 grid gap-2 text-sm'>
          {rows.map(([label, value, tone]) => (
            <div key={label} className='flex items-center gap-2'>
              <StatusDot className={`size-2 ${dot[tone]}`} />
              <dt className='text-text-muted flex-1'>{label}</dt>
              <dd className='font-medium tabular-nums'>{value}</dd>
            </div>
          ))}
        </dl>
      </StatCard>
      <Dialog
        title='Revenue by period'
        open={reportOpen}
        onOpenChange={setReportOpen}
        description='Total revenue after refunds.'
      >
        <dl className='grid gap-2'>
          {[
            ['August', '$39,810'],
            ['September', '$47,050'],
            ['Increase', '$7,240']
          ].map(([label, value]) => (
            <div className='flex justify-between' key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Dialog>
    </>
  );
}
