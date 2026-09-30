import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Checkbox from './Checkbox';

const docs = getComponentDocs('Core/Checkbox');
const states = [
  { label: 'Unchecked option' },
  { label: 'Checked option', defaultChecked: true },
  { label: 'Disabled option', disabled: true },
  { label: 'Disabled checked option', defaultChecked: true, disabled: true }
];
const checkbox = (canvas, name) => canvas.getByRole('checkbox', { name });

export default {
  title: 'Core/Checkbox',
  id: 'core-checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', defaultChecked: 'boolean', disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { label: 'Accept terms', defaultChecked: true, disabled: false, onCheckedChange: fn() },
  parameters: { docs: { source: playgroundSource('Checkbox', { imports: "import { Checkbox } from '@gaudi/design-system';" }) } },
  render: (args) => <Checkbox key={String(args.defaultChecked)} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = checkbox(canvas, args.label);
    const initial = String(args.defaultChecked);
    await expect(control).toHaveAttribute('aria-checked', initial);
    await userEvent.click(control);
    if (args.disabled) {
      await expect(control).toHaveAttribute('aria-checked', initial);
      return;
    }
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(!args.defaultChecked);
    await userEvent.click(canvas.getByText(args.label));
    await expect(control).toHaveAttribute('aria-checked', initial);
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(args.defaultChecked);
  }
};

export const States = {
  parameters: { docs: { description: { story: 'Unchecked, checked, and disabled states; disabled checkboxes keep their value when clicked.' } } },
  render: () => <div className='grid gap-4'>{states.map((state) => <Checkbox key={state.label} {...state} />)}</div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const { label, defaultChecked = false, disabled = false } of states) {
      const control = checkbox(canvas, label);
      await expect(control).toHaveAttribute('aria-checked', String(defaultChecked));
      await expect(control).toHaveProperty('disabled', disabled);
    }
    const locked = checkbox(canvas, states[3].label);
    await userEvent.click(locked);
    await expect(locked).toHaveAttribute('aria-checked', 'true');
  }
};
