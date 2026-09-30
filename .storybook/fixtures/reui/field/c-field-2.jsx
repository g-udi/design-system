// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from '../../../../src/components/core/Field/parts/field.jsx';
import { FieldInput as Input } from '../../../../src/components/core/Field/index.js';
import { default as Textarea } from '../../../../src/components/core/Textarea/index.js';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='ticket-subject'>Subject</FieldLabel>
          <Input id='ticket-subject' placeholder='Briefly describe the issue' />
          <FieldDescription>
            Use a clear and descriptive subject line.
          </FieldDescription>
        </Field>
        <Field>
          <div className='flex items-center justify-between'>
            <FieldLabel htmlFor='ticket-message'>Message</FieldLabel>
            <span className='text-ui-muted-foreground text-xs'>0/500</span>
          </div>
          <Textarea
            id='ticket-message'
            placeholder='Tell us more about your problem…'
            className='min-h-[120px]'
          />
          <FieldDescription>
            Include any relevant details to help us resolve your issue.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  );
}
