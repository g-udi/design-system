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
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
const categories = [
  {
    value: 'documents',
    label: 'Documents',
    icon: <RegistryIcon lucide='FileTextIcon' className='size-4' />
  },
  {
    value: 'images',
    label: 'Images',
    icon: <RegistryIcon lucide='ImageIcon' className='size-4' />
  },
  {
    value: 'videos',
    label: 'Videos',
    icon: <RegistryIcon lucide='VideoIcon' className='size-4' />
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: <RegistryIcon lucide='MusicIcon' className='size-4' />
  },
  {
    value: 'archives',
    label: 'Archives',
    icon: <RegistryIcon lucide='ArchiveIcon' className='size-4' />
  }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={categories[0].value}>
        <SelectTrigger aria-label='Select category' className='w-[200px]'>
          <SelectValue placeholder='Select category' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <span className='flex items-center gap-2'>
                  {category.icon}
                  <span>{category.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
