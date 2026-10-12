import { SmoothCaretExample } from './fixtures/SmoothCaretExample.jsx';
import smoothCaretRaw from './fixtures/SmoothCaretExample.jsx?raw';
import { EmailInputExample } from './fixtures/EmailInputExample.jsx';
import emailInputRaw from './fixtures/EmailInputExample.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers';
import { useId, useRef, useState } from 'react';
import Button from '../../Button';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Field, { FieldDescription, FieldError, FieldLabel } from '../../Field';
import Icon from '../../Icon';
import Input from '../Input';
import { EmailInput } from '../index.js';
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement } from '../../NumberField/index.js';

const smoothCaretSource = publicSource(smoothCaretRaw, new URL('./fixtures/SmoothCaretExample.jsx', import.meta.url));
const emailInputSource = publicSource(emailInputRaw, new URL('./fixtures/EmailInputExample.jsx', import.meta.url));

const docs = getComponentDocs('Core/Input');
const label = 'Email address';
// With no `prefix`, the featured field leads with an icon for its `type`.
const typeIcons = { text: 'Type', email: 'Mail', search: 'Search', url: 'Globe', tel: 'Phone', password: 'Lock' };

export default {
  title: 'Core/Input', id: 'core-input',
  component: Input,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    type: Object.keys(typeIcons),
    caretMode: ['native', 'smooth'],
    placeholder: 'text',
    prefix: 'text',
    suffix: 'text',
    invalid: 'boolean',
    required: 'boolean',
    disabled: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, {
        primaryStory: () => Playground,
        previewControls: ['type', 'caretMode', 'placeholder', 'prefix', 'suffix', 'invalid', 'required', 'disabled'],
      })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { type: 'email', placeholder: 'you@example.com', suffix: '', invalid: true, required: true, disabled: false },
  parameters: {
    controlAudit: { interaction: ['caretMode'] },
    docs: {
      description: { story: 'A profile form using EmailInput for the email editor and NumberField for the monthly budget, so both inherit the global Caret toolbar. Other type choices use Input. caretMode overrides the featured field; required, invalid and disabled control its state.' },
      source: {
        type: 'code',
        language: 'jsx',
        transform: (_source, { args: { type, prefix, suffix, ...args } }) => previewSource(type === 'email' ? 'EmailInput' : 'Input', { ...(type === 'email' ? {} : { type }), ...args, ...(prefix ? { prefix } : {}), ...(suffix ? { suffix } : {}) }, {
          imports: `import { Field, FieldDescription, FieldError, FieldLabel, Icon, ${type === 'email' ? 'EmailInput' : 'Input'} } from '@gaudi/design-system';`,
          attributes: prefix ? [] : [`prefix={<Icon name='${typeIcons[type]}' decorative size='sm' />}`],
          before: `<Field>\n  <FieldLabel>${label}${args.required ? "<span aria-hidden='true'>*</span>" : ''}</FieldLabel>\n`,
          after: `\n  ${args.invalid ? '<FieldError>Enter an address like name@example.com.</FieldError>' : `<FieldDescription>${args.disabled ? 'Locked by your workspace admin.' : 'Receipts and sign-in links go here.'}</FieldDescription>`}\n</Field>`
        })
      }
    }
  },
  render: function Render({ type, prefix, suffix, ...args }) {
    const [search, setSearch] = useState('');
    const searchRef = useRef(null);
    const budgetId = useId();
    const FeaturedInput = type === 'email' ? EmailInput : Input;
    return (
    <div className='ds-stack'>
      <Field>
        <FieldLabel>{label}{args.required ? <span aria-hidden='true' className='text-danger'>*</span> : null}</FieldLabel>
        <FeaturedInput {...args} {...(type === 'email' ? {} : { type })} prefix={prefix || <Icon name={typeIcons[type]} decorative size='sm' />} suffix={suffix || undefined} />
        {args.invalid ? <FieldError>Enter an address like name@example.com.</FieldError> : <FieldDescription>{args.disabled ? 'Locked by your workspace admin.' : 'Receipts and sign-in links go here.'}</FieldDescription>}
      </Field>
      <div className='grid gap-4 sm:grid-cols-2'>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input prefix='@' defaultValue='amira' />
        </Field>
        <Field>
          <FieldLabel htmlFor={budgetId}>Monthly budget</FieldLabel>
          <NumberField id={budgetId} name='budget' defaultValue={120} min={0} step={1} locale='en-US' format={{ style: 'currency', currency: 'USD' }}>
            <NumberFieldGroup>
              <NumberFieldDecrement aria-label='Decrease monthly budget' />
              <NumberFieldInput />
              <NumberFieldIncrement aria-label='Increase monthly budget' />
            </NumberFieldGroup>
          </NumberField>
        </Field>
      </div>
      <Field>
        <FieldLabel>Website</FieldLabel>
        <Input type='url' prefix='https://' placeholder='example.com' />
      </Field>
      <Field>
        <FieldLabel>Search profile</FieldLabel>
        <Input
          ref={searchRef}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Type to reveal the search actions'
          prefix={search ? <Icon name='Search' decorative size='sm' /> : null}
          suffix={search ? <Button variant='ghost' size='icon-sm' aria-label='Clear search' onClick={() => { setSearch(''); searchRef.current?.focus(); }}><Icon name='X' decorative size='sm' /></Button> : null}
        />
      </Field>
    </div>
    );
  },
  play: async ({ args, globals, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText(label, { exact: false, selector: 'input' });
    await expect(input).toHaveAttribute('type', args.type === 'email' ? 'text' : args.type);
    if (args.type === 'email') await expect(input).toHaveAttribute('inputmode', 'email');
    await expect(input).toHaveAttribute('placeholder', args.placeholder);
    if (args.required) await expect(input).toBeRequired();
    if (args.invalid) {
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(canvas.getByText('Enter an address like name@example.com.')).toBeVisible();
    }
    if (args.suffix) await expect(canvas.getByText(args.suffix)).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Username' })).toHaveValue('amira');
    const budget = canvas.getByRole('textbox', { name: 'Monthly budget' });
    await expect(budget).toHaveValue('$120.00');
    await userEvent.click(budget);
    await userEvent.keyboard('{ArrowRight}');
    if (globals.caretMode === 'smooth') await waitFor(() => expect(budget).toHaveAttribute('data-smooth-caret-active'));
    await userEvent.keyboard('{ArrowUp}');
    await expect(budget).toHaveValue('$121.00');
    await userEvent.keyboard('{ArrowDown}');
    await expect(budget).toHaveValue('$120.00');
    const website = canvas.getByRole('textbox', { name: 'Website' });
    await userEvent.type(website, 'gaudi.dev');
    await expect(website).toHaveValue('gaudi.dev');
    await expect(canvas.getByText('https://')).toBeVisible();
    await userEvent.clear(website);
    const search = canvas.getByRole('textbox', { name: 'Search profile' });
    await userEvent.type(search, 'Gaudi');
    await expect(canvas.getByRole('textbox', { name: 'Search profile' })).toBe(search);
    await expect(search).toHaveFocus();
    await expect(search).toHaveValue('Gaudi');
    await expect(search.selectionStart).toBe(5);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(canvas.getByRole('textbox', { name: 'Search profile' })).toBe(search);
    await expect(search).toHaveFocus();
    await expect(search).toHaveValue('');
    if (args.disabled) return expect(input).toBeDisabled();
    await userEvent.type(input, 'amira@example.com');
    await expect(input).toHaveValue('amira@example.com');
    if (args.type === 'email' && (args.caretMode ?? globals.caretMode) === 'smooth') {
      await waitFor(() => expect(input).toHaveAttribute('data-smooth-caret-active'));
    }
    // Leave the preview on its placeholder so `placeholder` stays visible.
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
  }
};

