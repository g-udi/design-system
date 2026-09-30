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
  { label: 'Select an option', value: null },
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' }
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
            {items.slice(1).map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className='pr-2! pl-8 [&>span:first-child]:right-auto! [&>span:first-child]:left-2!'
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
