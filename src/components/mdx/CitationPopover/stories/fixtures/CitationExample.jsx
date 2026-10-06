import CitationPopover from '@gaudi/design-system/mdx/CitationPopover';
import CitationTracker from '@gaudi/design-system/mdx/CitationTracker';

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

export function CitationExample() {
  return (
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
  );
}
