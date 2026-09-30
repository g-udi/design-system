import Card from '../../src/components/core/Card';
import Link from '../../src/components/core/Link';
import Pill from '../../src/components/core/Pill';
import Post from '../../src/components/post/Post';
import { PostTimestamps } from '../../src/components/post/PostHeader/PostHeader';
import { categoryHref, tagHref } from '../../src/utilities/taxonomy';
import Typography from '../../src/foundations/Typography';

import { CodeBlock, InlineCode, Page, pageParameters, Section, Table, Td, Th } from './StoryDocs';

const posts = [
  {
    'category': 'data',
    'date': '2024-11-29',
    'readingTime': { 'text': '35 min read' },
    'slug': 'knowledge-graphs-introduction',
    'subtitle': 'A comprehensive guide to knowledge graphs and their applications.',
    'tags': [ 'Semantic Web', 'Knowledge Graphs', 'Linked Data' ],
    'title': 'An Introduction to Knowledge Graphs',
    'type': 'Post'
  },
  {
    'category': 'engineering',
    'date': '2026-05-20',
    'readingTime': { 'text': '8 min read' },
    'slug': 'design-systems-editorial-rhythm',
    'subtitle': 'Reusable tokens and components make article templates easier to maintain.',
    'tags': [ 'Design Systems', 'Components' ],
    'title': 'Design systems keep editorial rhythm predictable',
    'type': 'Post'
  },
  {
    'category': 'productivity',
    'date': '2026-01-14',
    'readingTime': { 'text': '6 min read' },
    'slug': 'notes-for-focused-work',
    'subtitle': 'A practical pattern for collecting decisions and keeping context close.',
    'tags': [ 'Notes', 'Workflows' ],
    'title': 'Project notes for engineering work',
    'type': 'Post'
  }
];

const postHref = (post) => `/blog/${post.slug}`;

const FeaturedBlog = () => {
  const [ featured, ...rest ] = posts;

  return (
    <div className='grid gap-6 lg:grid-cols-[1.35fr_1fr]'>
      <Card variant='outline' padding='lg'>
        <Pill href={ categoryHref(featured.category) } tone='green' variant='soft' size='sm' className='m-0 capitalize'>{featured.category}</Pill>
        <Typography as='h3' variant='heading-xl' className='mt-4'>
          <Link href={ postHref(featured) } variant='bare' className='hover:text-accent'>{featured.title}</Link>
        </Typography>
        <p className='mt-4 max-w-2xl text-lg leading-8 text-text-muted'>{featured.subtitle}</p>
        <PostTimestamps date={ featured.date } locale='en-US' readingTime={ featured.readingTime.text } className='mt-5 text-sm' />
        <div className='mt-6 flex flex-wrap gap-2'>
          {featured.tags.map((tag) => <Pill key={ tag } href={ tagHref(tag) } tone='gray' variant='soft' size='sm' className='m-0'>{tag}</Pill>)}
        </div>
      </Card>
      <div className='grid content-start gap-4'>
        {rest.map((post) => <PostCard key={ post.slug } post={ post } />)}
      </div>
    </div>
  );
};

const PostCard = ({ post, showReadingTime = false }) => (
  <Card variant='outline' interactive className='h-auto'>
    <div className='flex items-center justify-between gap-3'>
      <Pill tone='blue' variant='soft' size='xs' className='m-0 capitalize'>{post.category}</Pill>
      {showReadingTime ? <span className='text-xs text-text-muted'>{post.readingTime.text}</span> : null}
    </div>
    <Typography as='h3' variant='heading-sm' className='mt-3'>
      <Link href={ postHref(post) } variant='bare' className='hover:text-accent'>{post.title}</Link>
    </Typography>
    <p className='mt-2 text-sm leading-6 text-text-muted'>{post.subtitle}</p>
  </Card>
);

const ListBlog = () => (
  <Card variant='outline' padding='none' className='px-5'>
    <ul>
      {posts.map((post) => <Post key={ post.slug } frontMatter={ post } />)}
    </ul>
  </Card>
);

const CardBlog = () => (
  <div className='grid gap-4 md:grid-cols-3'>
    {posts.map((post) => <PostCard key={ post.slug } post={ post } showReadingTime />)}
  </div>
);

const ArchiveBlog = () => (
  <Card variant='outline' padding='none'>
    <ul>
      {posts.map((post) => (
        <li key={ post.slug } className='border-b border-border last:border-b-0'>
          <Link href={ postHref(post) } variant='bare' className='grid gap-3 p-4 hover:bg-surface-muted md:grid-cols-[8rem_1fr_auto]'>
            <time dateTime={ post.date } className='text-xs font-semibold uppercase text-text-muted'>{post.date.slice(0, 4)}</time>
            <span className='text-sm font-semibold text-text'>{post.title}</span>
            <span className='text-xs capitalize text-text-muted'>{post.category}</span>
          </Link>
        </li>
      ))}
    </ul>
  </Card>
);

