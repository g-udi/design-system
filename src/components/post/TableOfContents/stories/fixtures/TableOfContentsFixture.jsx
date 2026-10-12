import { useId, useMemo, useRef } from 'react';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import TableOfContents from '@gaudi/design-system/post/TableOfContents';

export const toc = [
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

const flattenSections = (sections) => sections.flatMap((section) => [section, ...flattenSections(section.children || [])]);

export const TableOfContentsFixture = ({ showVisuals = false, ...args }) => {
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
    <article ref={articleRef} className='min-w-0 space-y-6 lg:col-span-8'>
      {flattenSections(scopedToc).map((section) => {
        const Heading = `h${Math.min(section.depth + 1, 6)}`;

        return (
          <section key={ section.id } className={ section.depth === 1 ? 'scroll-mt-28' : 'scroll-mt-28 pl-8' }>
            <Heading id={section.id}>{section.value}</Heading>
            <p className='mt-1 text-sm text-text-muted'>
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
            <svg role='img' aria-label='Three design tokens connected in a graph' viewBox='0 0 480 120' className='w-full max-w-sm'>
              <path d='M 110 60 H 220 M 260 60 H 370' stroke='currentColor' />
              <circle cx='80' cy='60' r='28' fill='currentColor' />
              <circle cx='240' cy='60' r='28' fill='currentColor' opacity='0.65' />
              <circle cx='400' cy='60' r='28' fill='currentColor' opacity='0.35' />
            </svg>
          </figure>

          <Table>
            <TableCaption>Semantic token inventory</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead scope='col'>Token</TableHead>
                <TableHead scope='col'>Role</TableHead>
                <TableHead scope='col'>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Accent</TableCell>
                <TableCell>Interactive</TableCell>
                <TableCell>Blue</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </article>
    <aside className='order-first min-w-0 lg:order-last lg:col-span-4'>
      <TableOfContents { ...args } toc={scopedToc} contentRef={articleRef} className='top-6 max-h-[32rem] max-xl:block' />
    </aside>
  </div>
  );
};
