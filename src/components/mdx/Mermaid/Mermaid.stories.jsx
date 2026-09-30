import { expect, waitFor } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Mermaid from './Mermaid';

const docs = getComponentDocs('MDX/Mermaid');

export default {
  title: 'MDX/Mermaid',
  id: 'mdx-mermaid',
  component: Mermaid,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { chart: 'text', description: 'text', id: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: {
    id: 'publishing-flow',
    description: 'A publishing workflow moves from draft to review and then publication.',
    chart: 'flowchart TD\n  A[Draft] --> B[Review]\n  B --> C[Publish]'
  },
  parameters: { docs: { source: playgroundSource('Mermaid', { imports: "import { Mermaid } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Mermaid {...args} />,
  play: async ({ args, canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('.mermaid-diagram svg')).toBeInTheDocument(), { timeout: 10000 });
    const diagram = canvasElement.querySelector('.mermaid-diagram');
    await expect(canvasElement.querySelector('.mermaid-error')).not.toBeInTheDocument();
    await expect(diagram).toHaveAccessibleName(args.description);
    for (const label of ['Draft', 'Review', 'Publish']) await expect(diagram).toHaveTextContent(label);
  }
};
