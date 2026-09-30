import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupInput aria-label='Username' defaultValue='gaudi_dev' />
        <InputGroupAddon align='inline-end'>
          <div className='flex size-4 items-center justify-center rounded-full bg-emerald-500'>
            <RegistryIcon lucide='CheckIcon' className='size-3 text-white' />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
