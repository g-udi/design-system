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
const fonts = [
  { value: 'sans', label: 'Inter', className: 'font-sans' },
  { value: 'mono', label: 'Mono', className: 'font-mono' },
  { value: 'serif', label: 'Serif', className: 'font-serif' }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={fonts[0].value}>
        <SelectTrigger aria-label='Select font' className='w-[200px]'>
          <SelectValue placeholder='Select font' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {fonts.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span className={font.className}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
