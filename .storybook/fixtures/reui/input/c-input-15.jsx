// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { default as Button } from '../../../../src/components/core/Button/index.js';
import {
  Field,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../../../src/components/core/Select/parts/select.jsx';
export function Pattern() {
  return (
    <form className='w-full'>
      <FieldGroup>
        <div className='grid grid-cols-2 gap-4'>
          <Field>
            <FieldLabel htmlFor='form-phone'>Phone</FieldLabel>
            <Input id='form-phone' type='tel' placeholder='+1 (555) 123-4567' />
          </Field>
          <Field>
            <FieldLabel htmlFor='form-country'>Country</FieldLabel>
            <Select defaultValue='us'>
              <SelectTrigger aria-label='Choose an option' id='form-country'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='us'>United States</SelectItem>
                <SelectItem value='uk'>United Kingdom</SelectItem>
                <SelectItem value='ca'>Canada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor='form-address'>Address</FieldLabel>
          <Input id='form-address' type='text' placeholder='123 Main St' />
        </Field>
        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='outline'>
            Cancel
          </Button>
          <Button type='submit'>Submit</Button>
        </div>
      </FieldGroup>
    </form>
  );
}
