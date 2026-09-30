import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import {
  Kbd,
  KbdGroup
} from '../../../../src/components/core/Kbd/parts/kbd.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <RegistryIcon lucide='SparklesIcon' className='text-emerald-500' />
        </InputGroupAddon>
        <InputGroupInput
          aria-label='Ask AI to generate...'
          placeholder='Ask AI to generate...'
        />
        <InputGroupAddon align='inline-end'>
          <KbdGroup>
            <Kbd>
              <RegistryIcon lucide='CommandIcon' className='size-3' />
            </Kbd>
            <Kbd>Enter</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
