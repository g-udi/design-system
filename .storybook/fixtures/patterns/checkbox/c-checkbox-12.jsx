import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import { Checkbox } from '../../../../src/components/core/Checkbox/parts/checkbox.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <FieldGroup className='gap-0'>
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle className='flex items-center gap-2'>
              <RegistryIcon
                lucide='LaptopIcon'
                aria-hidden='true'
                className='size-4 opacity-60'
              />
              Push notifications
            </FieldTitle>
            <Checkbox defaultChecked />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle className='flex items-center gap-2'>
              <RegistryIcon
                lucide='MailIcon'
                aria-hidden='true'
                className='size-4 opacity-60'
              />
              Email notifications
            </FieldTitle>
            <Checkbox />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle className='flex items-center gap-2'>
              <RegistryIcon
                lucide='SmartphoneIcon'
                aria-hidden='true'
                className='size-4 opacity-60'
              />
              SMS notifications
            </FieldTitle>
            <Checkbox />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}
