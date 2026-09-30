import { useId, useMemo, useRef } from 'react';
import { expect, waitFor } from 'storybook/test';

import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';

import TableOfContents from './index';

const docs = getComponentDocs('Post/TableOfContents');

const toc = [
  {
    children: [
      { children: [], depth: 2, id: 'design-tokens', url: '#design-tokens', value: 'Design tokens' },
      { children: [], depth: 2, id: 'semantic-scales', url: '#semantic-scales', value: 'Semantic scales' }
    ],
    depth: 1,
    id: 'foundations',
    url: '#foundations',
    value: 'Foundations'
  },
  {
    children: [
      { children: [], depth: 2, id: 'component-contracts', url: '#component-contracts', value: 'Component contracts' },
      { children: [], depth: 2, id: 'composition-rules', url: '#composition-rules', value: 'Composition rules' }
    ],
    depth: 1,
    id: 'components',
    url: '#components',
    value: 'Components'
  },
  {
    children: [],
    depth: 1,
    id: 'accessibility',
    url: '#accessibility',
    value: 'Accessibility'
  },
  {
    children: [],
    depth: 1,
    id: 'documentation',
    url: '#documentation',
    value: 'Documentation'
  },
  {
    children: [
      { children: [], depth: 2, id: 'release-checks', url: '#release-checks', value: 'Release checks' }
    ],
    depth: 1,
    id: 'release',
    url: '#release',
    value: 'Release'
  }
];

const articleSections = toc.flatMap((section) => [ section, ...section.children ]);

const TableOfContentsFixture = ({ showVisuals = false, ...args }) => {
  const scopeId = useId();
  const articleRef = useRef(null);
  const scopedToc = useMemo(() => {
    const scope = (entries) => entries.map(entry => ({
      ...entry,
      id: `${scopeId}-${entry.id}`,
      url: `#${scopeId}-${entry.id}`,
      children: scope(entry.children || [])
    }));
    return scope(args.toc || toc);
  }, [args.toc, scopeId]);
  return (
  <div className='grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-12'>
    <article ref={articleRef} className='min-w-0 space-y-12 lg:col-span-8'>
      {articleSections.map((section) => {
        const Heading = section.depth === 1 ? 'h2' : 'h3';

        return (
          <section key={ section.id } className={ section.depth === 1 ? 'scroll-mt-28' : 'scroll-mt-28 pl-8' }>
            <Heading id={ `${scopeId}-${section.id}` }>{section.value}</Heading>
            <p className='mt-3 text-sm text-gray-600 dark:text-gray-300'>
              Story fixture copy gives the table of contents real headings to observe and target.
            </p>
          </section>
        );
      })}

      {showVisuals && (
        <>
          <figure>
            <figcaption>
              <strong>Token relationship map</strong>
            </figcaption>
            <svg role='img' aria-label='Three design tokens connected in a graph' viewBox='0 0 480 120'>
              <path d='M 110 60 H 220 M 260 60 H 370' stroke='currentColor' />
              <circle cx='80' cy='60' r='28' fill='currentColor' />
              <circle cx='240' cy='60' r='28' fill='currentColor' opacity='0.65' />
              <circle cx='400' cy='60' r='28' fill='currentColor' opacity='0.35' />
            </svg>
          </figure>

          <table>
            <caption>Semantic token inventory</caption>
            <thead>
              <tr>
                <th>Token</th>
                <th>Role</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Accent</td>
                <td>Interactive</td>
                <td>Blue</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </article>
    <aside className='order-first min-w-0 lg:order-last lg:col-span-4'>
      <TableOfContents { ...args } toc={scopedToc} contentRef={articleRef} className='top-6 max-h-[32rem] max-xl:block' />
    </aside>
  </div>
  );
};

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
    docs: { source: playgroundSource('TableOfContents', { imports: "import { TableOfContents } from '@gaudi/design-system';" }) }
  },
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ canvasElement }) => {
    const foundationsLink = tocLink(canvasElement, 'foundations');

    await expect(foundationsLink).toBeInTheDocument();
    await expect(tocLink(canvasElement, 'design-tokens')).not.toBeInTheDocument();

    foundationsLink.addEventListener('click', (event) => event.preventDefault(), { once: true });
    foundationsLink.click();

    await waitFor(() => expect(tocLink(canvasElement, 'design-tokens')).toBeInTheDocument());
    await expect(tocLink(canvasElement, 'semantic-scales')).toBeInTheDocument();
    await waitFor(() => expect(foundationsLink.closest('li')).toHaveClass('text-blue-600!'));
  }
};

export const CompactToc = {
  name: 'Four or fewer sections',
  args: { toc: toc.slice(0, 4) },
  parameters: { docs: { description: { story: 'With four or fewer top-level headings every branch stays expanded.' } } },
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ canvasElement }) => {
    for (const id of [ 'design-tokens', 'component-contracts', 'documentation' ])
      await expect(tocLink(canvasElement, id)).toBeInTheDocument();
  }
};

export const VisualIndex = {
  args: { showVisuals: true, toc },
  parameters: { docs: { description: { story: 'Captioned figures and tables in the article are indexed below the headings with a count summary.' } } },
  render: (args) => <TableOfContentsFixture { ...args } />,
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelector('aside a[href="#visual-diagram-token-relationship-map"]')).toBeInTheDocument());
    await expect(canvasElement.querySelector('aside a[href="#visual-table-semantic-token-inventory"]')).toBeInTheDocument();
    await expect(canvasElement.querySelector('aside')).toHaveTextContent('1 diagram · 1 table');
  }
};
