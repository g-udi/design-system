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
const frontend = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' }
];
const backend = [
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Python', value: 'python' },
  { label: 'Go', value: 'go' }
];
const _allItems = [
  { label: 'Select a framework', value: null },
  ...frontend,
  ...backend
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select>
        <SelectTrigger aria-label='Select a framework'>
          <SelectValue placeholder='Select a framework' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            <SelectLabel>Frontend</SelectLabel>
            {frontend.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Backend</SelectLabel>
            {backend.map((item) => (
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
