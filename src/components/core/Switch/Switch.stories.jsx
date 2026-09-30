import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import { RegistryIcon } from '../../../icons/RegistryIcon.jsx';
import Switch from './Switch';

const docs = getComponentDocs('Core/Switch');
const label = 'Email notifications';
const sizes = ['sm', 'md', 'lg'];
const control = (canvas, name = label) => canvas.getByRole('switch', { name });
// Notification settings: the first row follows the controls; the others show fixed on, off and locked rows.
const settings = [
  { id: 'email', title: label, icon: 'Mail', description: 'Replies, mentions and review requests.' },
  { id: 'push', title: 'Push notifications', icon: 'Smartphone', description: 'Alerts on your phone while you are away.', defaultChecked: false },
  { id: 'digest', title: 'Weekly digest', icon: 'CalendarDays', description: 'A Monday summary of what changed.', defaultChecked: true },
  { id: 'sms', title: 'SMS alerts', icon: 'MessageSquare', description: 'Add a verified phone number to enable.', disabled: true }
];
const [featured] = settings;
const lockedNote = 'Locked by your workspace admin.';

function SettingRow({ setting, size, defaultChecked, disabled, onCheckedChange }) {
  const id = `switch-${setting.id}`;
  return (
    <li className='flex items-center gap-3 px-3 py-2.5'>
      <span className='grid size-8 shrink-0 place-items-center rounded-md bg-surface-muted text-text-muted' aria-hidden='true'>
        <RegistryIcon lucide={setting.icon} className='size-4' />
      </span>
      <div className='min-w-0 flex-1'>
        <label htmlFor={id} className='block text-sm font-medium'>{setting.title}</label>
        <p className='flex items-center gap-1 text-xs text-text-muted'>
          {disabled && setting === featured ? <><RegistryIcon lucide='Lock' className='size-3.5 shrink-0' />{lockedNote}</> : setting.description}
        </p>
      </div>
      <Switch id={id} size={size} defaultChecked={defaultChecked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </li>
  );
}

export default {
  title: 'Core/Switch',
  id: 'core-switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { size: sizes, defaultChecked: 'boolean', disabled: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { size: 'md', defaultChecked: true, disabled: false, onCheckedChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A notification settings list. The email row follows the controls; push, digest and SMS stay off, on and locked. `size` scales every switch, and `disabled` locks the email row and says why.' },
      source: playgroundSource('Switch', {
        imports: "import { Switch } from '@gaudi/design-system';",
        attributes: ["id='email-notifications'"],
        before: "<div className='flex items-center gap-3'>\n  <div className='flex-1'>\n    <label htmlFor='email-notifications'>Email notifications</label>\n    <p>Replies, mentions and review requests.</p>\n  </div>\n",
        after: '\n</div>'
      })
    }
  },
  render: (args) => (
    <ul className='mx-auto grid max-w-md divide-y divide-border rounded-lg border border-border'>
      <SettingRow key={`${args.defaultChecked}`} setting={featured} {...args} />
      {settings.slice(1).map((setting) => (
        <SettingRow key={setting.id} setting={setting} size={args.size} defaultChecked={setting.defaultChecked} disabled={setting.disabled} />
      ))}
    </ul>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const initial = Boolean(args.defaultChecked);
    await expect(control(canvas)).toHaveAttribute('aria-checked', `${initial}`);
    await expect(control(canvas, 'SMS alerts')).toBeDisabled();
    if (args.disabled) {
      await expect(control(canvas)).toBeDisabled();
      await expect(canvas.getByText(lockedNote)).toBeVisible();
      return;
    }
    await userEvent.click(control(canvas));
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(!initial);
    await userEvent.click(canvas.getByText(label));
    await expect(control(canvas)).toHaveAttribute('aria-checked', `${initial}`);
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
