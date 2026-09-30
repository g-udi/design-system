import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Aside from './Aside';

const docs = getComponentDocs('MDX/Aside');

export default {
  title: 'MDX/Aside',
  id: 'mdx-aside',
  component: Aside,
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
  args: { children: 'Additional context that supports the article without interrupting the main argument.' },
  parameters: { docs: { source: playgroundSource('Aside', { imports: "import { Aside } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Aside {...args} />,
  play: async ({ args, canvasElement }) => {
    const aside = within(canvasElement).getByText(args.children);
    await expect(aside.tagName).toBe('ASIDE');
    await expect(aside).toHaveClass('bg-surface-muted', 'text-text-muted');
  }
};
