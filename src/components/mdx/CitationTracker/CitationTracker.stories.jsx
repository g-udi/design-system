import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import CitationTracker from './CitationTracker';

const docs = getComponentDocs('MDX/CitationTracker');
const citation = { 'data-citation-popover': 'true', 'data-citation-keys': '["smith-2026"]', href: '#citation-smith-2026' };

export default {
  title: 'MDX/CitationTracker',
  id: 'mdx-citationtracker',
  component: CitationTracker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  render: () => (
    <>
      {/* Stop the hash jump so the demo stays in place; the tracker listens in the capture phase. */}
      <p onClick={(event) => event.preventDefault()}>
        Smith introduced the idea <a id='citation-ref-1' {...citation}>Citation one</a> and revisited it
        later <a id='citation-ref-2' {...citation}>Citation two</a>.
      </p>
      <ol>
        <li id='citation-smith-2026'>
          Smith 2026. <a className='citation-back-link' href='#citation-ref-1' data-citation-key='smith-2026' aria-label='Back to citation'>Back</a>
        </li>
      </ol>
      <CitationTracker />
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const backLink = canvas.getByRole('link', { name: 'Back to citation' });
    await userEvent.click(canvas.getByRole('link', { name: 'Citation two' }));
    await waitFor(() => expect(backLink.hash).toBe('#citation-ref-2'));
    await userEvent.click(canvas.getByRole('link', { name: 'Citation one' }));
    await waitFor(() => expect(backLink.hash).toBe('#citation-ref-1'));
  }
};
