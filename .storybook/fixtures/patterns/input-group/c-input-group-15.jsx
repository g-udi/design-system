import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '../../../../src/components/core/Input/parts/input-group.jsx';
import { Spinner } from '../../../../src/components/core/Spinner/parts/spinner.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs' data-disabled='true'>
      <InputGroup>
        <InputGroupInput
          aria-label='Username'
          defaultValue='shadcn_ui'
          disabled
        />
        <InputGroupAddon align='inline-end'>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
