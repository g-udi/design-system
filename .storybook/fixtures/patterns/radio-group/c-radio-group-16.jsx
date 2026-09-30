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
    <RadioGroup
      defaultValue='viewer'
      className='mx-auto flex w-auto flex-wrap items-center gap-6'
    >
      <Field orientation='horizontal' className='w-auto'>
        <RadioGroupItem value='admin' id='role-admin' />
        <FieldLabel htmlFor='role-admin' className='cursor-pointer'>
          Admin
        </FieldLabel>
      </Field>
      <Field orientation='horizontal' className='w-auto'>
        <RadioGroupItem value='editor' id='role-editor' />
        <FieldLabel htmlFor='role-editor' className='cursor-pointer'>
          Editor
        </FieldLabel>
      </Field>
      <Field orientation='horizontal' className='w-auto'>
        <RadioGroupItem value='viewer' id='role-viewer' />
        <FieldLabel htmlFor='role-viewer' className='cursor-pointer'>
          Viewer
        </FieldLabel>
      </Field>
    </RadioGroup>
  );
}
