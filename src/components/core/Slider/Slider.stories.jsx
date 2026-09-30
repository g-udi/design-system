import { expect, userEvent, within } from 'storybook/test';
import { Slider } from './index';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { previewSource } from '../../../../.storybook/stories/previewSource';

export default { title: 'Core/Slider', component: Slider, tags: ['autodocs'] };
export const Playground = {
  args: { defaultValue: [50], min: 0, max: 100, step: 5, disabled: false, 'aria-label': 'Volume' },
  argTypes: { min: { control: 'number' }, max: { control: 'number' }, step: { control: {type: 'number', min: 1} }, disabled: { control: 'boolean' }, defaultValue: { control: 'object' } },
  render: (args) => <ExampleFrame><Slider key={JSON.stringify(args.defaultValue)} {...args} /></ExampleFrame>,
  parameters: { docs: { source: { type: 'dynamic', transform: (_, context) => previewSource('Slider', context.args, {imports: "import { Slider } from '@gaudi/design-system/core/Slider';"}) } } },
  play: async ({canvasElement}) => {
    const slider = within(canvasElement).getByRole('slider', {name: 'Volume'});
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', '55');
  }
};
