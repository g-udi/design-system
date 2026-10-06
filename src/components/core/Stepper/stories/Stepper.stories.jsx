import { createRoot } from 'react-dom/client';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../../icons/RegistryIcon.jsx';
import { cn } from '../../../../utilities/cn';
import Stepper from '../Stepper';
import { Stepper as StepperRoot, StepperIndicator, StepperItem, StepperNav, StepperTitle, StepperTrigger } from '../StepperPrimitives.jsx';

const docs = getComponentDocs('Core/Stepper');
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

async function checkUnavailableCurrentStep(canvasElement) {
  const host = canvasElement.ownerDocument.createElement('div');
  canvasElement.append(host);
  const root = createRoot(host);
  const onValueChange = fn();
  const render = (disabled, removed = false) => root.render(
    <StepperRoot value={2} onValueChange={onValueChange}>
      <StepperNav>{[1, 2, 3].filter((step) => !removed || step !== 2).map((step) => (
        <StepperItem key={step} step={step} disabled={disabled && step === 2}>
          <StepperTrigger><StepperIndicator>{step}</StepperIndicator></StepperTrigger>
        </StepperItem>
      ))}</StepperNav>
    </StepperRoot>
  );
  try {
    render(false);
    const first = await within(host).findByRole('button', { name: 'Step 1' });
    const current = within(host).getByRole('button', { name: 'Step 2' });
    await expect(current).toHaveAttribute('tabindex', '0');
    render(true);
    await waitFor(() => expect(first).toHaveAttribute('tabindex', '0'));
    await expect(current).toHaveAttribute('tabindex', '-1');
    await expect(current).toHaveAttribute('aria-current', 'step');
    render(false, true);
    await waitFor(() => expect(current).not.toBeInTheDocument());
    await expect(first).toHaveAttribute('tabindex', '0');
    first.focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    await expect(within(host).getByRole('button', { name: 'Step 3' })).toHaveFocus();
    await expect(onValueChange).toHaveBeenLastCalledWith(3);
    await expect(first).toHaveAttribute('tabindex', '0');
  } finally {
    root.unmount();
    host.remove();
  }
}

export default {
  title: 'Core/Navigation/Stepper', id: 'core-stepper',
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
    visualAudit: { wide: 'The status card matches the stepper width.' },
    docs: {
      description: { story: 'A four-step publishing flow. `activeStep` moves the current marker: finished steps show a check and what was done, and the status line names the next task. Set it to the number of steps (4) to mark the whole flow complete.' },
      source: playgroundSource('Stepper', {
        imports: `import { Stepper } from '@gaudi/design-system';\n\nconst steps = ${JSON.stringify(flowSteps(1), null, 2)};`,
        attributes: ['steps={steps}', "label='Publishing progress'"]
      })
    }
  },
  render: ({ activeStep }) => {
    const status = statusOf(activeStep);
    return (
      <div className='grid gap-3'>
        <Stepper steps={flowSteps(activeStep)} activeStep={activeStep} label='Publishing progress' />
        <div className='flex items-center gap-3 rounded-lg border border-border px-3 py-2' data-testid='step-status'>
          <span className={cn('grid size-8 shrink-0 place-items-center rounded-md', activeStep >= flow.length ? 'bg-success-subtle text-success' : 'bg-accent-subtle text-accent')}>
            <RegistryIcon lucide={status.icon} className='size-4' />
          </span>
          <div className='min-w-0'>
            <p className='text-sm font-medium'>{status.title}</p>
            <p className='text-xs text-text-muted'>{status.detail}</p>
          </div>
        </div>
      </div>
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Publishing progress' })).toBeInTheDocument();
    const current = items(canvas)[args.activeStep];
    if (current) await expect(current).toHaveAttribute('aria-current', 'step');
    // Completed markers swap their number for a check; the current marker keeps its number.
    const hasCheck = (item) => Boolean(item.querySelector('[data-slot="stepper-indicator"] svg'));
    if (current) await expect(hasCheck(current)).toBe(false);
    if (args.activeStep > 0) await expect(hasCheck(items(canvas)[0])).toBe(true);
    const completed = Math.min(args.activeStep, flow.length);
    await expect(canvas.queryAllByText('Completed')).toHaveLength(completed);
    if (completed) await expect(canvas.getByText(flow[completed - 1].done)).toBeVisible();
    await expect(canvas.getByTestId('step-status')).toHaveTextContent(statusOf(args.activeStep).title);
  }
};


