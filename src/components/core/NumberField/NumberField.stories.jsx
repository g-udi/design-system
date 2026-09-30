import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea
} from './index';

const docs = getComponentDocs('Core/NumberField');
const label = 'Reading goal';
const parts = (
  <>
    <NumberFieldScrubArea label={label} />
    <NumberFieldGroup>
      <NumberFieldDecrement aria-label='Decrease' />
      <NumberFieldInput />
      <NumberFieldIncrement aria-label='Increase' />
    </NumberFieldGroup>
  </>
);
const input = (canvasElement) => within(canvasElement).getByRole('textbox', { name: label });
const button = (canvasElement, name) => within(canvasElement).getByRole('button', { name });

export default {
  title: 'Core/NumberField',
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
  decorators: [(Story) => <ExampleFrame><div className='max-w-48'><Story /></div></ExampleFrame>]
};

export const Playground = {
  args: { defaultValue: 5, min: 0, max: 100, step: 1, size: 'default', disabled: false, onValueChange: fn() },
  parameters: {
    docs: {
      source: playgroundSource('NumberField', {
        imports: "import { NumberField, NumberFieldDecrement, NumberFieldGroup, NumberFieldIncrement, NumberFieldInput, NumberFieldScrubArea } from '@gaudi/design-system';",
        children: `  <NumberFieldScrubArea label='${label}' />\n  <NumberFieldGroup>\n    <NumberFieldDecrement aria-label='Decrease' />\n    <NumberFieldInput />\n    <NumberFieldIncrement aria-label='Increase' />\n  </NumberFieldGroup>`
      })
    }
  },
  render: (args) => <NumberField key={args.defaultValue} {...args}>{parts}</NumberField>,
  play: async ({ args, canvasElement }) => {
    if (args.disabled) return expect(input(canvasElement)).toBeDisabled();
    await userEvent.click(button(canvasElement, 'Increase'));
    await expect(args.onValueChange).toHaveBeenLastCalledWith(Math.min(args.defaultValue + args.step, args.max), expect.anything());
    await userEvent.click(button(canvasElement, 'Decrease'));
    await expect(input(canvasElement)).toHaveValue(String(args.defaultValue));
  }
};

function ControlledExample({ onValueChange }) {
  const [value, setValue] = useState(20);
  const update = (next) => {
    setValue(next);
    onValueChange(next);
  };
  return (
    <NumberField value={value} onValueChange={update} min={5} max={60} step={5} format={{ style: 'unit', unit: 'minute' }} locale='en-US'>
      {parts}
    </NumberField>
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
