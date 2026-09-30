import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
const accessLevels = [
  {
    value: 'full_access',
    label: 'Full access',
    description: 'Can modify list access'
  },
  {
    value: 'read_write',
    label: 'Read and write',
    description: 'Can edit & publish lists'
  },
  {
    value: 'read_only',
    label: 'Read only',
    description: 'Can only view lists'
  },
  {
    value: 'no_access',
    label: 'No access',
    description: 'Cannot view or edit lists'
  }
];
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <Select defaultValue={accessLevels[1].value}>
        <SelectTrigger
          aria-label='Select access level'
          className='w-[240px] [&_small]:hidden'
        >
          <SelectValue placeholder='Select access level' />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup>
            {accessLevels.map((level) => (
              <SelectItem
                key={level.value}
                value={level.value}
                className='[&_svg]:text-ui-primary'
              >
                <span className='flex flex-col items-start gap-px'>
                  <span className='font-medium'>{level.label}</span>
                  <small className='text-ui-muted-foreground text-xs'>
                    {level.description}
                  </small>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