export const SmoothCaretMode = {
  parameters: {
    docs: {
      description: { story: 'Toggle smooth caret movement for text controls, EmailInput and NumberField. Each input can override the provider with caretMode. EmailInput validates a single address through pattern; NumberField handles numeric bounds and stepping. Plain Input type="email" or type="number" keeps its browser caret.' },
      source: { code: smoothCaretSource, language: 'jsx' },
    },
  },
  render: () => <SmoothCaretExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const title = canvas.getByRole('textbox', { name: 'Title' });
    const native = canvas.getByRole('textbox', { name: 'Native override' });
    await userEvent.click(canvas.getByRole('button', { name: 'Focus title' }));
    await expect(title).toHaveFocus();
    await waitFor(() => expect(title).toHaveAttribute('data-smooth-caret-active'));
    const before = title.value;
    await userEvent.keyboard('{End}!');
    await expect(title).toHaveValue(`${before}!`);
    const caret = () => canvasElement.ownerDocument.querySelector('[data-slot="input-caret"]');
    await waitFor(() => expect(caret()).toBeVisible());
    title.setSelectionRange(title.value.length - 1, title.value.length);
    await fireEvent.select(title);
    await waitFor(() => expect(title).not.toHaveAttribute('data-smooth-caret-active'));
    await expect(title.selectionEnd - title.selectionStart).toBe(1);
    title.setSelectionRange(title.value.length, title.value.length);
    await fireEvent.select(title);
    await waitFor(() => expect(title).toHaveAttribute('data-smooth-caret-active'));
    await fireEvent.compositionStart(title);
    await expect(title).not.toHaveAttribute('data-smooth-caret-active');
    await fireEvent.compositionEnd(title);
    await waitFor(() => expect(title).toHaveAttribute('data-smooth-caret-active'));
    await userEvent.click(native);
    await expect(native).not.toHaveAttribute('data-smooth-caret-active');
    const email = canvas.getByRole('textbox', { name: 'Email address' });
    const quantity = canvas.getByRole('textbox', { name: 'Quantity' });
    await expect(quantity).toHaveAccessibleDescription('1 to 10, in steps of 1.');
    await userEvent.click(canvas.getByText('Quantity', { exact: true }));
    await expect(quantity).toHaveFocus();
    await userEvent.click(email);
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(email).toHaveAttribute('data-smooth-caret-active'));
    await expect(email).toBeValid();
    await userEvent.click(quantity);
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(quantity).toHaveAttribute('data-smooth-caret-active'));
    await userEvent.keyboard('{ArrowUp}');
    await expect(quantity).toHaveValue('4');
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease quantity' }));
    await expect(quantity).toHaveValue('3');
    await userEvent.clear(quantity);
    await expect(quantity).toHaveAttribute('aria-invalid', 'true');
    await expect(quantity).toHaveAccessibleDescription('1 to 10, in steps of 1. Enter a quantity.');
    await userEvent.type(quantity, '3');
    await expect(quantity).not.toHaveAttribute('aria-invalid');
    const toggle = canvas.getByRole('switch', { name: 'Smooth caret' });
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByRole('button', { name: 'Focus title' }));
    await expect(title).not.toHaveAttribute('data-smooth-caret-active');
    await expect(canvas.getByRole('textbox', { name: 'Title' })).toBe(title);
    await expect(title).toHaveValue(`${before}!`);
    await userEvent.click(email);
    await expect(email).not.toHaveAttribute('data-smooth-caret-active');
    await expect(canvas.getByRole('textbox', { name: 'Email address' })).toBe(email);
    await expect(email).toHaveValue('amira@example.com');
    await userEvent.click(quantity);
    await expect(quantity).not.toHaveAttribute('data-smooth-caret-active');
    await userEvent.click(toggle);
    const notes = canvas.getByRole('textbox', { name: 'Notes' });
    await userEvent.type(notes, 'First line{Enter}Second line with enough words to wrap inside a narrow text area.');
    await waitFor(() => expect(notes).toHaveAttribute('data-smooth-caret-active'));
    await waitFor(() => {
      const rect = caret().getBoundingClientRect();
      const input = notes.getBoundingClientRect();
      expect(rect.left).toBeGreaterThanOrEqual(input.left);
      expect(rect.right).toBeLessThanOrEqual(input.right);
      expect(rect.bottom).toBeLessThanOrEqual(input.bottom);
    });
    await userEvent.click(native);
    await expect(canvasElement.ownerDocument.querySelector('[data-slot="input-caret"]')).toBeNull();
  },
};

