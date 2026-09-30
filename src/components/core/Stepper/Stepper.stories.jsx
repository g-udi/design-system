import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Stepper from './Stepper';

const docs = getComponentDocs('Core/Stepper');
const steps = [
  { id: 'details', label: 'Details', description: 'Name and summary' },
  { id: 'audience', label: 'Audience', description: 'Who can read this?' },
  { id: 'review', label: 'Review', description: 'Confirm and publish' }
];
const items = (canvas) => canvas.getAllByRole('listitem');

export default {
  title: 'Core/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { activeStep: 'number', label: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { activeStep: 1, label: 'Publishing progress' },
  parameters: {
    docs: {
      source: playgroundSource('Stepper', {
        imports: `import { Stepper } from '@gaudi/design-system';\n\nconst steps = ${JSON.stringify(steps, null, 2)};`
      })
    }
  },
  render: (args) => <Stepper steps={steps} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: args.label })).toBeInTheDocument();
    const current = items(canvas)[args.activeStep];
    if (current) await expect(current).toHaveAttribute('aria-current', 'step');
    await expect(canvas.queryAllByText('Completed')).toHaveLength(Math.min(args.activeStep, steps.length));
  }
};

export const Completed = {
  parameters: { docs: { description: { story: 'Set `activeStep` to `steps.length` to mark every step complete; no item is current.' } } },
  render: () => <Stepper steps={steps} activeStep={steps.length} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const item of items(canvas)) await expect(item).not.toHaveAttribute('aria-current');
    await expect(canvas.getAllByText('Completed')).toHaveLength(steps.length);
  }
};

export const LongLabels = {
  parameters: { docs: { description: { story: 'Long labels wrap inside their step instead of overflowing the sequence.' } } },
  render: () => (
    <Stepper
      steps={[
        { id: 'preferences', label: 'Configure your publication preferences' },
        { id: 'reviewers', label: 'Invite reviewers to your workspace' },
        { id: 'confirm', label: 'Confirm the details and finish setup' }
      ]}
    />
  )
};
