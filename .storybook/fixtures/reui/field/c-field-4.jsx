// Adapted from ReUI (MIT), copyright 2025 Keenthemes Inc. See THIRD_PARTY_NOTICES.md.
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
export function Pattern() {
  return (
    <div className='mx-auto w-full max-w-xs'>
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant='label'>Email Notifications</FieldLegend>
          <FieldGroup className='gap-4'>
            <Field orientation='horizontal'>
              <Checkbox
                aria-label='Product updates'
                id='notify-updates'
                defaultChecked
              />
              <FieldContent>
                <FieldTitle>Product updates</FieldTitle>
                <FieldDescription>
                  Receive emails about new features and improvements.
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation='horizontal'>
              <Checkbox
                aria-label='Security alerts'
                id='notify-security'
                defaultChecked
                disabled
              />
              <FieldContent>
                <FieldTitle>Security alerts</FieldTitle>
                <FieldDescription>
                  Critical security notifications cannot be disabled.
                </FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant='label'>Profile Privacy</FieldLegend>
          <RadioGroup defaultValue='public'>
            <FieldGroup className='gap-2'>
              <Field orientation='horizontal'>
                <RadioGroupItem value='public' id='privacy-public' />
                <FieldLabel htmlFor='privacy-public' className='font-normal'>
                  Public - visible to everyone
                </FieldLabel>
              </Field>
              <Field orientation='horizontal'>
                <RadioGroupItem value='private' id='privacy-private' />
                <FieldLabel htmlFor='privacy-private' className='font-normal'>
                  Private - only visible to you
                </FieldLabel>
              </Field>
            </FieldGroup>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  );
}
