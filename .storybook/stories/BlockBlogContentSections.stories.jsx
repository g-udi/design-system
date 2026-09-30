import { useState } from 'react';

import ArticleContentLayout from '../../src/components/layout/ArticleContentLayout';
import Banner from '../../src/components/core/Banner';
import Button from '../../src/components/core/Button';
import Card from '../../src/components/core/Card';
import { Grid, GridItem } from '../../src/components/core/Grid';
import Icon from '../../src/components/core/Icon';
import Faq from '../../src/components/mdx/Faq';
import Pill from '../../src/components/core/Pill';
import PostHeader from '../../src/components/post/PostHeader';
import TableOfContents from '../../src/components/post/TableOfContents';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from './StoryDocs';

const siteMetadata = {
  'locale': 'en-GB'
};

const seriesPosts = [
  { 'order': 1, 'series': 'A Semantic Web series', 'slug': 'knowledge-graphs-introduction', 'title': 'An Introduction to Knowledge Graphs' },
  { 'order': 2, 'series': 'A Semantic Web series', 'slug': 'rdf-and-linked-data', 'title': 'RDF and Linked Data foundations' },
  { 'order': 3, 'series': 'A Semantic Web series', 'slug': 'reasoning-over-graphs', 'title': 'Reasoning over graph-shaped context' }
];

const frontMatter = {
  'category': 'data',
  'date': '2024-11-29',
  'readingTime': { 'text': '35 min read' },
  'seriesPosts': seriesPosts,
  'slug': 'knowledge-graphs-introduction',
  'subtitle': 'A comprehensive guide to knowledge graphs and their applications.',
  'tableOfContents': true,
  'tags': [ 'Semantic Web', 'Knowledge Graphs', 'Linked Data' ],
  'title': 'An Introduction to Knowledge Graphs'
};

const toc = [
  {
    'children': [
      { 'children': [], 'depth': 2, 'id': 'why-graphs', 'url': '#why-graphs', 'value': 'Why graph-shaped context matters' },
      { 'children': [], 'depth': 2, 'id': 'modeling', 'url': '#modeling', 'value': 'Modeling entities and relationships' }
    ],
    'depth': 1,
    'id': 'introduction',
    'url': '#introduction',
    'value': 'Introduction'
  },
  {
    'children': [
      { 'children': [], 'depth': 2, 'id': 'queries', 'url': '#queries', 'value': 'Query patterns' },
      { 'children': [], 'depth': 2, 'id': 'governance', 'url': '#governance', 'value': 'Governance and quality' }
    ],
    'depth': 1,
    'id': 'implementation',
    'url': '#implementation',
    'value': 'Implementation'
  }
];

const faqs = [
  {
    'answer': 'Use it when a post belongs to a multi-part sequence and readers need orientation without leaving the article.',
    'question': 'When should a series box appear?'
  },
  {
    'answer': 'Use a table of contents when the post is long enough that readers benefit from section-level navigation.',
    'question': 'When should a table of contents appear?'
  }
];

const ArticleSection = ({ children, eyebrow, id, title }) => (
  <section id={ id } className='scroll-mt-24 space-y-5 border-b border-gray-100 pb-8 last:border-b-0 last:pb-0 dark:border-gray-800'>
    <div className='space-y-2'>
      {eyebrow ? <Pill tone='blue' variant='subtle' size='xs' className='my-0 mr-0 normal-case tracking-normal'>{eyebrow}</Pill> : null}
      <Typography variant='heading-lg'>{title}</Typography>
    </div>
    <div className='space-y-4 text-base leading-8 text-gray-700 dark:text-gray-300'>
      {children}
    </div>
  </section>
);

const ArticleSubsection = ({ children, id, title }) => (
  <div id={ id } className='space-y-2 rounded-md bg-gray-50 p-4 dark:bg-gray-900'>
    <Typography variant='heading-sm'>{title}</Typography>
    <p>{children}</p>
  </div>
);

