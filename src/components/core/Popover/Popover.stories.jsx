import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import PopoverRoot, { Popover, PopoverContent, PopoverTrigger } from './Popover';

const docs = getComponentDocs('Core/Popover');
const content = 'Compact supporting content in a positioned panel.';
const composedContent = 'Use the primitive slots when the trigger lives inside another layout.';

export default {
  title: 'Core/Popover',
  id: 'core-popover',
  component: PopoverRoot,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { trigger: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  // The panel is absolutely positioned, so reserve room for it below the trigger.
  decorators: [(Story) => <ExampleFrame className='min-h-56'><Story /></ExampleFrame>]
};

export const Playground = {
  args: { trigger: 'Open popover' },
  parameters: {
    docs: {
      source: playgroundSource('Popover', { imports: "import { Popover } from '@gaudi/design-system';", children: `  ${content}` })
    }
  },
  render: (args) => <PopoverRoot {...args}>{content}</PopoverRoot>,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.trigger });
    const panel = () => canvas.queryByText(content);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(panel()).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(panel()).not.toBeInTheDocument());
  }
};

function ComposedExample() {
  const [open, setOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger aria-expanded={open} onClick={() => setOpen(!open)}>Open composed popover</PopoverTrigger>
      {open ? <PopoverContent>{composedContent}</PopoverContent> : null}
    </Popover>
  );
}
export const Composed = {
  parameters: { docs: { description: { story: 'Compose `Popover`, `PopoverTrigger`, and `PopoverContent` when the host owns the open state.' } } },
  render: () => <ComposedExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Open composed popover' });
    await userEvent.click(trigger);
    await expect(canvas.getByText(composedContent)).toBeVisible();
    await userEvent.click(trigger);
    await expect(canvas.queryByText(composedContent)).not.toBeInTheDocument();
  }
};
