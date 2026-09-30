// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' }
];
const vegetables = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Broccoli', value: 'broccoli' },
  { label: 'Spinach', value: 'spinach' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select>
        <SelectTrigger aria-label='Select an option'>
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            {fruits.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            {vegetables.map((item) => (
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