const ArticleBody = () => (
  <div className='not-prose space-y-8'>
    <ArticleSection id='introduction' title='Introduction' eyebrow='Reading shape'>
      <p>Knowledge graphs make relationships explicit, which helps readers and systems move through complex technical content with less ambiguity.</p>
      <Grid columns='2' gap='md'>
        <GridItem
          variant='soft'
          title='Why graph-shaped context matters'
          description='Context stays connected across a long-running article or project note.'
          icon={ <Icon name='Square3Stack3DIcon' decorative className='text-blue-600 dark:text-blue-400' /> }
        />
        <GridItem
          variant='soft'
          title='Modeling entities and relationships'
          description='Compact headings and semantic sections keep the article scan-friendly.'
          icon={ <Icon name='Cubes' decorative className='text-green-600 dark:text-green-400' /> }
        />
      </Grid>
    </ArticleSection>

    <ArticleSection id='implementation' title='Implementation' eyebrow='Composition'>
      <p>The article template composes header metadata, tags, series navigation, supporting banners, and the table of contents without bespoke page CSS.</p>
      <div className='grid gap-4 md:grid-cols-2'>
        <ArticleSubsection id='queries' title='Query patterns'>
          Examples should demonstrate the actual content shape used in the blog, including headings, paragraphs, metadata, and supporting references.
        </ArticleSubsection>
        <ArticleSubsection id='governance' title='Governance and quality'>
          Design-system docs and examples should keep accessibility, token usage, and reusable component boundaries visible.
        </ArticleSubsection>
      </div>
    </ArticleSection>
  </div>
);

const ContentsToggle = ({ isOpen, onToggle }) => (
  <Button
    variant='subtle'
    tone='gray'
    size='sm'
    aria-expanded={ isOpen }
    aria-label={ `${isOpen ? 'Hide' : 'Show'} table of contents` }
    aria-pressed={ isOpen }
    className='gap-1.5 rounded-sm py-0.5 text-sm font-medium'
    onClick={ onToggle }
  >
    <Icon name='List' size='xs' decorative className='text-gray-400' />
    <span>{isOpen ? 'Hide contents' : 'Show contents'}</span>
  </Button>
);

const FullArticle = () => {
  const [ isTocOpen, setIsTocOpen ] = useState(true);

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950'>
      <main>
        <PostHeader
          frontMatter={ frontMatter }
          siteMetadata={ siteMetadata }
          toc={ toc }
          tocControl={ <ContentsToggle isOpen={ isTocOpen } onToggle={ () => setIsTocOpen((current) => !current) } /> }
          className='pt-0'
        />
        <ArticleContentLayout
          aside={ <TableOfContents toc={ toc } /> }
          asideOpen={ isTocOpen }
          collapsibleAside
          contentClassName='not-prose space-y-10'
          hasAside
          padding='md'
          showAsideToggleControl={ false }
        >
          <Banner tone='blue' variant='soft'>This article is part of a series and includes an in-page table of contents.</Banner>
          <ArticleBody />
          <Faq questions={ faqs } />
        </ArticleContentLayout>
      </main>
    </div>
  );
};

const WithoutToc = () => (
  <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950'>
    <PostHeader
      frontMatter={{ ...frontMatter, 'seriesPosts': undefined, 'tableOfContents': false, 'title': 'Project notes for engineering work' }}
      siteMetadata={ siteMetadata }
      toc={ [] }
      className='pt-0'
    />
    <div className='mt-8'>
      <ArticleBody />
    </div>
  </div>
);

const SeriesOnly = () => (
  <div className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950'>
    <PostHeader
      frontMatter={{ ...frontMatter, 'subtitle': 'A focused composition where the series navigation is the primary article aid.', 'tableOfContents': false }}
      siteMetadata={ siteMetadata }
      toc={ [] }
      className='pt-0'
    />
  </div>
);

const ContentCards = () => (
  <div className='grid gap-4 md:grid-cols-3'>
    {[ 'Header and metadata', 'Series navigation', 'Table of contents' ].map((title) => (
      <Card key={ title } variant='outline'>
        <Typography variant='heading-sm'>{title}</Typography>
        <p className='mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300'>A reusable article content block should compose with documented Gaudi components and no page-only styling.</p>
      </Card>
    ))}
  </div>
);

const ContentVariants = () => (
  <Grid columns='4' gap='md'>
    <GridItem variant='soft' title='Full Article' description='Header, metadata, tags, series, article body, FAQ, and TOC.' icon={ <Icon name='BookOpen' decorative className='text-blue-600 dark:text-blue-400' /> } />
    <GridItem variant='soft' title='No TOC' description='Shorter articles keep the same header and body rhythm without an aside.' icon={ <Icon name='FileText' decorative className='text-gray-600 dark:text-gray-400' /> } />
    <GridItem variant='soft' title='Series Only' description='Use when sequence navigation matters more than section navigation.' icon={ <Icon name='Square3Stack3DIcon' decorative className='text-indigo-600 dark:text-indigo-400' /> } />
    <GridItem variant='soft' title='Composable Parts' description='Public primitives can be combined without page-specific CSS.' icon={ <Icon name='Grid' decorative className='text-green-600 dark:text-green-400' /> } />
  </Grid>
);

