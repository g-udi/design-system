// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='w-full max-w-xs'>
      <InputGroup className='h-auto'>
        <InputGroupInput aria-label='First name' placeholder='First name' />
        <InputGroupAddon align='block-start'>
          <InputGroupText className='font-medium'>User Profile</InputGroupText>
          <RegistryIcon lucide='InfoIcon' className='ml-auto' />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
