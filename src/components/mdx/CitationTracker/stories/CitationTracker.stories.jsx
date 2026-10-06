import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { CitationTrackerExample } from './fixtures/CitationTrackerExample.jsx';
import exampleSource from './fixtures/CitationTrackerExample.jsx?raw';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import styles from '../../MdxContent/MdxContent.module.css';
import CitationTracker from '../CitationTracker';

const docs = getComponentDocs('MDX/CitationTracker');
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
  decorators: [(Story) => <ExampleFrame><article className={styles.root}><Story /></article></ExampleFrame>]
};

export const Playground = {
  parameters: { docs: { source: { code: publicSource(exampleSource, new URL('./fixtures/CitationTrackerExample.jsx', import.meta.url)), language: 'jsx' }, description: { story: 'An article paragraph cites Hogan twice and Ehrlinger once. Select a citation marker, then the ↩ back-link in the reference list: it returns to the mention you came from.' } } },
  render: () => <CitationTrackerExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hogan = canvas.getByRole('link', { name: 'Back to citation 1' });
    const ehrlinger = canvas.getByRole('link', { name: 'Back to citation 2' });
    await userEvent.click(canvas.getByRole('link', { name: 'Hogan, second mention' }));
    await waitFor(() => expect(hogan.hash).toBe('#citation-ref-3'));
    await userEvent.click(canvas.getByRole('link', { name: 'Hogan, first mention' }));
    await waitFor(() => expect(hogan.hash).toBe('#citation-ref-1'));
    // Other sources keep their own back-link.
    await expect(ehrlinger.hash).toBe('#citation-ref-2');
  }
};
