import { Page, pageParameters, Section } from '../../../.storybook/stories/StoryDocs';

import Breadcrumb from '../core/Breadcrumb';
import Typography from '../../foundations/Typography';
import PostHeader from './PostHeader';
import PostNavigation from './PostNavigation';
import PostSharing from './PostSharing';

const siteMetadata = {
  'github': 'https://github.com/ahmadassaf/blog',
  'locale': 'en-GB',
  'postsRepo': 'https://github.com/ahmadassaf/blog-posts',
  'siteUrl': 'https://ahmadassaf.com'
};

const frontMatter = {
  'category': 'engineering',
  'date': '2026-05-20',
  'externalLink': 'engineering/design-systems',
  'readingTime': { 'text': '6 min read' },
  'seriesPosts': [
    { 'order': 1, 'series': 'Design Systems', 'slug': 'foundations', 'title': 'Foundations' },
    { 'order': 2, 'series': 'Design Systems', 'slug': 'components', 'title': 'Building a Complete Blog Design System' },
    { 'order': 3, 'series': 'Design Systems', 'slug': 'documentation', 'title': 'Documentation' }
  ],
  'slug': 'components',
  'subtitle': 'A practical structure for local package-driven UI.',
  'tags': [ 'design systems', 'react', 'storybook' ],
  'title': 'Building a Complete Blog Design System'
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
      intro='Post components frame an article from top to bottom: wayfinding, the header with its series, sharing, and links to the neighbouring posts.'
    >
      <Section title='Article Chrome' description='Every post component in reading order around a short article body.'>
        <article data-docs-example className='max-w-4xl space-y-6'>
          <Breadcrumb items={ [
            { 'href': '/', 'label': 'Home' },
            { 'href': '/blog', 'label': 'Blog' },
            { 'current': true, 'href': `/blog/${frontMatter.slug}`, 'label': frontMatter.title }
          ] } />
          <PostHeader frontMatter={ frontMatter } siteMetadata={ siteMetadata } titleLevel={ 3 } classNames={{ 'root': 'pt-0' }} />
          <Typography variant='paragraph-md'>
            A design system earns its keep when the next article looks like it belongs with the last one. Ownership, contracts, and documentation keep that promise as the blog grows.
          </Typography>
          <PostSharing
            siteMetadata={ siteMetadata }
            slug={ frontMatter.slug }
            title={ frontMatter.title }
            tags={ frontMatter.tags }
            externalLink={ frontMatter.externalLink }
          />
          <PostNavigation
            headingLevel={ 4 }
            prev={{ 'slug': 'foundations', 'title': 'Foundations' }}
            next={{ 'slug': 'documentation', 'title': 'Documentation' }}
          />
        </article>
      </Section>
    </Page>
  )
};
