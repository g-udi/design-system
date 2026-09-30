import { previewSource } from '../../../../.storybook/stories/previewSource';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Progress from './Progress';

export default {
  tags: ['autodocs'],
  title: 'Core/Progress',
  component: Progress,
  ...applicationDocs(
    'Native determinate and indeterminate progress. Values are clamped to a finite positive max. Supply valueText for meaningful units and a label for the task.',
    "import Progress from '@gaudi/design-system/core/Progress';\n\n<Progress label='Uploading references' value={62} valueText='62%' />",
    'The native progress element exposes its value; omitted or non-finite values stay indeterminate rather than inventing a percentage.'
  )
};

export const Upload = {
  parameters: {
    docs: {
      source: {
        code: "<Progress label='Uploading references' value={62} valueText='62%' />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Progress label='Uploading references' value={62} valueText='62%' />
    </ExampleFrame>
  )
};

export const Indeterminate = {
  parameters: {
    docs: {
      source: {
        code: "<Progress label='Preparing the export' valueText='Please wait' />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Progress label='Preparing the export' valueText='Please wait' />
    </ExampleFrame>
  )
};

export const Completed = {
  parameters: {
    docs: {
      source: {
        code: "<Progress label='Files processed' value={8} max={8} valueText='8 of 8' tone='success' />"
      }
    }
  },
  render: () => (
    <ExampleFrame>
      <Progress
        label='Files processed'
        value={8}
        max={8}
        valueText='8 of 8'
        tone='success'
      />
    </ExampleFrame>
  )
};

export const Playground = {
  args: { label: 'Uploading references', value: 62, max: 100, tone: 'accent' },
  argTypes: { label: { control: 'text' }, value: { control: { type: 'range', min: 0, max: 100 } }, max: { control: { type: 'number', min: 1 } }, tone: { control: 'select', options: ['accent', 'success', 'danger'] } },
  render: (args) => (<ExampleFrame><Progress {...args} /></ExampleFrame>),
  parameters: { docs: { description: { story: 'Adjust the controls to explore the component. The examples below cover complete usage patterns.' }, source: { type: 'dynamic', transform: (_, context) => previewSource('Progress', context.args, { imports: "import Progress from '@gaudi/design-system/core/Progress';" }) } } }
};
