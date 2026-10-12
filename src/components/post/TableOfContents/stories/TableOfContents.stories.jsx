import { toc, TableOfContentsFixture } from './fixtures/TableOfContentsFixture.jsx';
import TableOfContentsFixtureSource from './fixtures/TableOfContentsFixture.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, waitFor } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import TableOfContents from '../index';

const docs = getComponentDocs('Post/TableOfContents');

const tocLink = (canvasElement, id) => canvasElement.querySelector(`aside a[href$="-${id}"]`);

export default {
  title: 'Post/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { toc: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { toc },
  parameters: {
    docs: {
      description: { story: 'An article with five sections, nested subsections, a captioned diagram, and a table. With more than four top-level headings only the active branch expands, and captioned figures and tables are indexed below the headings with a count summary. Edit `toc` to rename, add, or remove entries.' },
      source: playgroundSource('TableOfContentsFixture', { imports: publicSource(TableOfContentsFixtureSource, new URL('./fixtures/TableOfContentsFixture.jsx', import.meta.url)), attributes: ['showVisuals'] })
    }
  },
  render: (args) => <TableOfContentsFixture { ...args } showVisuals />,
  play: async ({ args, canvasElement }) => {
    const aside = canvasElement.querySelector('aside');
    for (const entry of args.toc) await expect(aside).toHaveTextContent(entry.value);
    await waitFor(() => expect(aside.querySelector('a[href="#visual-diagram-token-relationship-map"]')).toBeInTheDocument());
    await expect(aside.querySelector('a[href="#visual-table-semantic-token-inventory"]')).toBeInTheDocument();
    await expect(aside).toHaveTextContent('1 diagram · 1 table');

    const foundationsLink = tocLink(canvasElement, 'foundations');
    if (!foundationsLink || args.toc.length <= 4) return;
    await expect(tocLink(canvasElement, 'design-tokens')).not.toBeInTheDocument();

    foundationsLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    foundationsLink.click();

    await waitFor(() => expect(tocLink(canvasElement, 'design-tokens')).toBeInTheDocument());
    await expect(tocLink(canvasElement, 'semantic-scales')).toBeInTheDocument();
    await waitFor(() => expect(foundationsLink.closest('li')).toHaveClass('text-accent!'));
  }
};

export const CompactToc = {
  name: 'Four or fewer sections',
  args: { toc: toc.slice(0, 4) },
  parameters: { docs: { description: { story: 'With four or fewer top-level headings every branch stays expanded.' } } },
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ args, canvasElement }) => {
    const headings = canvasElement.querySelectorAll('article h2, article h3');
    await expect([...headings].map((heading) => heading.textContent)).toEqual(args.toc.flatMap((section) => [section.value, ...section.children.map((child) => child.value)]));
    for (const id of [ 'design-tokens', 'component-contracts', 'documentation' ])
      await expect(tocLink(canvasElement, id)).toBeInTheDocument();
  }
};
