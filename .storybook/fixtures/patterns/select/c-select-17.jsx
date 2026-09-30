import { cn } from '../../../../src/utilities/cn/index.js';
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
  { value: '1', label: 'In Progress', color: 'bg-violet-500' },
  { value: '2', label: 'Completed', color: 'bg-green-500' },
  { value: '3', label: 'Pending', color: 'bg-ui-primary' },
  { value: '4', label: 'Cancelled', color: 'bg-yellow-500' },
  { value: '5', label: 'Rejected', color: 'bg-ui-destructive' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={statuses[1].value}>
        <SelectTrigger aria-label='Select status'>
          <SelectValue placeholder='Select status' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                <span className='flex items-center gap-2'>
                  <span className={cn('size-1.5 rounded-full', status.color)} />
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