export const EmailAddress = {
  parameters: {
    docs: {
      description: { story: 'EmailInput uses a text editor with an email keyboard hint, autocomplete and HTML email-address pattern validation. It inherits the Caret toolbar. This controlled form shows required and format errors, correction, submission and reset. It preserves typed text; leading or trailing spaces are invalid.' },
      source: { code: emailInputSource, language: 'jsx' },
    },
  },
  render: () => <EmailInputExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByRole('textbox', { name: 'Email address' });
    const check = canvas.getByRole('button', { name: 'Check email' });
    await expect(email).toHaveAttribute('type', 'text');
    await expect(email).toHaveAttribute('inputmode', 'email');
    await expect(email).toHaveAttribute('autocomplete', 'email');
    await userEvent.click(check);
    await expect(email).toHaveFocus();
    await expect(canvas.getByText('Enter your email address.')).toBeVisible();
    await expect(email.validity.valueMissing).toBe(true);
    await userEvent.type(email, 'not-an-email');
    await userEvent.click(check);
    await expect(email.validity.patternMismatch).toBe(true);
    await expect(canvas.getByText('Enter an address like name@example.com, without spaces.')).toBeVisible();
    await expect(canvas.getByRole('status')).not.toHaveTextContent('Email format is valid.');
    await userEvent.clear(email);
    await userEvent.type(email, 'amira+gaudi@example.co.uk');
    await expect(email).toBeValid();
    await expect(email).not.toHaveAttribute('aria-invalid');
    await expect(new FormData(email.form).get('email')).toBe('amira+gaudi@example.co.uk');
    email.setSelectionRange(5, 5);
    await expect(email.selectionStart).toBe(5);
    await userEvent.click(check);
    await expect(canvas.getByRole('status')).toHaveTextContent('Email format is valid. Nothing was sent.');
    await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
    await expect(email).toHaveValue('');
    await expect(email.validity.valueMissing).toBe(true);
    await expect(email).not.toHaveAttribute('aria-invalid');
  },
};
