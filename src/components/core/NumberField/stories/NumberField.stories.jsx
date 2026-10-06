import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from '../index';

const docs = getComponentDocs('Core/NumberField');
const label = 'Reading goal';
const fieldParts = (name) => (
  <>
    <NumberFieldScrubArea label={name} />
    <NumberFieldGroup>
      <NumberFieldDecrement aria-label='Decrease' />
      <NumberFieldInput />
      <NumberFieldIncrement aria-label='Increase' />
    </NumberFieldGroup>
  </>
);
const parts = fieldParts(label);
const input = (canvasElement, name = label) => within(canvasElement).getByRole('textbox', { name });
const button = (canvasElement, name) => within(canvasElement).getByRole('button', { name });
// A reading plan: the articles field follows the controls; its neighbours format units and currency.
const featured = 'Articles per week';
const companions = [
  { name: 'Session length', defaultValue: 25, min: 5, max: 90, step: 5, format: { style: 'unit', unit: 'minute' } },
  { name: 'Monthly budget', defaultValue: 12, min: 0, max: 50, step: 1, format: { style: 'currency', currency: 'USD' } }
];

// Spells out `min`, `max`, and `step`, which otherwise only show when the value hits a bound.
const rangeHint = ({ min, max, step }) => `${min} to ${max}, steps of ${step}`;

export default {
  title: 'Core/Advanced Inputs/NumberField', id: 'core-numberfield',
  component: NumberField,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    defaultValue: 'number',
    min: 'number',
    max: 'number',
    step: 'number',
    size: ['sm', 'default', 'lg'],
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
  args: { defaultValue: 5, min: 0, max: 10, step: 1, size: 'default', disabled: false, onValueChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A reading plan with a plain count, a minutes field, and a currency field. The articles field follows `defaultValue`, `min`, `max`, `step`, and `disabled`, and each field spells out its range; `size` applies to all three.' },
      source: playgroundSource('NumberField', {
        imports: "import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput, NumberFieldScrubArea } from '@gaudi/design-system';",
        children: `  <NumberFieldScrubArea label='${featured}' />\n  <NumberFieldGroup>\n    <NumberFieldDecrement aria-label='Decrease' />\n    <NumberFieldInput />\n    <NumberFieldIncrement aria-label='Increase' />\n  </NumberFieldGroup>`
      })
    }
  },
  render: (args) => (
    <div className='grid gap-4 sm:grid-cols-3'>
      <NumberField key={`${args.defaultValue}-${args.min}-${args.max}`} {...args}>
        {fieldParts(featured)}
        <p className='text-xs text-text-muted'>{rangeHint(args)}</p>
      </NumberField>
      {companions.map(({ name, ...field }) => (
        <NumberField key={name} {...field} size={args.size} locale='en-US'>
          {fieldParts(name)}
          <p className='text-xs text-text-muted'>{rangeHint(field)}</p>
        </NumberField>
      ))}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const field = input(canvasElement, featured);
    const root = field.closest('[data-slot="number-field"]');
    await expect(root).toHaveAttribute('data-size', args.size);
    // Heights match the system control scale: sm 28px, default 32px, lg 36px.
    await expect(root.querySelector('[data-slot="number-field-group"]').getBoundingClientRect().height).toBe({ sm: 28, default: 32, lg: 36 }[args.size]);
    await expect(input(canvasElement, 'Session length')).toHaveValue('25 min');
    await expect(input(canvasElement, 'Monthly budget')).toHaveValue('$12.00');
    await expect(within(root).getByText(rangeHint(args))).toBeVisible();
    if (args.disabled) return expect(field).toBeDisabled();
    const increase = within(root).getByRole('button', { name: 'Increase' });
    const decrease = within(root).getByRole('button', { name: 'Decrease' });
    await userEvent.click(increase);
    await expect(args.onValueChange).toHaveBeenLastCalledWith(Math.min(args.defaultValue + args.step, args.max), expect.anything());
    await userEvent.click(decrease);
    await expect(field).toHaveValue(String(Math.min(args.defaultValue + args.step, args.max) - args.step));
  }
};

function ControlledExample({ onValueChange }) {
  const [value, setValue] = useState(20);
  const update = (next) => {
    setValue(next);
    onValueChange(next);
  };
  return (
    <div className='max-w-48'>
      <NumberField value={value} onValueChange={update} min={5} max={60} step={5} format={{ style: 'unit', unit: 'minute' }} locale='en-US'>
        {parts}
      </NumberField>
    </div>
  );
}
export const Controlled = {
  args: { onValueChange: fn() },
  parameters: { docs: { description: { story: 'The host owns `value`, `format` shows units, and arrow keys step within `min` and `max`.' } } },
  render: (args) => <ControlledExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const field = input(canvasElement);
    await expect(field).toHaveValue('20 min');
    await userEvent.click(field);
    await userEvent.keyboard('{ArrowUp}');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(25);
    await userEvent.keyboard('{End}');
    await expect(field).toHaveValue('60 min');
    await expect(button(canvasElement, 'Increase')).toHaveAttribute('aria-disabled', 'true');
  }
};
