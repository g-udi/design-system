import { toc, TableOfContentsFixture } from './fixtures/TableOfContentsFixture.jsx';
import TableOfContentsFixtureSource from './fixtures/TableOfContentsFixture.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';

import TableOfContents from '../index';
import { checkContentIndex } from '../../../../../tests/components/post/TableOfContents/checkContentIndex.js';
import { checkHeadingHierarchy } from '../../../../../tests/components/post/TableOfContents/checkHeadingHierarchy.js';

const docs = getComponentDocs('Blocks/Blog/TableOfContents');

const tocLink = (canvasElement, id) => canvasElement.querySelector(`aside a[href$="-${id}"]`);
const readingViewport = (canvasElement) => within(canvasElement).getByRole('region', { name: 'Article reading viewport' });

export default {
  id: 'post-tableofcontents',
  title: 'Blocks/Blog/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { toc: 'object', offset: 'number', smooth: 'boolean', indexVisuals: 'boolean' }),
  parameters: {
    controlAudit: { interaction: ['smooth', 'offset'] },
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { toc, offset: 24, smooth: true, indexVisuals: true },
  parameters: {
    docs: {
      description: { story: 'Scroll the bounded article to watch the contents follow the reading position. With five sections, only the active branch stays expanded; each branch also has a named keyboard-operable toggle. Shared Scrollspy tracks the supplied reading viewport. The optional index lists the captioned diagram and the table inside Foundations.' },
      source: playgroundSource('TableOfContentsFixture', { imports: publicSource(TableOfContentsFixtureSource, new URL('./fixtures/TableOfContentsFixture.jsx', import.meta.url)), attributes: ['showVisuals'] })
    }
  },
  render: (args) => <TableOfContentsFixture { ...args } showVisuals />,
  play: async ({ args, canvasElement }) => {
    checkContentIndex(canvasElement);
    await checkHeadingHierarchy(canvasElement);
    const aside = canvasElement.querySelector('aside');
    for (const entry of args.toc) await expect(aside).toHaveTextContent(entry.value);
    const canvas = within(canvasElement);
    if (args.indexVisuals) {
      const index = await canvas.findByRole('button', { name: /Diagrams & tables/u });
      await userEvent.click(index);
      await expect(aside.querySelector('a[href="#visual-diagram-token-relationship-map"]')).toBeVisible();
      await expect(aside.querySelector('a[href="#visual-table-semantic-token-inventory"]')).toBeVisible();
      await expect(aside).toHaveTextContent('1 diagram · 1 table');
    } else await expect(canvas.queryByRole('button', { name: /Diagrams & tables/u })).not.toBeInTheDocument();

    const foundationsLink = tocLink(canvasElement, 'foundations');
    if (!foundationsLink || args.toc.length <= 4) return;
    await userEvent.click(foundationsLink);
    await waitFor(() => expect(foundationsLink).toHaveAttribute('aria-current', 'location'));
    await expect(tocLink(canvasElement, 'design-tokens')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse Foundations' }));
    await expect(tocLink(canvasElement, 'design-tokens')).not.toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Expand Foundations' }));
    await expect(tocLink(canvasElement, 'semantic-scales')).toBeVisible();
    await userEvent.click(tocLink(canvasElement, 'design-tokens'));
    await waitFor(() => expect(tocLink(canvasElement, 'design-tokens')).toHaveAttribute('aria-current', 'location'));
    await expect(foundationsLink).not.toHaveAttribute('aria-current');

    // Reading to the end follows the active section and folds the branches left behind.
    const viewport = readingViewport(canvasElement);
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'auto' });
    await waitFor(() => expect(tocLink(canvasElement, 'release-checks')).toHaveAttribute('aria-current', 'location'));
    await waitFor(() => expect(tocLink(canvasElement, 'release-checks')).toBeVisible());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Expand Foundations' })).toBeInTheDocument());
    await expect(tocLink(canvasElement, 'design-tokens')).not.toBeVisible();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { commands } = await import('vitest/browser');
      const scrollTo = spyOn(viewport, 'scrollTo');
      try {
        await commands.emulateStoryMedia({ reducedMotion: 'reduce' });
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        await userEvent.click(foundationsLink);
        await expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }));
      } finally {
        scrollTo.mockRestore();
        await commands.emulateStoryMedia({ reducedMotion: null });
      }
    }
  }
};

export const CompactToc = {
  name: 'Four or fewer sections',
  args: { toc: toc.slice(0, 4) },
  parameters: { docs: { description: { story: 'With four or fewer top-level headings every branch stays expanded while you scroll.' } } },
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ args, canvasElement }) => {
    const headings = canvasElement.querySelectorAll('article h2, article h3');
    await expect([...headings].map((heading) => heading.textContent)).toEqual(args.toc.flatMap((section) => [section.value, ...section.children.map((child) => child.value)]));
    for (const id of [ 'design-tokens', 'component-contracts', 'documentation' ])
      await expect(tocLink(canvasElement, id)).toBeInTheDocument();
  }
};
