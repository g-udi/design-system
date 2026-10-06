import { TableRoot, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell } from '@gaudi/design-system/mdx/Table';
import {
  ScrollArea,
  ScrollBar
} from '@gaudi/design-system/core/ScrollArea';
const products = [
  {
    name: 'Starter',
    price: '$9/mo',
    storage: '10GB',
    users: '1',
    support: 'Email',
    api: 'Limited',
    backups: 'Weekly',
    analytics: 'Basic'
  },
  {
    name: 'Professional',
    price: '$29/mo',
    storage: '100GB',
    users: '5',
    support: 'Priority',
    api: 'Standard',
    backups: 'Daily',
    analytics: 'Advanced'
  },
  {
    name: 'Business',
    price: '$99/mo',
    storage: '500GB',
    users: '20',
    support: '24/7',
    api: 'Full',
    backups: 'Real-time',
    analytics: 'Premium'
  },
  {
    name: 'Enterprise',
    price: '$299/mo',
    storage: '2TB',
    users: 'Unlimited',
    support: 'Dedicated',
    api: 'Custom',
    backups: 'Continuous',
    analytics: 'Enterprise'
  },
  {
    name: 'Basic',
    price: '$5/mo',
    storage: '5GB',
    users: '1',
    support: 'Community',
    api: 'None',
    backups: 'Monthly',
    analytics: 'None'
  },
  {
    name: 'Team',
    price: '$49/mo',
    storage: '250GB',
    users: '10',
    support: 'Business Hours',
    api: 'Standard',
    backups: 'Daily',
    analytics: 'Standard'
  },
  {
    name: 'Premium',
    price: '$149/mo',
    storage: '1TB',
    users: '50',
    support: '24/7',
    api: 'Full',
    backups: 'Real-time',
    analytics: 'Premium'
  },
  {
    name: 'Ultimate',
    price: '$499/mo',
    storage: '5TB',
    users: 'Unlimited',
    support: 'Dedicated',
    api: 'Custom',
    backups: 'Continuous',
    analytics: 'Enterprise'
  }
];
const features = [
  { label: 'Storage', key: 'storage' },
  { label: 'Users', key: 'users' },
  { label: 'Support', key: 'support' },
  { label: 'API Access', key: 'api' },
  { label: 'Backups', key: 'backups' },
  { label: 'Analytics', key: 'analytics' }
];
export function Pattern() {
  return (
    <ScrollArea className='mx-auto h-64 w-full max-w-md rounded-2xl border border-ui-border'>
      <TableRoot aria-label='Plan comparison' containerProps={{ className: 'min-w-[600px] overflow-visible' }}>
        <TableHeader>
          <TableRow>
            <TableHead scope='col'>Plan</TableHead>
            <TableHead scope='col' className='min-w-36 text-right'>Price</TableHead>
            {features.map((feature) => (
              <TableHead key={feature.key} scope='col' className='min-w-36 text-center'>
                {feature.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.name}>
              <TableCell as='th' scope='row'>{product.name}</TableCell>
              <TableCell className='text-right'>{product.price}</TableCell>
              {features.map((feature) => (
                <TableCell key={feature.key} className='text-center'>
                  {product[feature.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
