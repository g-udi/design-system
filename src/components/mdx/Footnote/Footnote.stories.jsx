import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import styles from '../MdxContent/MdxContent.module.css';
import Footnote from './Footnote';

const docs = getComponentDocs('MDX/Footnote');
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

export default {
  title: 'MDX/Footnote',
  id: 'mdx-footnote',
  component: Footnote,
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
  parameters: { docs: { description: { story: 'A paragraph with two footnotes and the generated footnote list. Hover or focus a marker to read the note in place; the first note links to its source.' } } },
  render: () => (
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
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = [1, 2].map((number) => canvas.getByRole('link', { name: `Footnote ${number}` }));
    await expect(first).toHaveAttribute('href', '#user-content-fn-1');
    await userEvent.hover(first);
    await waitFor(() => expect(screen.getByRole('link', { name: 'benchmark notes' })).toBeVisible());
    await userEvent.unhover(first);
    await userEvent.hover(second);
    await waitFor(() => expect(screen.getByText(/cached for the session/, { selector: ':not(li)' })).toBeVisible());
  }
};
