import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import LatexText from './LatexText';

const docs = getComponentDocs('MDX/LatexText');
// BibTeX fields as they arrive from a .bib file: accents, en dashes, and inline math.
const references = [
  'Lena Hyv{\\"o}nen and Jonas F{\\"a}rber. Semantic portals for cultural heritage.',
  null,
  'Jos\\\'{e} Garc\\\'{i}a and Ana M{\\"u}ller. An $O(n \\log n)$ algorithm for entity linking, pp. 101--118.'
];

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
  args: { children: 'Profiling open data portals at scale. In Proceedings of the 11$^{th}$ International Conference on Semantic Systems, pp. 33--40.' },
  parameters: {
    docs: {
      description: { story: 'A bibliography rendered from raw BibTeX fields: umlauts and acute accents, an ordinal superscript, an en dash page range, and inline math. The second entry follows the `children` control.' },
      source: playgroundSource('LatexText', { imports: "import LatexText from '@gaudi/design-system/mdx/LatexText';" })
    }
  },
  render: (args) => (
    <section aria-label='References' className='text-sm leading-6 text-gray-700 dark:text-gray-300'>
      <h2 className='mb-2 text-base font-semibold text-gray-900 dark:text-white'>References</h2>
      <ol className='list-decimal space-y-2 pl-5'>
        {references.map((entry) => <li key={entry || 'controlled'}>{entry ? <LatexText>{entry}</LatexText> : <LatexText {...args} />}</li>)}
      </ol>
    </section>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second, third] = canvas.getAllByRole('listitem');
    await expect(first).toHaveTextContent('Hyvönen and Jonas Färber');
    // Inline math in the controlled entry renders with KaTeX instead of printing the raw source.
    if (/\$[^$]+\$/.test(args.children)) {
      await expect(second).not.toHaveTextContent('$');
      await expect(second.querySelector('.katex')).toBeInTheDocument();
    }
    await expect(third).toHaveTextContent('José García and Ana Müller');
    await expect(third).toHaveTextContent('pp. 101–118');
  }
};
