// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const statuses = [
  { value: 'all', label: 'All Status', color: '' },
  { value: 'active', label: 'Active', color: 'bg-green-500' },
  { value: 'inactive', label: 'Inactive', color: 'bg-red-500' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-400' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={statuses[0].value}>
        <SelectTrigger aria-label='Select status'>
          <SelectValue placeholder='Select status' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className='flex items-center gap-2'>
                  {status.color && (
                    <span
                      className={`size-2 shrink-0 rounded-full ${status.color}`}
                    />
                  )}
                  <span>{status.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
