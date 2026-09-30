// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  ButtonGroup,
  ButtonGroupText
} from '../../../../src/components/core/ButtonGroup/parts/button-group.jsx';
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
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <InputGroup>
          <InputGroupInput aria-label='example' placeholder='example' />
          <InputGroupAddon align='inline-end'>
            <RegistryIcon
              lucide='InfoIcon'
              className='text-ui-muted-foreground size-4'
            />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </Field>
  );
}
