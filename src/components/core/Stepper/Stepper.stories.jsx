import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import { cn } from '../../../utilities/cn';
import Stepper from './Stepper';

const docs = getComponentDocs('Core/Stepper');
const steps = [
  { id: 'details', label: 'Details', description: 'Name and summary' },
  { id: 'audience', label: 'Audience', description: 'Who can read this?' },
  { id: 'review', label: 'Review', description: 'Confirm and publish' }
];
const items = (canvas) => canvas.getAllByRole('listitem');
// A publishing flow: finished steps report what was done, the current step says what is needed next.
const flow = [
  { id: 'details', label: 'Details', description: 'Title and cover', done: 'Cover added', icon: 'FileTextIcon' },
  { id: 'audience', label: 'Audience', description: 'Readers and tags', done: '1,284 readers', icon: 'UsersIcon' },
  { id: 'review', label: 'Review', description: 'Two editors', done: 'Sam approved', icon: 'MessageSquareIcon' },
  { id: 'publish', label: 'Publish', description: 'Schedule or post', done: 'Live now', icon: 'SendIcon' }
];
const flowSteps = (activeStep) => flow.map(({ id, label, description, done }, index) => ({ id, label, description: index < activeStep ? done : description }));
const statusOf = (activeStep) => activeStep >= flow.length
  ? { icon: 'CircleCheckIcon', title: 'Published', detail: 'Every step is complete and the post is live.' }
  : { icon: flow[activeStep].icon, title: `Step ${activeStep + 1} of ${flow.length}: ${flow[activeStep].label}`, detail: flow[activeStep].description };

export default {
  title: 'Core/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { activeStep: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { activeStep: 1 },
  argTypes: { activeStep: { control: { type: 'range', min: 0, max: flow.length, step: 1 } } },
  parameters: {
    docs: {
      description: { story: 'A four-step publishing flow. `activeStep` moves the current marker: finished steps show a check and what was done, and the status line names the next task until every step is complete.' },
      source: playgroundSource('Stepper', {
        imports: `import { Stepper } from '@gaudi/design-system';\n\nconst steps = ${JSON.stringify(flowSteps(1), null, 2)};`,
        attributes: ['steps={steps}', "label='Publishing progress'"]
      })
    }
  },
  render: ({ activeStep }) => {
    const status = statusOf(activeStep);
    return (
      <div className='grid gap-4'>
        <Stepper steps={flowSteps(activeStep)} activeStep={activeStep} label='Publishing progress' />
        <div className='flex items-center gap-3 rounded-lg border border-border px-4 py-3' data-testid='step-status'>
          <span className={cn('grid size-9 shrink-0 place-items-center rounded-md', activeStep >= flow.length ? 'bg-success-subtle text-success' : 'bg-accent-subtle text-accent')}>
            <RegistryIcon lucide={status.icon} className='size-4' />
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-medium'>{status.title}</p>
            <p className='text-sm text-text-muted'>{status.detail}</p>
          </div>
        </div>
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Publishing progress' })).toBeInTheDocument();
    const current = items(canvas)[args.activeStep];
    if (current) await expect(current).toHaveAttribute('aria-current', 'step');
    const completed = Math.min(args.activeStep, flow.length);
    await expect(canvas.queryAllByText('Completed')).toHaveLength(completed);
    if (completed) await expect(canvas.getByText(flow[completed - 1].done)).toBeVisible();
    await expect(canvas.getByTestId('step-status')).toHaveTextContent(statusOf(args.activeStep).title);
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
