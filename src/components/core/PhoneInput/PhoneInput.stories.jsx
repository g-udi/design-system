import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { PhoneInput } from './index.js';

const docs = getComponentDocs('Core/PhoneInput');
const number = { US: ['2125551234', '+12125551234'], GB: ['7400123456', '+447400123456'], FR: ['612345678', '+33612345678'] };

export default {
  title: 'Core/PhoneInput',
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
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    defaultCountry: 'US',
    variant: 'default',
    international: false,
    disabled: false,
    placeholder: 'Enter phone number',
    'aria-label': 'Phone number',
    onChange: fn()
  },
  parameters: {
    docs: { source: playgroundSource('PhoneInput', { imports: "import { PhoneInput } from '@gaudi/design-system';" }) }
  },
  render: (args) => <PhoneInput key={args.defaultCountry} {...args} />,
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: args['aria-label'] });
    if (args.disabled) return expect(input).toBeDisabled();
    const [digits, e164] = number[args.defaultCountry];
    await userEvent.type(input, digits);
    await expect(args.onChange).toHaveBeenLastCalledWith(e164);
  }
};
