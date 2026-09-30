import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './index.js';

const docs = getComponentDocs('Core/InputOtp');
const slots = (length) => Array.from({ length }, (_, index) => index);

export default {
  title: 'Core/InputOtp',
  id: 'core-inputotp',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { maxLength: 'number', pattern: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { maxLength: 6, pattern: '^\\d+$', 'aria-label': 'Verification code', onChange: fn(), onComplete: fn() },
  parameters: {
    docs: {
      source: playgroundSource('InputOTP', {
        imports: "import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gaudi/design-system';",
        children: '  <InputOTPGroup>\n    {Array.from({ length: maxLength }, (_, index) => <InputOTPSlot key={index} index={index} />)}\n  </InputOTPGroup>'
      })
    }
  },
  render: (args) => (
    <InputOTP key={args.maxLength} {...args}>
      <InputOTPGroup>
        {slots(args.maxLength).map((index) => <InputOTPSlot key={index} index={index} />)}
      </InputOTPGroup>
    </InputOTP>
  ),
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', { name: args['aria-label'] });
    const code = '1234567890'.slice(0, args.maxLength);
    await userEvent.click(input);
    await userEvent.keyboard(`a${code}`);
    await expect(input).toHaveValue(code);
    await expect(args.onComplete).toHaveBeenCalledWith(code);
  }
};
