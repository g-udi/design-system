import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Progress from './Progress';

const docs = getComponentDocs('Core/Progress');
const bar = (canvasElement, name) => within(canvasElement).getByRole('progressbar', { name });
const tones = ['accent', 'success', 'warning', 'danger'];
// A workspace sync panel: the upload follows the controls; its neighbours show the other tones.
const tasks = [
  { label: 'Images optimised', value: 100, valueText: 'Complete', tone: 'success' },
  { label: 'Storage used', value: 86, valueText: '8.6 of 10 GB', tone: 'warning' },
  { label: 'Backup to cloud', value: 40, valueText: 'Failed at 40%', tone: 'danger' }
];

export default {
  title: 'Core/Progress', id: 'core-progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', value: 'number', max: 'number', valueText: 'text', tone: tones }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { label: 'Uploading references', value: 31, max: 50, valueText: '31 of 50 files', tone: 'accent' },
  parameters: {
    docs: {
      description: { story: 'A workspace sync panel. The upload follows `label`, `value`, `max`, `valueText`, and `tone`; the other tasks show the success, warning, and danger tones.' },
      source: playgroundSource('Progress', { imports: "import Progress from '@gaudi/design-system/core/Progress';" })
    }
  },
  render: (args) => (
    <div className='grid gap-4'>
      <Progress {...args} />
      {tasks.map((task) => <Progress key={task.label} {...task} />)}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const progress = bar(canvasElement, args.label);
    const root = progress.closest('[data-tone]');
    const limit = args.max > 0 ? args.max : 100;
    await expect(progress).toHaveAttribute('aria-valuemax', String(limit));
    await expect(progress).toHaveAttribute('aria-valuenow', String(Math.min(limit, Math.max(0, args.value))));
    await expect(progress).toHaveAttribute('aria-valuetext', args.valueText);
    await expect(within(root).getByText(args.valueText)).toBeVisible();
    await expect(root).toHaveAttribute('data-tone', args.tone);
    for (const task of tasks) await expect(bar(canvasElement, task.label).closest('[data-tone]')).toHaveAttribute('data-tone', task.tone);
  }
};

export const Indeterminate = {
  parameters: { docs: { description: { story: 'Omit `value` when the amount of work is unknown. The bar stays indeterminate instead of inventing a percentage.' } } },
  render: () => <Progress label='Preparing the export' valueText='Please wait' />,
  play: async ({ canvasElement }) => {
    const progress = bar(canvasElement, 'Preparing the export');
    await expect(progress).not.toHaveAttribute('aria-valuenow');
    await expect(progress).toHaveAttribute('data-state', 'indeterminate');
  }
};
