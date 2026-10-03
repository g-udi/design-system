import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../../../../src/components/core/DropdownMenu/parts/dropdown-menu.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const orders = [
  { id: '#3210', customer: 'Olivia Martin', email: 'olivia@example.com', photo: 'women/44', item: 'Studio headphones', sku: 'AUD-2201', amount: '$1,999.00', status: 'Paid', statusVariant: 'success-light', date: 'Feb 1, 2025' },
  { id: '#3209', customer: 'Jackson Lee', email: 'jackson@example.com', photo: 'men/32', item: 'Desk lamp', sku: 'LGT-0412', amount: '$39.00', status: 'Pending', statusVariant: 'warning-light', date: 'Jan 28, 2025' },
  { id: '#3208', customer: 'Isabella Nguyen', email: 'isabella@example.com', photo: 'women/68', item: 'Mechanical keyboard', sku: 'KEY-1180', amount: '$299.00', status: 'Paid', statusVariant: 'success-light', date: 'Jan 25, 2025' },
  { id: '#3207', customer: 'William Kim', email: 'will@example.com', photo: 'men/75', item: 'USB-C hub', sku: 'HUB-0707', amount: '$99.00', status: 'Refunded', statusVariant: 'destructive-light', date: 'Jan 22, 2025' },
  { id: '#3206', customer: 'Sofia Davis', email: 'sofia@example.com', photo: 'women/12', item: 'Monitor arm', sku: 'ARM-3300', amount: '$2,500.00', status: 'Shipped', statusVariant: 'info-light', date: 'Jan 18, 2025' }
];
const initials = (name) => name.split(' ').map((part) => part[0]).join('');
function RowActions({ order }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon-sm' aria-label={`Actions for order ${order.id}`}>
          <RegistryIcon lucide='MoreHorizontalIcon' aria-hidden='true' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem>View order</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive'>Refund</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-20'>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Item</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Amount</TableHead>
            <TableHead className='w-10'>
              <span className='sr-only'>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-mono text-xs text-text-muted'>{order.id}</TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <Avatar size='sm'>
                    <AvatarImage src={`/avatars/${order.photo}.jpg`} alt='' />
                    <AvatarFallback>{initials(order.customer)}</AvatarFallback>
                  </Avatar>
                  <div className='flex min-w-0 flex-col'>
                    <span className='truncate text-sm font-medium'>{order.customer}</span>
                    <span className='truncate text-xs text-text-muted'>{order.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex items-center gap-2'>
                  <span className='flex size-8 shrink-0 items-center justify-center rounded-sm bg-surface-muted'>
                    <RegistryIcon lucide='PackageIcon' className='size-4 text-text-muted' aria-hidden='true' />
                  </span>
                  <div className='flex min-w-0 flex-col'>
                    <span className='truncate text-sm'>{order.item}</span>
                    <span className='font-mono text-xs text-text-muted'>{order.sku}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className='flex flex-col items-start gap-0.5'>
                  <Badge variant={order.statusVariant} size='sm'>{order.status}</Badge>
                  <span className='text-xs text-text-muted'>{order.date}</span>
                </div>
              </TableCell>
              <TableCell className='text-right text-sm font-medium tabular-nums'>{order.amount}</TableCell>
              <TableCell>
                <RowActions order={order} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
