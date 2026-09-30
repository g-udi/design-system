// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../../../../src/components/mdx/Table/parts/table.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const subscriptions = [
  {
    service: 'Vercel Pro',
    plan: 'Pro',
    planVariant: 'default',
    billing: '$20/mo',
    nextBilling: 'Mar 1, 2025',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    service: 'GitHub Enterprise',
    plan: 'Enterprise',
    planVariant: 'info',
    billing: '$21/user/mo',
    nextBilling: 'Mar 15, 2025',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    service: 'Figma Organization',
    plan: 'Organization',
    planVariant: 'warning-light',
    billing: '$45/editor/mo',
    nextBilling: 'Apr 1, 2025',
    status: 'Active',
    statusVariant: 'success-light'
  },
  {
    service: 'Slack Business+',
    plan: 'Business+',
    planVariant: 'secondary',
    billing: '$12.50/user/mo',
    nextBilling: '\u2014',
    status: 'Cancelled',
    statusVariant: 'destructive-light'
  },
  {
    service: 'Linear Standard',
    plan: 'Standard',
    planVariant: 'outline',
    billing: '$8/user/mo',
    nextBilling: 'Mar 20, 2025',
    status: 'Trial',
    statusVariant: 'info-light'
  }
];
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-2xl flex-col'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Billing</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((sub) => (
            <TableRow key={sub.service}>
              <TableCell>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>{sub.service}</span>
                  <span className='text-ui-muted-foreground text-xs'>
                    Next: {sub.nextBilling}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={sub.planVariant} size='sm'>
                  {sub.plan}
                </Badge>
              </TableCell>
              <TableCell className='text-sm'>{sub.billing}</TableCell>
              <TableCell>
                <Badge variant={sub.statusVariant} size='sm'>
                  {sub.status}
                </Badge>
              </TableCell>
              <TableCell className='text-right'>
                <Button variant='ghost' size='sm' className='h-7'>
                  <RegistryIcon
                    lucide='SettingsIcon'
                    className='size-3.5'
                    aria-hidden='true'
                  />
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
