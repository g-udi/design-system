import { Page, pageParameters, Section } from '../../../docs/components/StoryDocs';

import Breadcrumb from '../../core/Breadcrumb';
import Typography from '../../../foundations/Typography';
import PostHeader from '../PostHeader';
import PostNavigation from '../PostNavigation';
import { ArticleActions } from '../PostHeader/stories/fixtures/ArticleActions.jsx';

const siteMetadata = {
  'github': 'https://github.com/ahmadassaf/blog',
  'locale': 'en-GB',
  'postsRepo': 'https://github.com/ahmadassaf/blog-posts',
  'siteUrl': 'https://ahmadassaf.com'
};

const frontMatter = {
  'category': { id: 'engineering', label: 'engineering', href: '/topics/engineering' },
  'date': '2026-05-20',
  'externalLink': 'engineering/design-systems',
  'readingTime': { 'text': '6 min read' },
  'seriesPosts': [
    { 'order': 1, 'series': 'Design Systems', 'id': 'foundations', 'href': '/articles/foundations', 'title': 'Foundations' },
    { 'order': 2, 'series': 'Design Systems', 'id': 'components', 'href': '/articles/components', 'title': 'Building a Complete Blog Design System' },
    { 'order': 3, 'series': 'Design Systems', 'id': 'documentation', 'href': '/articles/documentation', 'title': 'Documentation' }
  ],
  'id': 'components', 'href': '/articles/components',
  'subtitle': 'A practical structure for local package-driven UI.',
  'tags': [ { id: 'ds', label: 'design systems', href: '/topics/design-systems' }, { id: 'react', label: 'react', href: '/topics/react' }, { id: 'storybook', label: 'storybook', href: '/topics/storybook' } ],
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
            { 'current': true, 'href': frontMatter.href, 'label': frontMatter.title }
          ] } />
          <PostHeader frontMatter={ frontMatter } siteMetadata={ siteMetadata } titleLevel={ 3 } classNames={{ 'root': 'pt-0' }} />
          <Typography variant='paragraph-md'>
            A design system earns its keep when the next article looks like it belongs with the last one. Ownership, contracts, and documentation keep that promise as the blog grows.
          </Typography>
          <ArticleActions />
          <PostNavigation
            headingLevel={ 4 }
            prev={{ 'id': 'foundations', 'href': '/articles/foundations', 'title': 'Foundations' }}
            next={{ 'id': 'documentation', 'href': '/articles/documentation', 'title': 'Documentation' }}
          />
        </article>
      </Section>
    </Page>
  )
};
