import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Tooltip from './Tooltip';

const docs = getComponentDocs('MDX/Tooltip');

export default {
  title: 'MDX/Tooltip',
  id: 'mdx-tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { message: 'text', children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { message: 'A compact explanation attached to inline text.', children: 'editorial term' },
  parameters: { docs: { source: playgroundSource('Tooltip', { imports: "import { Tooltip } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <p>An <Tooltip {...args} /> can carry a short explanation.</p>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'More information' });
    const tooltip = canvas.getByRole('tooltip', { hidden: true });
    const expectOpen = (open) => waitFor(() => (open ? expect(tooltip).toBeVisible() : expect(tooltip).not.toBeVisible()));

    await expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    await expectOpen(false);
    await userEvent.hover(trigger);
    await expectOpen(true);
    await userEvent.keyboard('{Escape}');
    await expectOpen(false);
    await userEvent.unhover(trigger);
    trigger.focus();
    await expectOpen(true);
    trigger.blur();
    await expectOpen(false);
  }
};
