import { useState } from 'react';
import { Label } from '@gaudi/design-system/core/Field';
import { PhoneInput } from '@gaudi/design-system/core/PhoneInput';

const number = { US: ['2125551234', '+12125551234'], GB: ['7400123456', '+447400123456'], FR: ['612345678', '+33612345678'] };

const contacts = [
  { id: 'mobile', label: 'Mobile', hint: 'Used for sign-in codes' },
  { id: 'work', label: 'Work', country: 'GB', value: number.GB[1], hint: 'Office line, London' },
  { id: 'emergency', label: 'Emergency contact', country: 'FR', value: '+3361234', error: 'Enter the full number' }
];

const [mobile] = contacts;

function ContactNumber({ contact, onChange, disabled, ...args }) {
  const country = contact.country || args.defaultCountry;
  const [value, setValue] = useState(contact.value || number[country][1]);
  const featured = contact === mobile;
  const message = contact.error || contact.hint;
  return (
    <div className='flex flex-col gap-1.5'>
      <Label htmlFor={`phone-${contact.id}`}>{contact.label}</Label>
      <PhoneInput
        {...args}
        id={`phone-${contact.id}`}
        defaultCountry={country}
        disabled={featured && disabled}
        aria-invalid={contact.error ? true : undefined}
        aria-describedby={`phone-${contact.id}-message`}
        value={value}
        onChange={(next) => {
          setValue(next);
          if (featured) onChange?.(next);
        }}
      />
      <p id={`phone-${contact.id}-message`} className={`text-xs ${contact.error ? 'text-ui-destructive' : 'text-ui-muted-foreground'}`}>{message}</p>
    </div>
  );
}

export const exampleDefaults = { defaultCountry: 'US', variant: 'default', international: false, disabled: false };

export function PlaygroundDemo(props) {
  const args = { ...exampleDefaults, ...props };
  return <div className='flex flex-col gap-4'>
      {contacts.map((contact) => (
        // The base input reads its country and format once, so a change remounts the field.
        <ContactNumber key={`${contact.id}-${args.defaultCountry}-${args.international}`} contact={contact} {...args} />
      ))}
    </div>;
}

export { number, mobile };
