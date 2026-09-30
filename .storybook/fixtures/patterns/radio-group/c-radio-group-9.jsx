import { Card } from '../../../../src/components/core/Card/parts/card.jsx';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle
} from '../../../../src/components/core/Field/parts/field.jsx';
import {
  RadioGroup,
  RadioGroupItem
} from '../../../../src/components/core/RadioGroup/parts/radio-group.jsx';
import { Separator } from '../../../../src/components/core/Separator/parts/separator.jsx';
import { RegistryIcon } from '../../../../src/icons/RegistryIcon.jsx';
export function Pattern() {
  return (
    <Card className='w-full max-w-xs p-0'>
      <RadioGroup defaultValue='email'>
        <FieldGroup className='gap-0'>
          <Field>
            <FieldLabel className='justify-between px-4 py-3'>
              <FieldTitle className='flex items-center gap-2'>
                <RegistryIcon
                  lucide='MailIcon'
                  aria-hidden='true'
                  className='size-4 opacity-60'
                />
                Email
              </FieldTitle>
              <RadioGroupItem value='email' id='contact-email' />
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
                Phone
              </FieldTitle>
              <RadioGroupItem value='phone' id='contact-phone' />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className='justify-between px-4 py-3'>
              <FieldTitle className='flex items-center gap-2'>
                <RegistryIcon
                  lucide='MessageCircleIcon'
                  aria-hidden='true'
                  className='size-4 opacity-60'
                />
                Chat
              </FieldTitle>
              <RadioGroupItem value='chat' id='contact-chat' />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </RadioGroup>
    </Card>
  );
}
