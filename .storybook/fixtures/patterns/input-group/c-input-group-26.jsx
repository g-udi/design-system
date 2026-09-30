import { Field } from '../../../../src/components/core/Field/parts/field.jsx';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from '../../../../src/components/core/Input/parts/input-group.jsx';
export function Pattern() {
  return (
    <Field className='max-w-xs'>
      <InputGroup>
        <InputGroupTextarea
          aria-label='Share your thoughts...'
          placeholder='Share your thoughts...'
          className='min-h-24'
        />
        <InputGroupAddon align='block-end'>
          <InputGroupButton variant='secondary' size='sm'>
            Cancel
          </InputGroupButton>
          <InputGroupButton variant='default' size='sm' className='ml-auto'>
            Post Comment
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
