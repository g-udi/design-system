import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import LatexText from './LatexText';

const docs = getComponentDocs('MDX/LatexText');

export default {
  title: 'MDX/LatexText',
  id: 'mdx-latextext',
  component: LatexText,
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
  args: { children: '11$^{th}$ International Conference' },
  parameters: { docs: { source: playgroundSource('LatexText', { imports: "import LatexText from '@gaudi/design-system/mdx/LatexText';" }) } },
  render: (args) => <p>Ordinal text stays readable: <LatexText {...args} /></p>,
  play: async ({ canvasElement }) => {
    const paragraph = within(canvasElement).getByText(/Ordinal text stays readable:/);
    await expect(paragraph).toHaveTextContent('International Conference');
    await expect(paragraph).not.toHaveTextContent('$^{th}$');
    await expect(canvasElement.querySelector('.katex')).toBeInTheDocument();
  }
};
