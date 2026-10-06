import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import Button from '../../Button';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '../index.js';

const docs = getComponentDocs('Core/InputOtp');
const label = 'Verification code';
// Each pattern names what it accepts and the partial code the card starts with.
const patterns = {
  '^\\d+$': { label: 'Digits', hint: 'Digits only', typed: '382', code: '1234567890' },
  '^[a-zA-Z0-9]+$': { label: 'Letters and digits', hint: 'Letters and digits', typed: 'K7Q', code: 'A1B2C3D4E5' }
};
// Two groups split by a separator: 2 + 2, 3 + 3, or 4 + 4.
const halves = (length) => {
  const half = Math.ceil(length / 2);
  return [Array.from({ length: half }, (_, index) => index), Array.from({ length: length - half }, (_, index) => half + index)];
};

function VerificationCard({ onChange, onComplete, ...props }) {
  const { hint, typed } = patterns[props.pattern];
  const [value, setValue] = useState(typed.slice(0, props.maxLength));
  const [verified, setVerified] = useState(false);
  const complete = value.length === props.maxLength;
  // Eight slots stay compact so the card still fits a 375px screen.
  const slotSize = props.maxLength > 6 ? 'size-8' : 'size-9 text-base sm:size-10';
  return (
    <div className='mx-auto flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-ui-border p-5 text-center'>
      <div className='flex flex-col gap-1'>
        <h3 className='text-base font-semibold text-ui-foreground'>Check your email</h3>
        <p className='text-sm text-ui-muted-foreground'>Enter the {props.maxLength}-character code sent to maya@gaudi.dev</p>
      </div>
      <InputOTP
        {...props}
        aria-label={label}
        value={value}
        onChange={(next) => {
          setValue(next);
          setVerified(false);
          onChange(next);
        }}
        onComplete={onComplete}
      >
        {halves(props.maxLength).map((slots, group) => [
          group ? <InputOTPSeparator key='separator' /> : null,
          <InputOTPGroup key={group}>
            {slots.map((index) => <InputOTPSlot key={index} index={index} className={slotSize} />)}
          </InputOTPGroup>
        ])}
      </InputOTP>
      <p className='text-xs text-ui-muted-foreground'>{hint} · {value.length} of {props.maxLength} entered</p>
      <Button className='w-full' disabled={!complete || props.disabled} onClick={() => setVerified(true)}>Verify</Button>
      {verified ? <p role='status' className='text-xs text-text-muted'>Code accepted in this demo. No verification request was sent.</p> : null}
      <p className='text-xs text-ui-muted-foreground'>Enter any code matching the selected format to try this demo.</p>
    </div>
  );
}

export default {
  title: 'Core/Advanced Inputs/InputOtp',
  id: 'core-inputotp',
  component: InputOTP,
  tags: ['autodocs'],
  argTypes: (() => {
    const argTypes = docsArgTypes(docs, { maxLength: [4, 6, 8], pattern: Object.keys(patterns), disabled: 'boolean' });
    argTypes.pattern.control = { type: 'select', labels: Object.fromEntries(Object.entries(patterns).map(([pattern, { label }]) => [pattern, label])) };
    return argTypes;
  })(),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { maxLength: 6, pattern: '^\\d+$', disabled: false, onChange: fn(), onComplete: fn() },
  parameters: {
    docs: {
      description: { story: 'An email verification card with a code already half entered. `maxLength` resizes both slot groups, `pattern` switches between digit and alphanumeric codes, and `disabled` dims the slots and the Verify button.' },
      source: {
        type: 'dynamic',
        language: 'jsx',
        transform: (_source, { args }) => previewSource('InputOTP', args, {
          imports: "import { useState } from 'react';\nimport { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@gaudi/design-system';",
          before: "export default function VerificationCode() {\n  const [code, setCode] = useState('');\n  return (\n",
          attributes: [`aria-label='${label}'`, 'value={code}', 'onChange={setCode}'],
          children: halves(args.maxLength).map((slots, group) => `${group ? '  <InputOTPSeparator />\n' : ''}  <InputOTPGroup>\n${slots.map((index) => `    <InputOTPSlot index={${index}}${args.maxLength > 6 ? " className='size-8'" : ''} />`).join('\n')}\n  </InputOTPGroup>`).join('\n'),
          after: '\n  );\n}'
        })
      }
    }
  },
  render: (args) => <VerificationCard key={`${args.maxLength}-${args.pattern}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: label });
    const { typed, code: source } = patterns[args.pattern];
    await expect(input).toHaveValue(typed.slice(0, args.maxLength));
    await expect(canvasElement.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(args.maxLength);
    if (args.disabled) return expect(input).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Verify' })).toBeDisabled();
    const code = source.slice(0, args.maxLength);
    await userEvent.clear(input);
    // A character outside the pattern is rejected before the code lands.
    await userEvent.keyboard(`${args.pattern === '^\\d+$' ? 'a' : '-'}${code}`);
    await expect(input).toHaveValue(code);
    await expect(args.onComplete).toHaveBeenCalledWith(code);
    await expect(canvas.getByRole('button', { name: 'Verify' })).toBeEnabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Verify' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Code accepted in this demo.');
  }
};
