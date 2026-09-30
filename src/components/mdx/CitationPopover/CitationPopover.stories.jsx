import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import CitationTracker from '../CitationTracker';
import styles from '../MdxContent/MdxContent.module.css';
import CitationPopover from './CitationPopover';

const docs = getComponentDocs('MDX/Citation');
const references = [
  { key: 'HusseinYC18', text: 'Hussein et al. (2018). <strong>Representation learning for heterogeneous information networks</strong>.' },
  { key: 'WangJSWYCY19', text: 'Wang et al. (2019). <strong>Heterogeneous graph neural network literature</strong>.' },
  { key: 'YangXJWHW20', text: 'Yang et al. (2020). <strong>Learning over heterogeneous graph structures</strong>.' }
];

/** Mirrors the anchor the blog's rehype citation plugin emits for `[@key; @key]`. */
const Cite = ({ id, numbers }) => {
  const cited = numbers.map((number) => references[number - 1]);
  return (
    <sup>
      <a
        id={id}
        className={`citation-link ${numbers.length > 1 ? 'citation-group' : ''}`}
        href={`#citation-${cited.at(-1).key}`}
        data-citation-popover='true'
        data-citation-keys={JSON.stringify(cited.map(({ key }) => key))}
        data-citation-numbers={JSON.stringify(numbers)}
        data-citation-texts={JSON.stringify(cited.map(({ text }) => text))}
        aria-label={numbers.length === 1 ? `Reference ${numbers[0]}` : `References ${numbers.join(', ')}`}
      >
        {numbers.map((number) => <span key={number}>{number}</span>)}
      </a>
    </sup>
  );
};

export default {
  title: 'MDX/Citation',
  id: 'mdx-citation',
  component: CitationPopover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><article className={styles.root}><Story /></article></ExampleFrame>]
};

export const Playground = {
  render: () => (
    <>
      <p>
        A heterogeneous graph assigns types to nodes and edges<Cite id='cite-ref-1' numbers={[1]} />, and grouped
        citations keep every source reachable from one marker<Cite id='cite-ref-2' numbers={[1, 2, 3]} />.
      </p>
      <section className='citations-section' aria-label='References'>
        <ol className='citation-list'>
          {references.map(({ key, text }) => (
            <li key={key} id={`citation-${key}`}>
              <span className='citation-entry' dangerouslySetInnerHTML={{ __html: text }} />
              <a className='citation-back-link hidden' data-citation-key={key} href='#cite-ref-1'>Go back</a>
            </li>
          ))}
        </ol>
      </section>
      <CitationTracker />
      <CitationPopover />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const popover = () => within(canvasElement.querySelector('[data-gaudi-citation-popover-root="true"]'));
    const single = canvas.getByRole('link', { name: 'Reference 1' });
    const group = canvas.getByRole('link', { name: 'References 1, 2, 3' });

    await expect(single).toHaveAttribute('href', '#citation-HusseinYC18');
    await userEvent.hover(single);
    await waitFor(() => expect(popover().getByText(/Representation learning for heterogeneous information networks/)).toBeVisible());

    await userEvent.hover(group);
    const wang = await waitFor(() => popover().getByRole('link', { name: /2 Wang et al\. \(2019\)/ }));
    await userEvent.click(wang);

    const backLink = canvas.getByText(/Wang et al\. \(2019\)/).closest('li').querySelector('.citation-back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '#cite-ref-2');
    await expect(group).toHaveAttribute('data-citation-popover-bound', 'true');
  }
};
