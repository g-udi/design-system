import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import formatDate from '../../../../utilities/formatDate';
import Post from '../index';
import { BlogPostLists } from './fixtures/BlogPostLists';
import listsSource from './fixtures/BlogPostLists.jsx?raw';
import listsStyles from './fixtures/BlogPostLists.css?raw';
import blogPostsSource from '../../../../docs/fixtures/site/blogPosts.js?raw';

const docs = getComponentDocs('Blocks/Blog/Post lists');
const locales = ['en-US', 'en-GB', 'de-DE', 'ja-JP'];
const frontMatter = {
  category: { id: 'engineering', label: 'engineering', href: '/topics/engineering' },
  date: '2026-09-24',
  id: 'design-systems', href: '/articles/design-systems',
  subtitle: 'How component ownership keeps a blog interface consistent.',
  title: 'Design systems keep editorial rhythm predictable',
  type: 'Post'
};
// The featured entry follows the `frontMatter` control; its neighbours show a draft thought and a post without a summary.
const neighbours = [
  {
    category: { id: 'process', label: 'process', href: '/topics/process' },
    date: '2026-09-18',
    draft: true,
    id: 'component-contracts', href: '/articles/component-contracts',
    subtitle: 'Contract tests should protect behaviour consumers can observe.',
    title: 'A short thought about contracts',
    type: 'Thought'
  },
  {
    category: { id: 'research', label: 'research', href: '/topics/research' },
    date: '2026-08-30',
    id: 'useful-research-questions', href: '/articles/useful-research-questions',
    title: 'The shape of a useful research question',
    type: 'Post'
  }
];

export default {
  id: 'post-post',
  title: 'Blocks/Blog/Post lists',
  component: Post,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { frontMatter: 'object', locale: locales }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => ImageCards })
    }
  },
  // The metadata example supplies its own narrow frame; section examples fill the canvas.
};

export const Playground = {
  name: 'Post metadata',
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>],
  args: { frontMatter, locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: "A post index: the first entry follows `frontMatter`, followed by a draft thought (the host supplies its destination and `draft` adds the badge) and a post without a subtitle. `locale` reformats every date." },
      source: playgroundSource('Post', {
        imports: "import { Post } from '@gaudi/design-system';",
        before: '<ul>\n',
        after: '\n</ul>'
      })
    }
  },
  render: ({ frontMatter: featured, locale }) => (
    <ul>
      {[featured, ...neighbours].map((entry) => <Post key={entry.id} frontMatter={entry} locale={locale} />)}
    </ul>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const entries = [args.frontMatter, ...neighbours];
    await expect(canvas.getAllByRole('article')).toHaveLength(entries.length);
    for (const entry of entries) {
      const article = within(canvas.getByRole('link', { name: entry.title }).closest('article'));
      await expect(article.getByRole('link', { name: entry.title })).toHaveAttribute('href', entry.href);
      await expect(article.getByRole('link', { name: entry.category.label })).toHaveAttribute('href', entry.category.href);
      await expect(article.getByText(formatDate(entry.date, args.locale))).toHaveAttribute('dateTime', entry.date);
      if (entry.subtitle) await expect(article.getByText(entry.subtitle)).toBeVisible();
      await expect(Boolean(article.queryByText('Draft'))).toBe(Boolean(entry.draft));
    }
  }
};


const source = listsSource
  .replace(/import \{ posts, preparePost \} from [^;]+;/, blogPostsSource)
  .replace("import styles from './BlogPostLists.css?raw';", `const styles = ${JSON.stringify(listsStyles)};`);
const listExample = {
  render: args => <BlogPostLists {...args} />,
  argTypes: {
    frontMatter: { control: false, table: { disable: true } },
    locale: { control: false, table: { disable: true } },
    title: { control: 'text' }, description: { control: 'text' },
    layout: { control: 'select', options: ['grid', 'featured', 'rows', 'compact'] },
    showImages: { control: 'boolean' }, showAuthor: { control: 'boolean' }
  },
  parameters: { layout: 'fullscreen', layoutAudit: { widths: [623, 624, 625, 687, 688, 689, 1071, 1072, 1073] }, visualAudit: { wide: 'Blog listings fill the section and adapt to their container.' }, docs: { source: playgroundSource('BlogPostLists', { imports: source }) } },
  play: async context => {
    const canvas = within(context.canvasElement);
    const count = context.args.layout === 'featured' ? 3 : 6;
    const list = canvas.getByRole('list', { name: 'Blog posts' });
    const search = canvas.getByRole('searchbox', { name: 'Filter articles' });
    await expect(within(list).getAllByRole('article')).toHaveLength(count);
    await expect(within(list).getByRole('link', { name: 'An Introduction to Knowledge Graphs' })).toHaveAttribute('href', '/blog/intro-knowledge-graphs');
    await userEvent.type(search, 'knowledge graphs');
    await waitFor(() => expect(within(list).getAllByRole('article')).toHaveLength(1));
    await userEvent.clear(search);
    await userEvent.type(search, 'no-matching-article');
    await expect(within(list).getByText('No articles found')).toBeVisible();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--empty` });
    }
    await userEvent.click(within(list).getByRole('button', { name: 'Clear filter' }));
    await waitFor(() => expect(within(list).getAllByRole('article')).toHaveLength(count));
    context.canvasElement.ownerDocument.activeElement?.blur();
  }
};
export const ImageCards = { ...listExample, name: 'Image cards', args: { layout: 'grid', showImages: true, showAuthor: true, title: 'From the journal', description: 'Ideas on AI, data, engineering, and the tools that make work easier.' } };
export const Featured = { ...listExample, name: 'Featured and recent', args: { ...ImageCards.args, layout: 'featured' } };
export const Horizontal = { ...listExample, name: 'Horizontal rows', args: { ...ImageCards.args, layout: 'rows' } };
export const Compact = { ...listExample, name: 'Compact list', args: { ...ImageCards.args, layout: 'compact', showImages: false } };
