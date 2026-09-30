import { Page, pageParameters, Section } from '../../../.storybook/stories/StoryDocs';

import Breadcrumb from '../core/Breadcrumb';
import PostHeader, { PostTimestamps } from './PostHeader';
import PostNavigation from './PostNavigation';
import PostSharing from './PostSharing';

const siteMetadata = {
  'github': 'https://github.com/ahmadassaf/blog',
  'locale': 'en-GB',
  'postsRepo': 'https://github.com/ahmadassaf/blog-posts',
  'siteUrl': 'https://ahmadassaf.com'
};

const series = [
  { 'order': 1, 'series': 'Design Systems', 'slug': 'foundations', title: 'Foundations' },
  { 'order': 2, 'series': 'Design Systems', 'slug': 'components', title: 'Components' },
  { 'order': 3, 'series': 'Design Systems', 'slug': 'documentation', title: 'Documentation' }
];

const frontMatter = {
  'category': 'engineering',
  'date': '2026-05-20',
  'externalLink': 'engineering/design-systems',
  'fileName': 'design-systems.mdx',
  'readingTime': { 'text': '6 min read' },
  'seriesPosts': series,
  'slug': 'components',
  'subtitle': 'A practical structure for local package-driven UI.',
  'tableOfContents': true,
  tags: [ 'design systems', 'react', 'storybook' ],
  title: 'Building a Complete Blog Design System'
};


export default {
  id: 'post-overview',
  parameters: pageParameters,
  tags: [ '!autodocs' ],
  title: 'Post'
};

export const Default = {
  name: 'Overview',
  'render': () => (
    <Page
      title='Post'
      intro='Post components compose article identity, chronology, wayfinding, sharing, series context, and supporting editorial notes.'
    >
      <Section title='Article Header' description='Start with the article identity, publication metadata, reading time, and table-of-contents context.'>
        <div className='max-w-5xl'>
          <PostHeader frontMatter={ frontMatter } siteMetadata={ siteMetadata } titleLevel={ 3 } />
        </div>
      </Section>

      <Section title='Navigation And Sharing' description='Keep wayfinding and sharing actions adjacent to the article without competing with its content.'>
        <div className='max-w-4xl space-y-8'>
          <Breadcrumb items={ [
            { 'href': '/', 'label': 'Home' },
            { 'href': '/blog', 'label': 'Blog' },
            { 'current': true, 'href': '/blog/design-system', 'label': 'Design System' }
          ] } />
          <PostTimestamps date='2026-05-20' locale='en-GB' readingTime='6 min read' />
          <PostSharing
            siteMetadata={ siteMetadata }
            slug='design-system'
            title='Building a Complete Blog Design System'
            tags={ [ 'design systems', 'react' ] }
            externalLink='engineering/design-system'
          />
          <PostNavigation
            headingLevel={ 3 }
            prev={{ 'slug': 'previous-post', title: 'Previous post title' }}
            next={{ 'slug': 'next-post', title: 'Next post title' }}
          />
        </div>
      </Section>
    </Page>
  )
};