const usageCode = `import { Post, Typography } from '@gaudi/design-system';

const [featuredPost, ...posts] = sortedPosts;

<section aria-labelledby='featured-posts'>
  <Typography id='featured-posts' variant='heading-lg' as='h2'>
    Featured posts
  </Typography>
  <ul>
    {[featuredPost, ...posts].map((post) => <Post key={post.slug} frontMatter={post} />)}
  </ul>
</section>`;

const variantRows = [
  [ 'Featured Lead', 'Blog home, category landing, editorial index.', 'One article needs to anchor the page before secondary posts.' ],
  [ 'Current Blog List', 'Production blog lists.', 'Use the shared Post preview instead of recreating post metadata.' ],
  [ 'Card Grid', 'Browsing pages with short summaries.', 'Use when summaries need clear visual separation.' ],
  [ 'Archive Rows', 'Dense category, tag, or year pages.', 'Use when scan speed matters more than summary copy.' ]
];

const variantCode = {
  'archive': `<Card variant='outline' padding='none'>
  <ul>
    {posts.map((post) => (
      <li key={post.slug} className='border-b border-border last:border-b-0'>
        <Link href={\`/blog/\${post.slug}\`} variant='bare' className='grid gap-3 p-4 hover:bg-surface-muted md:grid-cols-[8rem_1fr_auto]'>
          <time dateTime={post.date}>{post.date.slice(0, 4)}</time>
          <span>{post.title}</span>
          <span>{post.category}</span>
        </Link>
      </li>
    ))}
  </ul>
</Card>`,
  'cards': `<div className='grid gap-4 md:grid-cols-3'>
  {posts.map((post) => (
    <Card key={post.slug} variant='outline' interactive>
      <Pill tone='blue' variant='soft' size='xs'>{post.category}</Pill>
      <Typography as='h3' variant='heading-sm'>
        <Link href={\`/blog/\${post.slug}\`} variant='bare'>{post.title}</Link>
      </Typography>
      <p className='text-sm text-text-muted'>{post.subtitle}</p>
    </Card>
  ))}
</div>`,
  'featured': `const [featured, ...rest] = posts;

<div className='grid gap-6 lg:grid-cols-[1.35fr_1fr]'>
  <Card variant='outline' padding='lg'>
    <Pill tone='green' variant='soft' size='sm'>{featured.category}</Pill>
    <Typography as='h3' variant='heading-xl'>
      <Link href={\`/blog/\${featured.slug}\`} variant='bare'>{featured.title}</Link>
    </Typography>
    <PostTimestamps date={featured.date} readingTime={featured.readingTime.text} />
  </Card>
  {rest.map((post) => <PostCard key={post.slug} post={post} />)}
</div>`,
  'list': `<Card variant='outline' padding='none' className='px-5'>
  <ul>
    {posts.map((post) => <Post key={post.slug} frontMatter={post} />)}
  </ul>
</Card>`
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
  title: 'Blocks/Blog Sections'
};

export const Default = {
  'name': 'Overview',
  'render': () => (
    <Page
      title='Blog Sections'
      intro='Reference recipes for blog listings that match the current editorial system: feature lead, compact list, cards, and archive treatments.'
    >
      <Section title='Usage' description='These are reference page recipes, not package block exports. Compose them from the exported Post and Card primitives and pass real content records from the app.'>
        <CodeBlock code={ usageCode } />
      </Section>
      <Section title='Variant Rules' description='Choose the layout from reading intent, not decoration.'>
        <VariantTable />
      </Section>
      <Section title='Featured Lead' description='Use for index pages where one article should lead the page.'>
        <FeaturedBlog />
        <CodeBlock code={ variantCode.featured } />
      </Section>
      <Section title='Current Blog List' description='Uses the actual Post preview component.'>
        <ListBlog />
        <CodeBlock code={ variantCode.list } />
      </Section>
      <Section title='Card Grid' description='Use when posts need stronger visual separation.'>
        <CardBlog />
        <CodeBlock code={ variantCode.cards } />
      </Section>
      <Section title='Archive Rows' description='Use for dense category, tag, or year archive pages.'>
        <ArchiveBlog />
        <CodeBlock code={ variantCode.archive } />
      </Section>
      <Section title='Implementation Notes' description='These examples should stay aligned with the blog production model.'>
        <ul className='grid gap-2 text-sm leading-7 text-text-muted'>
          <li>Use <InlineCode>Post</InlineCode> for the current list treatment.</li>
          <li>Use <InlineCode>Pill</InlineCode> for categories and tags; avoid local badge CSS.</li>
          <li>Keep titles as real headings and wrap only the interactive text in links.</li>
        </ul>
      </Section>
    </Page>
  )
};
