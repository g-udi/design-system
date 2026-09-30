import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Highlight from './Highlight';

const docs = getComponentDocs('MDX/Highlight');
const fixed = 'every node has a type';

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
  args: { children: 'edges carry meaning of their own' },
  parameters: {
    docs: {
      description: { story: 'Two highlights in a paragraph of article prose. The second follows the `children` control and wraps cleanly across lines.' },
      source: playgroundSource('Highlight', {
        imports: "import { Highlight } from '@gaudi/design-system/mdx';",
        before: `<p>\n  What makes a knowledge graph different is that <Highlight>${fixed}</Highlight>, and\n  `,
        after: '. A relational schema\n  stores the same facts, but it hides those relationships inside foreign keys.\n</p>'
      })
    }
  },
  render: (args) => (
    <p className='text-base leading-7 text-text'>
      What makes a knowledge graph different is that <Highlight>{fixed}</Highlight>, and <Highlight {...args} />. A relational schema
      stores the same facts, but it hides those relationships inside foreign keys.
    </p>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const highlight = canvas.getByText(args.children);
    await expect(highlight.tagName).toBe('STRONG');
    await expect(highlight).toHaveClass('font-bold', 'bg-linear-to-r');
    await expect(canvasElement.querySelectorAll('p strong')).toHaveLength(2);
  }
};
