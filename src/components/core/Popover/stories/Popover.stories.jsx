import { PlaygroundDemo, ComposedDemo, people, exampleDefaults } from './fixtures/NativeExamples.jsx';
import exampleCode from './fixtures/NativeExamples.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';

import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import PopoverRoot from '../Popover';

const docs = getComponentDocs('Core/Popover');
const page = (canvasElement) => within(canvasElement.ownerDocument.body);

const exampleSource = publicSource(exampleCode, new URL('./fixtures/NativeExamples.jsx', import.meta.url));

export default {
  title: 'Core/Overlays & Menus/Popover',
  id: 'core-popover',
  component: PopoverRoot,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { trigger: 'text', side: ['top', 'right', 'bottom', 'left'], align: ['start', 'center', 'end'] }),
  parameters: {
    docs: {
      source: { code: exampleSource, language: 'jsx' },
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...exampleDefaults, onOpenChange: fn() },
  parameters: {
    docs: {
      description: { story: 'A share panel with a copyable link and the people who have access, open on load. `side` and `align` place it around the button; Escape or a click outside closes it and returns focus to the button.' },
      source: { code: exampleSource, language: 'jsx' }
    }
  },
  // The stage leaves room on every side; `key` reopens the panel when a placement control changes.
  render: PlaygroundDemo,
  play: async ({ args, canvasElement }) => {
    const body = page(canvasElement);
    const trigger = within(canvasElement).getByRole('button', { name: args.trigger });
    const panel = () => body.queryByRole('dialog');
    await waitFor(() => expect(panel()).toBeVisible());
    await expect(panel()).toHaveAttribute('data-side', args.side);
    await expect(panel()).toHaveAttribute('data-align', args.align);
    await expect(within(panel()).getByText(people[1].name)).toBeVisible();
    await userEvent.click(within(panel()).getByRole('button', { name: 'Copy' }));
    await expect(within(panel()).getByRole('button', { name: 'Copied' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(false);
    await userEvent.click(trigger);
    await waitFor(() => expect(panel()).toBeVisible());
    await userEvent.click(canvasElement);
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    // Leave the preview as it loads: open.
    await userEvent.click(trigger);
    await waitFor(() => expect(panel()).toBeVisible());
  }
};

export const Composed = {
  name: 'Controlled composition',
  parameters: { docs: { description: { story: 'Compose `Popover`, `PopoverTrigger` and `PopoverContent` with `open` and `onOpenChange` when the host decides when the panel closes, here right after a choice.' } } },
  render: ComposedDemo,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Snooze' });
    await userEvent.click(trigger);
    const panel = await page(canvasElement).findByRole('dialog');
    await userEvent.click(within(panel).getByRole('button', { name: 'Tomorrow' }));
    await waitFor(() => expect(panel).not.toBeInTheDocument());
    await expect(canvas.getByRole('status')).toHaveTextContent('Snoozed until tomorrow.');
    await expect(trigger).toHaveFocus();
  }
};