const usageCode = `import {
  ArticleContentLayout,
  PostHeader,
  TableOfContents,
} from '@gaudi/design-system';

<PostHeader frontMatter={frontMatter} toc={toc} />
<ArticleContentLayout
  aside={<TableOfContents toc={toc} />}
  asideOpen={isTocOpen}
  collapsibleAside
  hasAside
>
  {children}
</ArticleContentLayout>`;

const variantRows = [
  [ 'Full Article', 'Long-form posts with sections and series context.', 'Header, body, series, FAQ, and TOC appear together.' ],
  [ 'No TOC', 'Short posts and project notes.', 'Keep the reading column; remove the aside.' ],
  [ 'Series Only', 'Sequential content without long section navigation.', 'Series orientation remains, TOC does not.' ],
  [ 'Composable Parts', 'Docs and design reviews.', 'Show which primitives make up the article shell.' ]
];

const variantCode = {
  'full': `<PostHeader frontMatter={frontMatter} toc={toc} />
<ArticleContentLayout
  aside={<TableOfContents toc={toc} />}
  asideOpen={isTocOpen}
  collapsibleAside
  hasAside
>
  <Banner tone='blue' variant='soft'>Series context.</Banner>
  <ArticleBody />
  <Faq questions={faqs} />
</ArticleContentLayout>`,
  'noToc': `<PostHeader
  frontMatter={{ ...frontMatter, tableOfContents: false }}
  toc={[]}
/>
<main className='mt-8'>
  <ArticleBody />
</main>`,
  'parts': `<div className='grid gap-4 md:grid-cols-3'>
  {['Header and metadata', 'Series navigation', 'Table of contents'].map((title) => (
    <Card key={title} variant='outline'>
      <Typography variant='heading-sm'>{title}</Typography>
      <p>Document the article primitive and its responsibility.</p>
    </Card>
  ))}
</div>`,
  'series': `<PostHeader
  frontMatter={{
    ...frontMatter,
    tableOfContents: false,
    subtitle: 'Series navigation is the primary article aid.',
  }}
  toc={[]}
/>`
};

const VariantTable = () => (
  <Table>
    <thead>
      <tr><Th>Variant</Th><Th>Use</Th><Th>Composition</Th></tr>
    </thead>
    <tbody>
      {variantRows.map(([ variant, use, composition ]) => (
        <tr key={ variant }><Td>{variant}</Td><Td>{use}</Td><Td>{composition}</Td></tr>
      ))}
    </tbody>
  </Table>
);

export default {
  parameters: pageParameters,
  title: 'Blocks/Blog Content Sections'
};

export const Default = {
  'name': 'Overview',
  'render': () => (
    <Page
      title='Blog Content Sections'
      intro='Article-content compositions showing the post header with and without series navigation, table of contents, banners, FAQs, and content sections.'
    >
      <Section title='Usage' description='These article-content recipes are assembled from exported Post and Layout primitives. The consuming page supplies content, TOC data, and open state.'>
        <CodeBlock code={ usageCode } />
      </Section>
      <Section title='Variant Rules' description='Use the same article shell and only remove aids that are not useful for the content length.'>
        <VariantTable />
      </Section>
      <Section title='Available Variants' description='The content-section shapes currently supported for article pages.'>
        <ContentVariants />
      </Section>
      <Section title='Full Article Composition' description='Post header, series box, article body, FAQ, and table of contents.'>
        <div data-docs-example><FullArticle /></div>
        <CodeBlock code={ variantCode.full } />
      </Section>
      <Section title='Without Table Of Contents' description='Use for shorter posts where a TOC would add noise.'>
        <div data-docs-example><WithoutToc /></div>
        <CodeBlock code={ variantCode.noToc } />
      </Section>
      <Section title='Series Box Only' description='Use when the article is part of a sequence but does not need a TOC.'>
        <div data-docs-example><SeriesOnly /></div>
        <CodeBlock code={ variantCode.series } />
      </Section>
      <Section title='Composition Parts' description='Concise map of the public primitives used by these long-form article recipes.'>
        <div data-docs-example><ContentCards /></div>
        <CodeBlock code={ variantCode.parts } />
      </Section>
      <Section title='Implementation Notes' description='Keep article pages on the design-system contract.'>
        <ul className='grid gap-2 text-sm leading-7 text-gray-600 dark:text-gray-300'>
          <li><InlineCode>PostHeader</InlineCode> owns title, metadata, tags, and series context.</li>
          <li><InlineCode>ArticleContentLayout</InlineCode> owns the reading column and optional side rail.</li>
          <li><InlineCode>TableOfContents</InlineCode> receives structured TOC data; do not hard-code aside links.</li>
        </ul>
      </Section>
    </Page>
  )
};
