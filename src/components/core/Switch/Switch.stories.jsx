import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Switch from './Switch';

const docs = getComponentDocs('Core/Switch');
const label = 'Email notifications';
const sizes = ['sm', 'md', 'lg'];
const control = (canvas, name = label) => canvas.getByRole('switch', { name });

export default {
  title: 'Core/Switch',
  id: 'core-switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { label: 'text', size: sizes, defaultChecked: 'boolean', disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  }
};

export const Playground = {
  args: { label, size: 'md', defaultChecked: true, disabled: false, onCheckedChange: fn() },
  parameters: {
    docs: { source: playgroundSource('Switch', { imports: "import { Switch } from '@gaudi/design-system';" }) }
  },
  render: (args) => <Switch key={`${args.defaultChecked}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    if (args.disabled) return;
    const canvas = within(canvasElement);
    const initial = Boolean(args.defaultChecked);
    await expect(control(canvas, args.label)).toHaveAttribute('aria-checked', `${initial}`);
    await userEvent.click(control(canvas, args.label));
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(!initial);
    await userEvent.click(canvas.getByText(args.label));
    await expect(control(canvas, args.label)).toHaveAttribute('aria-checked', `${initial}`);
  }
};

function ControlledExample({ onCheckedChange }) {
  const [checked, setChecked] = useState(false);
  const update = (next) => {
    setChecked(next);
    onCheckedChange(next);
  };
  return (
    <div className='grid gap-2'>
      <Switch label={label} checked={checked} onCheckedChange={update} />
      <p className='text-sm text-text-muted'>{checked ? 'You will receive email updates.' : 'Email updates are off.'}</p>
    </div>
  );
}
export const Controlled = {
  args: { onCheckedChange: fn() },
  parameters: { docs: { description: { story: 'The host owns `checked` and updates it from `onCheckedChange`.' } } },
  render: (args) => <ControlledExample {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(control(canvas));
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
    await expect(control(canvas)).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByText('You will receive email updates.')).toBeVisible();
    control(canvas).focus();
    await userEvent.keyboard(' ');
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(false);
  }
};

export const Sizes = {
  parameters: { docs: { description: { story: '`size` scales the track and thumb; the label keeps the same type size.' } } },
  render: () => (
    <div className='grid gap-4'>
      {sizes.map((size) => <Switch key={size} label={`Size ${size}`} size={size} defaultChecked />)}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const widths = sizes.map((size) => control(canvas, `Size ${size}`).getBoundingClientRect().width);
    await expect(widths[0]).toBeLessThan(widths[1]);
    await expect(widths[1]).toBeLessThan(widths[2]);
  }
};
