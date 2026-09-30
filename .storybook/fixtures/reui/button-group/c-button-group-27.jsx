// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { cn } from '../../../../src/utilities/cn/index.js';
import { ButtonGroup } from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
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
    <ButtonGroup className='max-w-xs'>
      <Select defaultValue='2'>
        <SelectTrigger aria-label='Select status' className='min-w-36'>
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
      <Input aria-label='Search tasks...' placeholder='Search tasks...' />
    </ButtonGroup>
  );
}
