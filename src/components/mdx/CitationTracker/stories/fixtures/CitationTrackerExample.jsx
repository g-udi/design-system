import CitationTracker from '@gaudi/design-system/mdx/CitationTracker';

// Two sources: Hogan is cited twice, so its back-link must follow whichever mention the reader came from.
// Mirrors the markers the blog's citation plugin emits; the article styles draw them as badges.
const cite = (key, id, number) => ({ id, className: 'citation-link', href: `#citation-${key}`, 'data-citation-popover': 'true', 'data-citation-keys': JSON.stringify([key]), children: number });
const sources = [
  { key: 'hogan-2021', entry: 'Hogan et al. (2021). Knowledge Graphs. ACM Computing Surveys 54(4).' },
  { key: 'ehrlinger-2016', entry: 'Ehrlinger and Wöß (2016). Towards a Definition of Knowledge Graphs. SEMANTiCS.' }
];

export function CitationTrackerExample() {
  return (
    <>
      {/* Stop the hash jump so the demo stays in place; the tracker listens in the capture phase. */}
      <div onClick={(event) => event.preventDefault()}>
        <p>
          A knowledge graph is a graph of data intended to accumulate and convey knowledge
          <sup><a aria-label='Hogan, first mention' {...cite('hogan-2021', 'citation-ref-1', 1)} /></sup>. Definitions still
          vary widely<sup><a aria-label='Ehrlinger' {...cite('ehrlinger-2016', 'citation-ref-2', 2)} /></sup>, but most agree
          that the schema can evolve with the data<sup><a aria-label='Hogan, second mention' {...cite('hogan-2021', 'citation-ref-3', 1)} /></sup>.
        </p>
        <ol className='citation-list'>
          {sources.map(({ key, entry }, index) => (
            <li key={key} id={`citation-${key}`}>
              {entry} <a className='citation-back-link' href={`#citation-ref-${index + 1}`} data-citation-key={key} aria-label={`Back to citation ${index + 1}`}>{'\u21a9\ufe0e'}</a>
            </li>
          ))}
        </ol>
      </div>
      <CitationTracker />
    </>
  );
}
