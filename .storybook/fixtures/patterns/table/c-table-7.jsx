import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '../../../../src/components/core/Avatar/parts/avatar.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
const orders = [
  {
    id: '#3210',
    customer: 'Olivia Martin',
    email: 'olivia@example.com',
    avatar:
      'https://randomuser.me/api/portraits/men/32.jpg',
    amount: '$1,999.00',
    status: 'Paid',
    statusVariant: 'success',
    date: 'Feb 1, 2025'
  },
  {
    id: '#3209',
    customer: 'Jackson Lee',
    email: 'jackson@example.com',
    avatar:
      'https://randomuser.me/api/portraits/women/44.jpg',
    amount: '$39.00',
    status: 'Pending',
    statusVariant: 'warning',
    date: 'Jan 28, 2025'
  },
  {
    id: '#3208',
    customer: 'Isabella Nguyen',
    email: 'isabella@example.com',
    avatar:
      'static/images/art/1.svg',
    amount: '$299.00',
    status: 'Paid',
    statusVariant: 'success',
    date: 'Jan 25, 2025'
  },
  {
    id: '#3207',
    customer: 'William Kim',
    email: 'will@example.com',
    avatar:
      'static/images/art/5.svg',
    amount: '$99.00',
    status: 'Refunded',
    statusVariant: 'destructive-light',
    date: 'Jan 22, 2025'
  },
  {
    id: '#3206',
    customer: 'Sofia Davis',
    email: 'sofia@example.com',
    avatar:
      'static/images/art/7.svg',
    amount: '$2,500.00',
    status: 'Paid',
    statusVariant: 'success',
    date: 'Jan 18, 2025'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className='font-mono text-sm'>{order.id}</TableCell>
              <TableCell>
                <div className='flex items-center gap-3'>
                  <Avatar size='sm'>
                    <AvatarImage src={order.avatar} alt={order.customer} />
                    <AvatarFallback>
                      {order.customer
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium'>
                      {order.customer}
                    </span>
                    <span className='text-ui-muted-foreground text-xs'>
                      {order.date}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={order.statusVariant} size='sm'>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className='text-right text-sm font-medium'>
                {order.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
