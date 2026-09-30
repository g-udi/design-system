import {
  Field,
  FieldError,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
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
    <Field className='max-w-xs' data-invalid>
      <FieldLabel htmlFor='select-fruit-invalid'>Favorite Fruit</FieldLabel>
      <Select>
        <SelectTrigger
          aria-label='Select a fruit'
          id='select-fruit-invalid'
          aria-invalid
        >
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
      <FieldError errors={[{ message: 'Please select a valid fruit.' }]} />
    </Field>
  );
}
