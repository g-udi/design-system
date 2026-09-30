import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { Slider } from './index';

const docs = getComponentDocs('Core/Slider');

export default {
  title: 'Core/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    min: 'number',
    max: 'number',
    step: 'number',
    orientation: ['horizontal', 'vertical'],
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
    'aria-label': 'Volume',
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 5,
    orientation: 'horizontal',
    disabled: false,
    onValueChange: fn(),
    onValueCommit: fn()
  },
  parameters: {
    docs: {
      source: playgroundSource('Slider', { imports: "import { Slider } from '@gaudi/design-system/core/Slider';" })
    }
  },
  render: (args) => (
    <div className={args.orientation === 'vertical' ? 'flex h-40 justify-center' : undefined}>
      <Slider {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', { name: args['aria-label'] });
    await expect(slider).toHaveAttribute('aria-valuenow', '50');
    if (args.disabled) return;
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveAttribute('aria-valuenow', String(50 + args.step));
    await expect(args.onValueCommit).toHaveBeenLastCalledWith([50 + args.step]);
    await userEvent.keyboard('{Home}');
    await expect(slider).toHaveAttribute('aria-valuenow', String(args.min));
  }
};
