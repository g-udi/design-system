import { expect, waitFor } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Mermaid from './Mermaid';

const docs = getComponentDocs('MDX/Mermaid');
const description = 'A draft goes to review. Approved drafts are scheduled and published; rejected drafts return for revision.';
const lead = 'Every post follows the same path from draft to publication, and a rejected review sends it back for another pass.';
// A real editorial workflow: a decision, a loop back, and a labelled branch.
const chart = [
  'flowchart LR',
  '  A[Draft] --> B[Review]',
  '  B --> C{Approved?}',
  '  C -- No --> D[Revise]',
  '  D --> B',
  '  C -- Yes --> E[Schedule]',
  '  E --> F([Publish])'
].join('\n');

export default {
  title: 'MDX/Mermaid',
  id: 'mdx-mermaid',
  component: Mermaid,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { chart: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { chart },
  parameters: {
    docs: {
      description: { story: 'An editorial workflow in article context, with a decision, a revision loop, and labelled branches. Edit `chart` to redraw it.' },
      source: playgroundSource('Mermaid', {
        imports: "import { Mermaid } from '@gaudi/design-system/mdx';",
        attributes: ["id='publishing-flow'", `description='${description}'`]
      })
    }
  },
  render: (args) => (
    <div className='text-base leading-7 text-text'>
      <p>{lead}</p>
      <Mermaid id='publishing-flow' description={description} {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('.mermaid-diagram svg')).toBeInTheDocument(), { timeout: 10000 });
    const diagram = canvasElement.querySelector('.mermaid-diagram');
    await expect(canvasElement.querySelector('.mermaid-error')).not.toBeInTheDocument();
    await expect(diagram).toHaveAccessibleName(description);
    // Every node label in the chart source is drawn.
    for (const [, label] of args.chart.matchAll(/[[{(]+([^\]})]+)[\]})]+/g)) await expect(diagram).toHaveTextContent(label);
  }
};
