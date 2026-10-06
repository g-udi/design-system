import Footnote from '@gaudi/design-system/mdx/Footnote';

// Mirrors the anchors the blog's footnote pipeline emits: the popover reads its HTML from data-footnote-content.
const notes = [
  { number: 1, html: 'Measured on a 2021 MacBook Air with a warm disk cache; see the <a href="https://example.com/benchmarks">benchmark notes</a>.', text: 'Measured on a 2021 MacBook Air with a warm disk cache; see the benchmark notes.' },
  { number: 2, html: 'Modules are sourced with <code>source</code> on first use, then cached for the session.', text: 'Modules are sourced with source on first use, then cached for the session.' }
];

const Ref = ({ number }) => {
  const note = notes[number - 1];
  return (
    <sup id={`fnref-${number}`}>
      <a
        href={`#user-content-fn-${number}`}
        className='footnote-link'
        data-footnote-ref='true'
        data-footnote-popover='true'
        data-footnote-number={number}
        data-footnote-content={note.html}
        aria-label={`Footnote ${number}`}
      >
        {number}
      </a>
    </sup>
  );
};

export function FootnoteExample() {
  return (
    <>
      <p>
        A fresh shell starts in under 50 ms<Ref number={1} />, because the core loads nothing until a command
        asks for it<Ref number={2} />.
      </p>
      <section aria-label='Footnotes' className='mt-4 border-t border-border pt-3 text-sm'>
        <ol className='list-decimal space-y-1 pl-5'>
          {notes.map(({ number, text }) => (
            <li key={number} id={`user-content-fn-${number}`}>{text} <a href={`#fnref-${number}`} aria-label={`Back to reference ${number}`}>{'\u21a9\ufe0e'}</a></li>
          ))}
        </ol>
      </section>
      <Footnote />
    </>
  );
}
