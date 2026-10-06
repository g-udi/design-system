import { PlaygroundDemo, number, mobile, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import { PhoneInput } from '../index.js';

const docs = getComponentDocs('Core/PhoneInput');
// National digits a person types, and the E.164 value each country normalizes them to.

// A contact form: mobile follows every control; work stays settled and the emergency number is incomplete.

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Advanced Inputs/PhoneInput',
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
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame className='max-w-sm'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A contact form with a saved UK work line and an incomplete, invalid emergency number. The mobile field follows every control: `defaultCountry` swaps its flag and number, `international` reformats every saved number with its calling code, `variant` resizes all three, and `disabled` locks the mobile field.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  render: PlaygroundDemo,
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
