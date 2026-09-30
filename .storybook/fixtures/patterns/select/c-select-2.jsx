'use client';
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
const items = [
  {
    label: 'Select an option',
    value: null,
    icon: (
      <RegistryIcon
        lucide='ScanIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    label: 'Dashboard',
    value: 'dashboard',
    icon: (
      <RegistryIcon
        lucide='LayoutDashboardIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    label: 'Activity',
    value: 'activity',
    icon: (
      <RegistryIcon
        lucide='ActivityIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    label: 'Security',
    value: 'security',
    icon: (
      <RegistryIcon
        lucide='ShieldIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  },
  {
    label: 'Settings',
    value: 'settings',
    icon: (
      <RegistryIcon
        lucide='SettingsIcon'
        className='text-ui-muted-foreground size-4'
      />
    )
  }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select>
        <SelectTrigger aria-label='Select an option' className='w-[200px]'>
          <SelectValue placeholder='Select an option' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {items.slice(1).map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.icon}
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
