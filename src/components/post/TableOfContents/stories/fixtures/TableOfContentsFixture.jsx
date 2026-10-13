import { useId, useMemo, useRef } from 'react';
import { TableRoot as Table, TableHeader, TableBodyPrimitive as TableBody, TableRowPrimitive as TableRow, TableHeadPrimitive as TableHead, TableCellPrimitive as TableCell, TableCaption } from '@gaudi/design-system/mdx/Table';
import TableOfContents from '@gaudi/design-system/post/TableOfContents';
import ArticleContentLayout from '@gaudi/design-system/layout/ArticleContentLayout';
import { ScrollArea } from '@gaudi/design-system/core/ScrollArea';
import { Typography } from '@gaudi/design-system';

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

// Article copy keyed by heading ID, so a shortened `toc` still renders matching sections.
const paragraphs = {
  'foundations': [
    'A design system earns trust long before anyone opens a component page. The foundations decide how colour, space, type, and motion relate to each other, and every later decision inherits them.',
    'Treat the foundations as a small, stable vocabulary. When a value changes here, it should change everywhere at once without anyone searching for copies.'
  ],
  'design-tokens': [
    'Tokens name decisions instead of values. A primitive token records that a particular blue exists; a semantic token records that the blue means “interactive”. Components only read the semantic layer.',
    'This indirection is what makes themes cheap. Dark mode, a denser layout, or a brand refresh rewrites the mapping while the components stay untouched.'
  ],
  'semantic-scales': [
    'Scales keep related values in proportion. Spacing grows from one multiplier, type sizes share a ratio, and radii stay within a narrow band so surfaces feel related even when they come from different teams.',
    'Document each scale with its intended role. A value without a role invites one-off usage, and one-off usage is how a system slowly drifts apart.'
  ],
  'components': [
    'Components turn the foundations into behaviour. Each one owns its markup, keyboard support, and states, so applications compose them instead of rebuilding the same controls.',
    'A good component is boring to use: predictable props, sensible defaults, and no surprises when it sits inside a narrow sidebar or a wide dashboard.'
  ],
  'component-contracts': [
    'A contract lists what a component promises. Controlled values stay authoritative, IDs are preserved, callbacks fire once per change, and disabled or read-only states apply immediately.',
    'Write the contract down and test it. When a refactor keeps every promise, consumers can upgrade without reading the diff.'
  ],
  'composition-rules': [
    'Composition rules explain how parts fit together. A field owns its label and error wiring; a dialog owns focus; a menu owns its roving selection. Wrapping one inside another should never break those responsibilities.',
    'Prefer a few explicit compositions over a generic configuration engine. Readers learn faster from concrete examples than from a long list of options.'
  ],
  'accessibility': [
    'Accessibility is part of the definition of done. Every interactive part needs a visible focus state, a meaningful accessible name, and keyboard support that matches platform expectations.',
    'Colour is never the only cue. Status combines tone with text or an icon, and motion respects reduced-motion preferences without removing the information it conveys.',
    'Test with a keyboard first, then with a screen reader. Most problems surface within the first few tab presses.'
  ],
  'documentation': [
    'Documentation is where a system is discovered. Each owner gets one page with a realistic playground, the states that matter, and copyable imports that work outside the docs site.',
    'Keep examples honest. If a story shows a save, say that it is mocked; if a component has limits, list them next to the example rather than in a separate guide.',
    'Good documentation also says when not to use something. Pointing readers to the right owner prevents near-duplicate components from appearing.'
  ],
  'release': [
    'Releases should be uneventful. A predictable cadence, a clear changelog, and automated checks let consumers upgrade on their own schedule.',
    'Breaking changes are announced with a migration path. Removing an API in the same release that introduces its replacement keeps the surface small.'
  ],
  'release-checks': [
    'Before a release, run the lint and contract suites, build the package, and install it into a sample application. Check the compiled stylesheet as well as the JavaScript entries.',
    'Finish with a visual pass across narrow phones, tablets, laptops, and wide screens. Automated checks catch regressions; looking at the result catches everything else.',
    'When every check passes, tag the release and publish the notes. The next upgrade should feel as quiet as this one.'
  ]
};

