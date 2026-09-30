import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Details from './Details';

const docs = getComponentDocs('MDX/Details');

export default {
  title: 'MDX/Details',
  id: 'mdx-details',
  component: Details,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { title: 'text', headingLevel: [2, 3, 4, 5, 6], children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { title: 'Implementation detail', headingLevel: 2, children: 'Details are keyboard accessible and preserve article flow.' },
  parameters: { docs: { source: playgroundSource('Details', { imports: "import { Details } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Details {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: args.title });
    await expect(trigger.parentElement.tagName).toBe(`H${args.headingLevel}`);
    await expect(canvas.queryByText(args.children)).not.toBeInTheDocument();
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText(args.children)).toBeVisible();
    await userEvent.click(trigger);
    await expect(canvas.queryByText(args.children)).not.toBeInTheDocument();
  }
};
