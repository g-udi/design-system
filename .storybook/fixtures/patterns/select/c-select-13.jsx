import { default as Button } from '../../../../src/components/core/Button/index.js';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

// A select sharing a row with an input and a button, sized to its content while
// the input takes the remaining width.
export function Pattern() {
  return (
    <div className='mx-auto flex w-full max-w-md items-center gap-2'>
      <Input aria-label='Search members' placeholder='Search members' className='min-w-0 flex-1' />
      <Select defaultValue='all'>
        <SelectTrigger aria-label='Filter by status' className='w-28 shrink-0'>
          <SelectValue />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button>Search</Button>
    </div>
  );
}
