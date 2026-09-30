import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { Switch } from '../../../../src/components/core/Switch/parts/switch.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <FieldGroup className='gap-0'>
        <Field>
          <FieldLabel className='justify-between px-4 py-3'>
            <FieldTitle className='flex items-center gap-2'>
              <RegistryIcon
                lucide='BellIcon'
                aria-hidden='true'
                className='size-4 opacity-60'
              />
              Push notifications
            </FieldTitle>
            <Switch defaultChecked />
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
            <Switch />
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
            <Switch />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}
