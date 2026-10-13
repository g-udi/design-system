import { StatCard } from '@gaudi/design-system/blocks/StatCard';
import { default as Button } from '@gaudi/design-system/core/Button';
import Link from '@gaudi/design-system/core/Link';
import {
  DropdownMenuRoot as DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItemPrimitive as DropdownMenuItem,
  DropdownMenuSeparatorPrimitive as DropdownMenuSeparator,
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
  return (
    <StatCard
      className='w-full max-w-sm'
      label='Total revenue'
      value='$47,050'
      delta='18.2%' deltaDirection='up' deltaTone='success'
      description='$7,240 more than August'
      action={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon-xs' aria-label='Revenue actions'>
              <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Open report</DropdownMenuItem>
            <DropdownMenuItem>Compare periods</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Download invoice list</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      footer={
        <Link href='#revenue' variant='muted' className='inline-flex items-center gap-1'>
          View full breakdown
          <RegistryIcon lucide='ArrowUpRightIcon' aria-hidden='true' className='size-3.5' />
        </Link>
      }
    >
      <dl className='mt-1 grid gap-2 text-sm'>
        {rows.map(([label, value, tone]) => (
          <div key={label} className='flex items-center gap-2'>
            <span aria-hidden='true' className={`size-2 rounded-full ${dot[tone]}`} />
            <dt className='text-text-muted flex-1'>{label}</dt>
            <dd className='font-medium tabular-nums'>{value}</dd>
          </div>
        ))}
      </dl>
    </StatCard>
  );
}