function TokenDiagram() {
  const layers = [['Primitive', 80, 1], ['Semantic', 240, 0.65], ['Component', 400, 0.35]];
  return <figure className='grid gap-2'>
    <svg role='img' aria-label='Primitive tokens feed semantic tokens, which feed component tokens' viewBox='0 0 480 132' className='w-full max-w-md'>
      <path d='M 110 52 H 210 M 270 52 H 370' stroke='currentColor' strokeOpacity='0.5' />
      {layers.map(([label, x, opacity]) => <g key={label}>
        <circle cx={x} cy='52' r='28' fill='currentColor' opacity={opacity} />
        <text x={x} y='112' textAnchor='middle' fontSize='14' fill='currentColor'>{label}</text>
      </g>)}
    </svg>
    <figcaption className='text-xs text-text-muted'><strong>Token relationship map</strong>: each layer only reads from the one before it.</figcaption>
  </figure>;
}

function TokenInventory() {
  return <Table>
    <TableCaption>Semantic token inventory</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead scope='col'>Token</TableHead>
        <TableHead scope='col'>Role</TableHead>
        <TableHead scope='col'>Light value</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {[['Accent', 'Links and primary actions', 'Blue 600'], ['Border', 'Dividers and field outlines', 'Neutral 200'], ['Danger', 'Destructive actions and errors', 'Red 600']].map(([token, role, value]) => (
        <TableRow key={token}>
          <TableCell>{token}</TableCell>
          <TableCell>{role}</TableCell>
          <TableCell>{value}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>;
}

const visuals = { 'design-tokens': TokenDiagram, 'semantic-scales': TokenInventory };

const flattenSections = (sections) => sections.flatMap((section) => [section, ...flattenSections(section.children || [])]);

export const TableOfContentsFixture = ({ showVisuals = false, ...args }) => {
  const scopeId = useId();
  const viewportRef = useRef(null);
  const articleRef = useRef(null);
  const scopedToc = useMemo(() => {
    const scope = (entries) => entries.map(entry => ({
      ...entry,
      key: entry.id,
      id: `${scopeId}-${entry.id}`,
      url: `#${scopeId}-${entry.id}`,
      children: scope(entry.children || [])
    }));
    return scope(args.toc || toc);
  }, [args.toc, scopeId]);
  return (
  // A bounded reading viewport: scroll the article to watch the contents follow and expand.
  <ScrollArea type='auto' viewportRef={viewportRef} aria-label='Article reading viewport'
    className='h-[min(36rem,80svh)] rounded border border-border [&>[data-slot=scroll-area-viewport]>div]:!block'>
    <ArticleContentLayout className='px-4 sm:px-6' contentClassName='pt-6' aside={
      <aside className='order-1 min-w-0 py-6 lg:order-none lg:col-span-3 lg:row-span-2 lg:sticky lg:top-0 lg:self-start'>
        <TableOfContents { ...args } toc={scopedToc} contentRef={articleRef} targetRef={viewportRef} />
      </aside>
    }>
      <article ref={articleRef} className='not-prose grid min-w-0 gap-10 [&_:is(h2,h3,p,figure)]:m-0'>
        {flattenSections(scopedToc).map((section) => {
          const Heading = `h${Math.min(section.depth + 1, 6)}`;
          const Visual = showVisuals && visuals[section.key];

          return (
            <section key={ section.id } className='grid gap-3'>
              <Typography as={Heading} variant={section.depth === 1 ? 'heading-md' : 'heading-sm'} id={section.id}>{section.value}</Typography>
              {(paragraphs[section.key] || []).map((text) => <Typography key={text} variant='paragraph-sm'>{text}</Typography>)}
              {Visual && <Visual />}
            </section>
          );
        })}
      </article>
    </ArticleContentLayout>
  </ScrollArea>
  );
};
