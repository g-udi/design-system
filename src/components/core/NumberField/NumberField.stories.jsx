import { expect, userEvent, within } from 'storybook/test';
import { NumberField, NumberFieldGroup, NumberFieldInput, NumberFieldIncrement, NumberFieldDecrement, NumberFieldScrubArea } from './index';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { previewSource } from '../../../../.storybook/stories/previewSource';

export default { title: 'Core/NumberField', component: NumberField, tags: ['autodocs'] };

export const Playground = {
  args: { defaultValue: 5, min: 0, max: 100, step: 1, size: 'default', disabled: false },
  argTypes: {
    defaultValue: { control: 'number' }, min: { control: 'number' }, max: { control: 'number' }, step: { control: { type: 'number', min: 1 } },
    size: { control: 'select', options: ['sm', 'default', 'lg'] }, disabled: { control: 'boolean' }
  },
  render: (args) => <ExampleFrame><NumberField key={args.defaultValue} {...args}>
    <NumberFieldScrubArea label='Reading goal' />
    <NumberFieldGroup><NumberFieldDecrement aria-label='Decrease reading goal' /><NumberFieldInput /><NumberFieldIncrement aria-label='Increase reading goal' /></NumberFieldGroup>
  </NumberField></ExampleFrame>,
  parameters: { docs: { source: { type: 'dynamic', transform: (_, context) => previewSource('NumberField', context.args, {
    imports: "import { NumberField, NumberFieldScrubArea, NumberFieldGroup, NumberFieldInput, NumberFieldDecrement, NumberFieldIncrement } from '@gaudi/design-system/core/NumberField';",
    children: '  <NumberFieldScrubArea label="Reading goal" />\n  <NumberFieldGroup>\n    <NumberFieldDecrement aria-label="Decrease reading goal" />\n    <NumberFieldInput />\n    <NumberFieldIncrement aria-label="Increase reading goal" />\n  </NumberFieldGroup>'
  }) } } },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', {name: 'Increase reading goal'}));
    await expect(canvas.getByRole('textbox', {name: 'Reading goal'})).toHaveValue('6');
  }
};
