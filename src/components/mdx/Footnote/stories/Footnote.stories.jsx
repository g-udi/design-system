import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { FootnoteExample } from './fixtures/FootnoteExample.jsx';
import exampleSource from './fixtures/FootnoteExample.jsx?raw';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import styles from '../../MdxContent/MdxContent.module.css';
import Footnote from '../Footnote';

const docs = getComponentDocs('MDX/Footnote');
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
  parameters: { docs: { source: { code: publicSource(exampleSource, new URL('./fixtures/FootnoteExample.jsx', import.meta.url)), language: 'jsx' }, description: { story: 'A paragraph with two footnotes and the generated footnote list. Hover or focus a marker to read the note in place; the first note links to its source.' } } },
  render: () => <FootnoteExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = [1, 2].map((number) => canvas.getByRole('link', { name: `Footnote ${number}` }));
    await expect(first).toHaveAttribute('href', '#user-content-fn-1');
    first.focus();
    await userEvent.hover(first);
    await waitFor(() => expect(screen.getByRole('link', { name: 'benchmark notes' })).toBeVisible());
    await userEvent.unhover(first);
    await new Promise((resolve) => setTimeout(resolve, 250));
    await expect(screen.getByRole('dialog', { name: 'Footnote 1' })).toBeVisible();
    screen.getByRole('link', { name: 'benchmark notes' }).focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Footnote 1' })).not.toBeInTheDocument());
    await expect(first).toHaveFocus();
    await expect(first).not.toHaveAttribute('aria-describedby');
    await new Promise((resolve) => setTimeout(resolve, 350));
    await expect(screen.queryByRole('dialog', { name: 'Footnote 1' })).not.toBeInTheDocument();
    first.blur();
    await userEvent.hover(second);
    await waitFor(() => expect(screen.getByText(/cached for the session/, { selector: ':not(li)' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Footnote 2' })).not.toBeInTheDocument());
  }
};
