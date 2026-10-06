import { useState } from 'react';
import { default as Button } from '@gaudi/design-system/core/Button';
import {
  FieldRoot as Field,
  FieldDescriptionPrimitive as FieldDescription,
  FieldGroup,
  FieldLabelPrimitive as FieldLabel,
  FieldSeparator
} from '@gaudi/design-system/core/Field';
import { FieldInput as Input } from '@gaudi/design-system/core/Field';
import {
  SelectRoot as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@gaudi/design-system/core/Select';
import { EmailInput } from '@gaudi/design-system/core/Input';
export function Pattern() {
  const [feedback, setFeedback] = useState('');
  const [role, setRole] = useState('member');
  return (
    <form className='mx-auto w-full max-w-lg' onSubmit={(event) => { event.preventDefault(); setFeedback(`Invitation for ${new FormData(event.currentTarget).get('email')} prepared in this demo. No email was sent.`); }} onReset={() => { setRole('member'); setFeedback('Invitation cleared.'); }}>
      <FieldGroup>
        <Field orientation='responsive'>
          <FieldLabel htmlFor='resp-first'>First Name</FieldLabel>
          <Input id='resp-first' name='firstName' required placeholder='First name' />
        </Field>
        <Field orientation='responsive'>
          <FieldLabel htmlFor='resp-last'>Last Name</FieldLabel>
          <Input id='resp-last' name='lastName' required placeholder='Last name' />
        </Field>
        <Field orientation='responsive'>
          <FieldLabel htmlFor='resp-email'>Email</FieldLabel>
          <EmailInput id='resp-email' name='email' required  placeholder='you@example.com' />
        </Field>
        <Field orientation='responsive'>
          <FieldLabel htmlFor='resp-role'>Role</FieldLabel>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger aria-label='Select role' id='resp-role'>
              <SelectValue placeholder='Select role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='admin'>Admin</SelectItem>
              <SelectItem value='member'>Member</SelectItem>
              <SelectItem value='viewer'>Viewer</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator />
        <FieldDescription>
          This demo validates invitation details locally without sending email.
        </FieldDescription>
        <div className='flex justify-end gap-2'>
          <Button type='reset' variant='outline'>Cancel</Button>
          <Button type='submit'>Send Invite</Button>
        </div>
        <p role='status' className='text-xs text-text-muted'>{feedback}</p>
      </FieldGroup>
    </form>
  );
}
