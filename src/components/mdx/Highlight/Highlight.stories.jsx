import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Highlight from './Highlight';

const docs = getComponentDocs('MDX/Highlight');

export default {
  title: 'MDX/Highlight',
  id: 'mdx-highlight',
  component: Highlight,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { children: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { children: 'inline emphasis' },
  parameters: { docs: { source: playgroundSource('Highlight', { imports: "import { Highlight } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <p>Use <Highlight {...args} /> inside normal article prose.</p>,
  play: async ({ args, canvasElement }) => {
    const highlight = within(canvasElement).getByText(args.children);
    await expect(highlight.tagName).toBe('STRONG');
    await expect(highlight).toHaveClass('font-bold', 'bg-gradient-to-r');
  }
};
