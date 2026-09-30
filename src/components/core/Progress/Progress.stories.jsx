import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Progress from './Progress';

const docs = getComponentDocs('Core/Progress');
const bar = (canvasElement, name) => within(canvasElement).getByRole('progressbar', { name });

export default {
  title: 'Core/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', value: 'number', max: 'number', valueText: 'text', tone: ['accent', 'success', 'warning', 'danger'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Uploading references', value: 62, max: 100, valueText: '62%', tone: 'accent' },
  parameters: {
    docs: {
      source: playgroundSource('Progress', { imports: "import Progress from '@gaudi/design-system/core/Progress';" })
    }
  },
  render: (args) => <Progress {...args} />,
  play: async ({ args, canvasElement }) => {
    const progress = bar(canvasElement, args.label);
    await expect(progress).toHaveAttribute('max', String(args.max));
    await expect(progress).toHaveAttribute('value', String(Math.min(args.max, Math.max(0, args.value))));
    await expect(progress).toHaveAttribute('aria-valuetext', args.valueText);
  }
};

export const Indeterminate = {
  parameters: { docs: { description: { story: 'Omit `value` when the amount of work is unknown. The bar stays indeterminate instead of inventing a percentage.' } } },
  render: () => <Progress label='Preparing the export' valueText='Please wait' />,
  play: async ({ canvasElement }) => {
    await expect(bar(canvasElement, 'Preparing the export')).not.toHaveAttribute('value');
  }
};
