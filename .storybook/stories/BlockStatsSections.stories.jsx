import Card from '../../src/components/core/Card';
import Icon from '../../src/components/core/Icon';
import Pill from '../../src/components/core/Pill';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from './StoryDocs';

const metricStats = [
  [ '86', 'component contracts', 'Folder-level ownership checks across the Gaudi package.' ],
  [ '10', 'token families', 'Neutral, action, status, review, and attention colors.' ],
  [ '0', 'local component dirs', 'Reusable UI now resolves from the Gaudi package.' ]
];

const changelog = [
  [ 'May 2026', 'Gaudi package boundary', 'Components, tokens, icons, docs, and Storybook share one package surface.' ],
  [ 'May 2026', 'Primitive API cleanup', 'Button, Pill, Card, Avatar, Carousel, and Terminal expose named customization props.' ],
  [ 'May 2026', 'A11y documentation pass', 'Overview docs now describe screen reader, keyboard, contrast, and testing expectations.' ]
];

const healthStats = [
  { 'change': '+18', 'label': 'documented stories', 'tone': 'green', 'value': '142' },
  { 'change': '+2', 'label': 'new Core components', 'tone': 'blue', 'value': '2' },
  { 'change': '0', 'label': 'fake links', 'tone': 'gray', 'value': '0' },
  { 'change': 'AA', 'label': 'contrast target', 'tone': 'teal', 'value': '4.5:1' }
];

const toneClasses = {
  'amber': 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  'blue': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  'gray': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  'green': 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  'indigo': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  'rose': 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  'teal': 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
};

const MetricGrid = () => (
  <dl className='grid gap-px overflow-hidden rounded-lg border border-gray-200 bg-gray-200 dark:border-gray-800 dark:bg-gray-800 md:grid-cols-3'>
    {metricStats.map(([ value, label, description ]) => (
      <div key={ label } className='bg-white p-6 dark:bg-gray-950'>
        <dt className='text-sm font-medium text-gray-500 dark:text-gray-400'>{label}</dt>
        <dd className='mt-3'>
          <span className='block text-4xl font-extrabold text-gray-950 dark:text-white'>{value}</span>
          <span className='mt-3 block text-sm leading-6 text-gray-600 dark:text-gray-300'>{description}</span>
        </dd>
      </div>
    ))}
  </dl>
);

const ChangelogStats = () => (
  <div className='overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950'>
    {changelog.map(([ date, title, body ], index) => (
      <article key={ title } className='grid gap-4 border-b border-gray-100 p-5 last:border-b-0 dark:border-gray-800 md:grid-cols-[9rem_1fr]'>
        <time className='text-xs font-semibold uppercase text-blue-600 dark:text-blue-400'>{date}</time>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <Typography variant='heading-sm'>{title}</Typography>
            {index === 0 ? <Pill size='xs' tone='green' variant='soft'>current</Pill> : null}
          </div>
          <p className='mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300'>{body}</p>
        </div>
      </article>
    ))}
  </div>
);

const GradientStats = () => (
  <section className='overflow-hidden rounded-lg bg-gray-950 p-8 text-white'>
    <div className='max-w-2xl'>
      <Pill tone='teal' variant='soft'>system health</Pill>
      <h3 className='mt-4 text-3xl font-extrabold'>Design-system coverage without local overrides.</h3>
      <p className='mt-3 text-sm leading-6 text-white/80'>Use this treatment when numbers need to anchor a release note, migration recap, or quality report.</p>
    </div>
    <div className='mt-8 grid gap-4 md:grid-cols-4'>
      {healthStats.map((item) => (
        <Card key={ item.label } variant='flat' className='border-white/10 bg-white/5 text-white'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-3xl font-extrabold'>{item.value}</p>
              <p className='mt-2 text-xs leading-5 text-white/70'>{item.label}</p>
            </div>
            <span className={ `rounded px-2 py-1 text-xs font-semibold ${toneClasses[item.tone]}` }>{item.change}</span>
          </div>
        </Card>
      ))}
    </div>
  </section>
);

const CompactStats = () => (
  <div className='grid gap-4 md:grid-cols-3'>
    {metricStats.map(([ value, label, description ]) => (
      <div key={ label } className='flex gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950'>
        <Icon name='Check' decorative className='mt-1 text-green-600 dark:text-green-400' />
        <div>
          <p className='text-2xl font-bold text-gray-950 dark:text-white'>{value}</p>
          <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{label}</p>
          <p className='mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400'>{description}</p>
        </div>
      </div>
    ))}
  </div>
);

