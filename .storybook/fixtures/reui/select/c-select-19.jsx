// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const statuses = [
  { value: '1', label: 'In Progress', variant: 'warning-outline' },
  { value: '2', label: 'Completed', variant: 'success-outline' },
  { value: '3', label: 'Pending', variant: 'info-outline' },
  { value: '4', label: 'Cancelled', variant: 'primary-outline' },
  { value: '5', label: 'Rejected', variant: 'destructive-outline' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={statuses[2].value}>
        <SelectTrigger aria-label='Select status' className='w-[200px]'>
          <span className='flex items-center gap-2'>
            Status:
            <SelectValue placeholder='Select status' />
          </span>
        </SelectTrigger>
        <SelectContent position='popper'>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <Badge variant={status.variant}>{status.label}</Badge>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}
