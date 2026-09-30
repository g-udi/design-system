import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import Tooltip from './Tooltip';

const docs = getComponentDocs('Core/Tooltip');
const trigger = 'Copy link';
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const focusTooltip = async (canvasElement, name) => {
  await userEvent.tab();
  await expect(within(canvasElement).getByRole('button', { name })).toHaveFocus();
  return waitFor(() => page(canvasElement).getByRole('tooltip'));
};

export default {
  title: 'Core/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { content: 'text', side: ['top', 'right', 'bottom', 'left'], delayDuration: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { content: 'Copy a link to this article', side: 'top', delayDuration: 300 },
  parameters: {
    docs: {
      source: playgroundSource('Tooltip', {
        imports: "import { Button, Tooltip } from '@gaudi/design-system';",
        children: `  <Button variant='outline' tone='neutral'>${trigger}</Button>`
      })
    }
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant='outline' tone='neutral'>{trigger}</Button>
    </Tooltip>
  ),
  play: async ({ args, canvasElement }) => {
    const tooltip = await focusTooltip(canvasElement, trigger);
    await expect(tooltip).toHaveTextContent(args.content);
    await expect(within(canvasElement).getByRole('button', { name: trigger })).toHaveAccessibleDescription(args.content);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page(canvasElement).queryByRole('tooltip')).not.toBeInTheDocument());
  }
};

export const LongHint = {
  parameters: { docs: { description: { story: 'Longer hints wrap within the viewport, including on narrow phones.' } } },
  render: () => (
    <Tooltip content='This explanation wraps within the viewport, including on narrow phones.'>
      <Button variant='ghost'>About this collection</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const tooltip = await focusTooltip(canvasElement, 'About this collection');
    const bubble = tooltip.parentElement.getBoundingClientRect();
    await expect(bubble.width).toBeLessThanOrEqual(canvasElement.ownerDocument.documentElement.clientWidth);
    await userEvent.keyboard('{Escape}');
  }
};