const usageCode = `import { Card, Pill, Typography } from '@gaudi/design-system';

<section aria-labelledby='system-health'>
  <Typography id='system-health' variant='heading-lg' as='h2'>
    System health
  </Typography>
  <Card variant='outline'>
    <Pill tone='green' size='xs' variant='soft'>current</Pill>
    <p>76 component contracts</p>
  </Card>
</section>`;

const variantRows = [
  [ 'Metric Grid', 'Top-level numbers.', 'Use real labels and descriptions for every metric.' ],
  [ 'Changelog Stats', 'Release or migration timelines.', 'Tie metrics to dated changes.' ],
  [ 'Dark Summary', 'High-emphasis summaries.', 'Use sparingly and keep contrast readable.' ],
  [ 'Compact Inline Stats', 'Docs pages and dense reports.', 'Use icon plus text where space is limited.' ]
];

const variantCode = {
  'changelog': `<div className='rounded-lg border bg-white'>
  {changelog.map(([date, title, body]) => (
    <article key={title} className='grid gap-4 border-b p-5 md:grid-cols-[9rem_1fr]'>
      <time>{date}</time>
      <div>
        <Typography variant='heading-sm'>{title}</Typography>
        <p>{body}</p>
      </div>
    </article>
  ))}
</div>`,
  'compact': `<div className='grid gap-4 md:grid-cols-3'>
  {metricStats.map(([value, label, description]) => (
    <div key={label} className='flex gap-4 rounded-lg border p-5'>
      <Icon name='Check' decorative />
      <div>
        <p>{value}</p>
        <p>{label}</p>
        <p>{description}</p>
      </div>
    </div>
  ))}
</div>`,
  'dark': `<section className='rounded-lg bg-gray-950 p-8 text-white'>
  <Pill tone='teal' variant='soft'>system health</Pill>
  <Typography variant='heading-lg'>Design-system coverage.</Typography>
  <div className='grid gap-4 md:grid-cols-4'>
    {healthStats.map((item) => (
      <Card key={item.label} variant='flat'>{item.value}</Card>
    ))}
  </div>
</section>`,
  'metric': `<dl className='grid gap-px rounded-lg border md:grid-cols-3'>
  {metricStats.map(([value, label, description]) => (
    <div key={label} className='bg-white p-6'>
      <dt>{label}</dt>
      <dd>{value}</dd>
      <p>{description}</p>
    </div>
  ))}
</dl>`
};

const VariantTable = () => (
  <Table>
    <thead>
      <tr><Th>Variant</Th><Th>Use</Th><Th>Rule</Th></tr>
    </thead>
    <tbody>
      {variantRows.map(([ variant, use, rule ]) => (
        <tr key={ variant }><Td>{variant}</Td><Td>{use}</Td><Td>{rule}</Td></tr>
      ))}
    </tbody>
  </Table>
);

export default {
  parameters: pageParameters,
  title: 'Blocks/Stats Sections'
};

export const Default = {
  'name': 'Overview',
  'render': () => (
    <Page
      title='Stats Sections'
      intro='Reference stats recipes for release notes, migration summaries, system-health snapshots, and compact editorial metrics.'
    >
      <Section title='Usage' description='These stats examples are reference recipes, not package exports. Keep metric labels visible and pair numbers with explanatory text.'>
        <CodeBlock code={ usageCode } />
      </Section>
      <Section title='Variant Rules' description='Choose the presentation from the density and importance of the metrics.'>
        <VariantTable />
      </Section>
      <Section title='Metric Grid' description='Use for clear top-level Gaudi or blog metrics.'>
        <div data-docs-example><MetricGrid /></div>
        <CodeBlock code={ variantCode.metric } />
      </Section>
      <Section title='Changelog Stats' description='Use when the numbers are attached to release history.'>
        <div data-docs-example><ChangelogStats /></div>
        <CodeBlock code={ variantCode.changelog } />
      </Section>
      <Section title='Dark Summary' description='Use sparingly for high-contrast summary panels.'>
        <div data-docs-example><GradientStats /></div>
        <CodeBlock code={ variantCode.dark } />
      </Section>
      <Section title='Compact Inline Stats' description='Use inside docs pages where space is limited.'>
        <div data-docs-example><CompactStats /></div>
        <CodeBlock code={ variantCode.compact } />
      </Section>
      <Section title='Implementation Notes' description='Stats recipes must remain readable outside the visual treatment.'>
        <ul className='grid gap-2 text-sm leading-7 text-gray-600 dark:text-gray-300'>
          <li>Use semantic sections with labelled headings.</li>
          <li>Use <InlineCode>Card</InlineCode>, <InlineCode>Pill</InlineCode>, and token color classes instead of bespoke surfaces.</li>
          <li>Do not rely on large numbers alone; include supporting labels and descriptions.</li>
        </ul>
      </Section>
    </Page>
  )
};
