import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Label } from '../Field';
import { PhoneInput } from './index.js';

const docs = getComponentDocs('Core/PhoneInput');
// National digits a person types, and the E.164 value each country normalizes them to.
const number = { US: ['2125551234', '+12125551234'], GB: ['7400123456', '+447400123456'], FR: ['612345678', '+33612345678'] };
// A contact form: mobile follows every control; work stays settled and the emergency number is incomplete.
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
          if (featured) onChange(next);
        }}
      />
      <p id={`phone-${contact.id}-message`} className={`text-xs ${contact.error ? 'text-ui-destructive' : 'text-ui-muted-foreground'}`}>{message}</p>
    </div>
  );
}

export default {
  title: 'Core/Inputs/PhoneInput',
  id: 'core-phoneinput',
  component: PhoneInput,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    defaultCountry: Object.keys(number),
    variant: ['sm', 'default', 'lg'],
    international: 'boolean',
    disabled: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-sm'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { defaultCountry: 'US', variant: 'default', international: false, disabled: false, onChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A contact form with a saved UK work line and an incomplete, invalid emergency number. The mobile field follows every control: `defaultCountry` swaps its flag and number, `international` reformats every saved number with its calling code, `variant` resizes all three, and `disabled` locks the mobile field.' },
      source: playgroundSource('PhoneInput', {
        imports: "import { useState } from 'react';\nimport { PhoneInput } from '@gaudi/design-system';\n\nconst [phone, setPhone] = useState('');",
        attributes: ["aria-label='Mobile'", 'value={phone}', 'onChange={setPhone}']
      })
    }
  },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      {contacts.map((contact) => (
        // The base input reads its country and format once, so a change remounts the field.
        <ContactNumber key={`${contact.id}-${args.defaultCountry}-${args.international}`} contact={contact} {...args} />
      ))}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: mobile.label });
    const [digits, e164] = number[args.defaultCountry];
    await expect(input.value.replace(/\D/g, '')).toBe((args.international ? e164 : digits).replace(/\D/g, '').replace(/^0/, ''));
    await expect(canvas.getByRole('textbox', { name: 'Emergency contact' })).toHaveAttribute('aria-invalid', 'true');
    if (args.disabled) return expect(input).toBeDisabled();
    if (args.international) return expect(input.value).toMatch(/^\+/);
    await userEvent.clear(input);
    await expect(args.onChange).toHaveBeenLastCalledWith('');
    await userEvent.type(input, digits);
    await expect(args.onChange).toHaveBeenLastCalledWith(e164);
  }
};
