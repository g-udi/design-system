import StatGroup from '../../src/components/blocks/StatGroup';
import Card from '../../src/components/core/Card';
import Icon from '../../src/components/core/Icon';
import Pill from '../../src/components/core/Pill';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from './StoryDocs';

const metricStats = [
  { 'detail': 'Folder-level ownership checks across the Gaudi package.', 'id': 'contracts', 'label': 'Component contracts', 'value': '86' },
  { 'detail': 'Neutral, action, status, review, and attention colors.', 'id': 'tokens', 'label': 'Token families', 'value': '10' },
  { 'detail': '▼ 14 since April: reusable UI resolves from the package.', 'id': 'local', 'label': 'Local component folders', 'tone': 'success', 'value': '0' }
];

const changelog = [
  [ '2026-05-28', 'Gaudi package boundary', 'Components, tokens, icons, docs, and Storybook share one package surface.' ],
  [ '2026-05-14', 'Primitive API cleanup', 'Button, Pill, Card, Avatar, Carousel, and Terminal expose named customization props.' ],
  [ '2026-05-02', 'A11y documentation pass', 'Overview docs now describe screen reader, keyboard, contrast, and testing expectations.' ]
];

const formatMonth = (date) => new Date(date).toLocaleDateString('en-GB', { 'day': 'numeric', 'month': 'short', 'year': 'numeric' });

const MetricGrid = () => <StatGroup label='Package health' items={ metricStats } />;

const ChangelogStats = () => (
  <Card variant='outline' padding='none'>
    {changelog.map(([ date, title, body ], index) => (
      <article key={ title } className='grid gap-4 border-b border-border p-5 last:border-b-0 md:grid-cols-[9rem_1fr]'>
        <time dateTime={ date } className='text-xs font-semibold uppercase text-accent'>{formatMonth(date)}</time>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <Typography as='h3' variant='heading-sm'>{title}</Typography>
            {index === 0 ? <Pill size='xs' tone='green' variant='soft' className='m-0'>Current</Pill> : null}
          </div>
          <p className='mt-2 text-sm leading-6 text-text-muted'>{body}</p>
        </div>
      </article>
    ))}
  </Card>
);

const CompactStats = () => (
  <div className='grid gap-4 md:grid-cols-3'>
    {metricStats.map((item) => (
      <Card key={ item.id } variant='outline' padding='lg' classNames={{ 'body': 'flex gap-4' }}>
        <Icon name='Check' decorative className='mt-1 shrink-0 text-success' />
        <div>
          <p className='text-2xl font-bold text-text'>{item.value}</p>
          <p className='text-sm font-semibold text-text'>{item.label}</p>
          <p className='mt-1 text-xs leading-5 text-text-muted'>{item.detail}</p>
        </div>
      </Card>
    ))}
  </div>
);

const usageCode = `import { StatGroup } from '@gaudi/design-system';

const items = [
  { id: 'contracts', label: 'Component contracts', value: '86', detail: 'Ownership checks across the package.' },
  { id: 'local', label: 'Local component folders', value: '0', detail: '▼ 14 since April', tone: 'success' }
];

<StatGroup label='Package health' items={items} />`;

const variantRows = [
  [ 'Metric Grid', 'Top-level numbers.', 'Use StatGroup; give every value a label and a text explanation.' ],
  [ 'Changelog Stats', 'Release or migration timelines.', 'Tie metrics to dated changes.' ],
  [ 'Compact Inline Stats', 'Docs pages and dense reports.', 'Use icon plus text where space is limited.' ]
];

const variantCode = {
  'changelog': `<Card variant='outline' padding='none'>
  {changelog.map(([date, title, body]) => (
    <article key={title} className='grid gap-4 border-b border-border p-5 md:grid-cols-[9rem_1fr]'>
      <time dateTime={date} className='text-xs font-semibold uppercase text-accent'>{formatMonth(date)}</time>
      <div>
        <Typography as='h3' variant='heading-sm'>{title}</Typography>
        <p className='text-sm text-text-muted'>{body}</p>
      </div>
    </article>
  ))}
</Card>`,
  'compact': `<div className='grid gap-4 md:grid-cols-3'>
  {items.map((item) => (
    <Card key={item.id} variant='outline' padding='lg' classNames={{ body: 'flex gap-4' }}>
      <Icon name='Check' decorative className='text-success' />
      <div>
        <p className='text-2xl font-bold'>{item.value}</p>
        <p className='text-sm font-semibold'>{item.label}</p>
        <p className='text-xs text-text-muted'>{item.detail}</p>
      </div>
    </Card>
  ))}
</div>`,
  'metric': `<StatGroup label='Package health' items={items} />`
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
      intro='Metric compositions for release notes, migration summaries, and compact editorial reports.'
    >
      <Section title='Usage' description='StatGroup is the exported metric block; the changelog and compact layouts are reference recipes built from Card and Typography. Keep metric labels visible and pair numbers with explanatory text.'>
        <CodeBlock code={ usageCode } />
      </Section>
      <Section title='Variant Rules' description='Choose the presentation from the density and importance of the metrics.'>
        <VariantTable />
      </Section>
      <Section title='Metric Grid' description='The exported StatGroup: labelled values with a supporting line, toned only when the text also explains the trend.'>
        <div data-docs-example><MetricGrid /></div>
        <CodeBlock code={ variantCode.metric } />
      </Section>
      <Section title='Changelog Stats' description='Use when the numbers are attached to release history.'>
        <div data-docs-example><ChangelogStats /></div>
        <CodeBlock code={ variantCode.changelog } />
      </Section>
      <Section title='Compact Inline Stats' description='Use inside docs pages where space is limited.'>
        <div data-docs-example><CompactStats /></div>
        <CodeBlock code={ variantCode.compact } />
      </Section>
      <Section title='Implementation Notes' description='Stats recipes must remain readable outside the visual treatment.'>
        <ul className='grid gap-2 text-sm leading-7 text-text-muted'>
          <li>Use semantic sections with labelled headings.</li>
          <li>Use <InlineCode>StatGroup</InlineCode>, <InlineCode>Card</InlineCode>, <InlineCode>Pill</InlineCode>, and token color classes instead of bespoke surfaces.</li>
          <li>Do not rely on large numbers alone; include supporting labels and descriptions.</li>
        </ul>
      </Section>
    </Page>
  )
};
