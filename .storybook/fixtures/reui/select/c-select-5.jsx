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
const items = [
  { label: 'Select a fruit', value: null },
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select>
        <SelectTrigger aria-label='Select a fruit' size='sm'>
          <SelectValue placeholder='Select a fruit' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
