import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const filterItems = [
  { label: 'Filter', value: null },
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];
export function Pattern() {
  return (
    <div className='flex w-full max-w-xs items-center gap-2'>
      <Input
        aria-label='Search...'
        placeholder='Search...'
        className='flex-1'
      />
      <Select>
        <SelectTrigger aria-label='Filter' className='w-[140px]'>
          <SelectValue placeholder='Filter' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {filterItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
