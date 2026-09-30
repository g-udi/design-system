import { Badge } from '../../../../src/components/core/Pill/parts/badge-extended.jsx';
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const priorities = [
  { value: 'none', label: 'No Priority', variant: 'outline' },
  { value: 'urgent', label: 'Urgent', variant: 'destructive' },
  { value: 'high', label: 'High', variant: 'warning' },
  { value: 'medium', label: 'Medium', variant: 'warning-light' },
  { value: 'low', label: 'Low', variant: 'info' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={priorities[0].value}>
        <SelectTrigger aria-label='Select priority' className='w-[200px]'>
          <SelectValue placeholder='Select priority' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                <span className='flex items-center gap-2'>
                  <Badge variant={priority.variant} size='sm'>
                    {priority.label}
                  </Badge>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
