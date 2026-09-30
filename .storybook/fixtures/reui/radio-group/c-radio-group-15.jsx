// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Badge } from '../../../../src/components/core/Pill/parts/badge.jsx';
import {
  Field,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <RadioGroup defaultValue='stable' className='w-fit'>
      <Field orientation='horizontal'>
        <RadioGroupItem value='stable' id='ch-stable' />
        <div className='flex items-center gap-2'>
          <FieldLabel htmlFor='ch-stable'>Stable</FieldLabel>
          <Badge
            variant='secondary'
            className='h-4.5 rounded-control px-1.5 text-[10px] tracking-wider uppercase'
          >
            Recommended
          </Badge>
        </div>
      </Field>
      <Field orientation='horizontal'>
        <RadioGroupItem value='beta' id='ch-beta' />
        <div className='flex items-center gap-2'>
          <FieldLabel htmlFor='ch-beta'>Beta</FieldLabel>
          <Badge className='h-4.5 rounded-control px-1.5 text-[10px] tracking-wider uppercase'>
            New
          </Badge>
        </div>
      </Field>
      <Field orientation='horizontal'>
        <RadioGroupItem value='canary' id='ch-canary' />
        <FieldLabel htmlFor='ch-canary'>Canary</FieldLabel>
      </Field>
    </RadioGroup>
  );
}
