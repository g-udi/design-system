import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Quote from './Quote';

const docs = getComponentDocs('MDX/Quote');

export default {
  title: 'MDX/Quote',
  id: 'mdx-quote',
  component: Quote,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { text: 'text', author: 'text', title: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { text: 'Good component systems make product code calmer.', author: 'Design System', title: 'Internal principle' },
  parameters: { docs: { source: playgroundSource('Quote', { imports: "import { Quote } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Quote {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelector('figure blockquote')).toContainElement(canvas.getByText(args.text));
    await expect(canvas.getByText(args.author).tagName).toBe('CITE');
    await expect(canvas.getByText(args.title)).toBeVisible();
  }
};
