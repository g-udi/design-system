// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
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
        <InputGroupAddon>
          <RegistryIcon lucide='MicIcon' />
        </InputGroupAddon>
        <InputGroupInput aria-label='Listening...' placeholder='Listening...' />
        <InputGroupAddon align='inline-end'>
          <RegistryIcon
            lucide='RadioIcon'
            className='text-ui-destructive animate-pulse'
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
