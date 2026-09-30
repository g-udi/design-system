import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Checkbox from './Checkbox';

const docs = getComponentDocs('Core/Checkbox');
const checkbox = (canvas, name) => canvas.getByRole('checkbox', { name });

// A publishing checklist: one task follows the controls; the others show done, open, locked, and blocked tasks.
const checklist = [
  { label: 'Add a cover image', defaultChecked: true },
  { label: 'Editor review · approved', defaultChecked: true, disabled: true },
  { label: 'Write a summary' },
  { label: 'Schedule social posts · connect an account', disabled: true }
];
const taskSource = ({ label, defaultChecked, disabled }) => `<Checkbox label='${label}'${defaultChecked ? ' defaultChecked' : ''}${disabled ? ' disabled' : ''} />\n`;
const doneLabel = (done, total) => `${done} of ${total} done`;

function PublishingChecklist({ onCheckedChange, ...featured }) {
  const tasks = [...checklist.slice(0, 2), featured, ...checklist.slice(2)];
  const [done, setDone] = useState(() => Object.fromEntries(tasks.map((task) => [task.label, Boolean(task.defaultChecked)])));
  const change = (label) => (checked) => {
    setDone((current) => ({ ...current, [label]: checked }));
    if (label === featured.label) onCheckedChange?.(checked);
  };
  return (
    <fieldset className='mx-auto grid w-full max-w-xs gap-3'>
      <legend className='flex w-full items-baseline justify-between gap-4 pb-1 text-sm font-semibold text-ui-foreground'>
        Before you publish
        <span className='text-xs font-normal text-ui-muted-foreground'>{doneLabel(Object.values(done).filter(Boolean).length, tasks.length)}</span>
      </legend>
      {tasks.map((task) => <Checkbox key={task.label} {...task} onCheckedChange={change(task.label)} />)}
    </fieldset>
  );
}

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
  args: { label: 'Tag at least one topic', defaultChecked: false, disabled: false, onCheckedChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A publishing checklist with done, open, locked, and blocked tasks and a live count. The topic task follows the controls; clicking any open task updates the count.' },
      source: playgroundSource('Checkbox', {
        imports: "import { Checkbox } from '@gaudi/design-system';",
        before: `<fieldset className='grid gap-3'>\n<legend>Before you publish</legend>\n${checklist.slice(0, 2).map(taskSource).join('')}`,
        after: `\n${checklist.slice(2).map(taskSource).join('')}</fieldset>`
      })
    }
  },
  render: (args) => <PublishingChecklist key={`${args.label}-${args.defaultChecked}-${args.disabled}`} {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = checkbox(canvas, args.label);
    const total = checklist.length + 1;
    const initialDone = checklist.filter((task) => task.defaultChecked).length + Number(args.defaultChecked);
    const locked = checkbox(canvas, checklist[1].label);
    await expect(canvas.getByText(doneLabel(initialDone, total))).toBeVisible();
    await expect(control).toHaveAttribute('aria-checked', String(args.defaultChecked));
    await expect(control).toHaveProperty('disabled', args.disabled);
    for (const { label, defaultChecked = false, disabled = false } of checklist) {
      await expect(checkbox(canvas, label)).toHaveAttribute('aria-checked', String(defaultChecked));
      await expect(checkbox(canvas, label)).toHaveProperty('disabled', disabled);
      // A disabled task dims its label as well as its box.
      await expect(getComputedStyle(canvas.getByText(label)).opacity).toBe(disabled ? '0.5' : '1');
    }
    await userEvent.click(locked);
    await expect(locked).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(control);
    if (args.disabled) {
      await expect(control).toHaveAttribute('aria-checked', String(args.defaultChecked));
      await expect(args.onCheckedChange).not.toHaveBeenCalled();
      return;
    }
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(!args.defaultChecked);
    await expect(canvas.getByText(doneLabel(initialDone + (args.defaultChecked ? -1 : 1), total))).toBeVisible();
    await userEvent.click(canvas.getByText(args.label));
    await expect(control).toHaveAttribute('aria-checked', String(args.defaultChecked));
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(args.defaultChecked);
  }
};