export const KeyboardNavigation = {
  name: 'Keyboard navigation',
  args: { onValueChange: fn(), onTriggerClick: fn(), onTriggerKeyDown: fn() },
  parameters: {
    docs: {
      description: { story: 'Interactive step parts skip disabled steps and follow their orientation and text direction. Consumer event handlers compose with the built-in behavior; preventDefault can cancel a navigation key.' },
      source: { code: "import { StepperRoot, StepperIndicator, StepperItem, StepperNav, StepperTitle, StepperTrigger } from '@gaudi/design-system';\n\n<StepperRoot defaultValue={1} orientation='vertical'>\n  <StepperNav>\n    {['Details', 'Review', 'Publish'].map((label, index) => (\n      <StepperItem key={label} step={index + 1} disabled={index === 1}>\n        <StepperTrigger>\n          <StepperIndicator>{index + 1}</StepperIndicator>\n          <StepperTitle>{label}</StepperTitle>\n        </StepperTrigger>\n      </StepperItem>\n    ))}\n  </StepperNav>\n</StepperRoot>" }
    }
  },
  render: (args) => (
    <div className='grid gap-6'>
      {['horizontal', 'vertical'].map((orientation) => (
        <section key={orientation} className='grid gap-3'>
          <div>
            <h3 className='text-sm font-medium'>{orientation === 'horizontal' ? 'Right-to-left navigation' : 'Vertical navigation'}</h3>
            <p className='text-xs text-text-muted'>Arrow keys skip the unavailable review step. Press Enter to select.</p>
          </div>
          <StepperRoot defaultValue={1} orientation={orientation} dir={orientation === 'horizontal' ? 'rtl' : 'ltr'} aria-label={`${orientation} steps`} onValueChange={args.onValueChange}>
            <StepperNav className='gap-3'>
              {['Details', 'Review', 'Publish'].map((label, index) => (
                <StepperItem key={label} step={index + 1} disabled={index === 1}>
                  <StepperTrigger className={orientation === 'horizontal' ? 'flex-col gap-2' : 'gap-2'} aria-label={label} onClick={args.onTriggerClick} onKeyDown={(event) => {
                    args.onTriggerKeyDown(event);
                    if (event.key === 'Home') event.preventDefault();
                  }}>
                    <StepperIndicator>{index + 1}</StepperIndicator>
                    <StepperTitle>{label}</StepperTitle>
                  </StepperTrigger>
                </StepperItem>
              ))}
            </StepperNav>
          </StepperRoot>
        </section>
      ))}
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    for (const orientation of ['horizontal', 'vertical']) {
      const group = within(canvas.getByRole('group', { name: `${orientation} steps` }));
      const first = group.getByRole('button', { name: 'Details' });
      const last = group.getByRole('button', { name: 'Publish' });
      first.focus();
      await userEvent.keyboard(orientation === 'horizontal' ? '{ArrowDown}' : '{ArrowRight}');
      await expect(first).toHaveFocus();
      await userEvent.keyboard(orientation === 'horizontal' ? '{ArrowLeft}' : '{ArrowDown}');
      await expect(last).toHaveFocus();
      await userEvent.keyboard('{Control>}{ArrowUp}{/Control}{Home}');
      await expect(last).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(last).toHaveAttribute('aria-current', 'step');
      await userEvent.click(first);
      await expect(first).toHaveAttribute('aria-current', 'step');
    }
    await expect(args.onValueChange).toHaveBeenCalledWith(3);
    await expect(args.onTriggerClick).toHaveBeenCalled();
    await expect(args.onTriggerKeyDown).toHaveBeenCalled();
    await checkUnavailableCurrentStep(canvasElement);
  }
};
