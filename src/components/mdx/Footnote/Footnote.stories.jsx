import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import styles from '../MdxContent/MdxContent.module.css';
import Footnote from './Footnote';

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
  render: () => (
    <>
      <p>
        Footnotes stay readable without moving the reader away from the current paragraph
        <sup id='fnref-1'>
          <a
            href='#user-content-fn-1'
            className='footnote-link'
            data-footnote-ref='true'
            data-footnote-popover='true'
            data-footnote-number='1'
            data-footnote-content='A short explanatory footnote with an <a href="https://example.com">external source</a>.'
            aria-label='Footnote 1'
          >
            1
          </a>
        </sup>
        .
      </p>
      <section aria-label='Footnotes'>
        <ol>
          <li id='user-content-fn-1'>A short explanatory footnote with an external source. <a href='#fnref-1'>Go back</a></li>
        </ol>
      </section>
      <Footnote />
    </>
  ),
  play: async ({ canvasElement }) => {
    const footnote = within(canvasElement).getByRole('link', { name: 'Footnote 1' });
    await expect(footnote).toHaveAttribute('href', '#user-content-fn-1');
    await userEvent.hover(footnote);
    await waitFor(() => expect(screen.getByRole('link', { name: 'external source' })).toBeVisible());
  }
};
