import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import formatDate from '../../../utilities/formatDate';
import Post from './index';

const docs = getComponentDocs('Post/Post');
const locales = ['en-US', 'en-GB', 'de-DE', 'ja-JP'];
const frontMatter = {
  category: 'engineering',
  date: '2026-09-24',
  slug: 'design-systems',
  subtitle: 'How component ownership keeps a blog interface consistent.',
  title: 'Design systems keep editorial rhythm predictable',
  type: 'Post'
};
// The featured entry follows the `frontMatter` control; its neighbours show a draft thought and a post without a summary.
const neighbours = [
  {
    category: 'process',
    date: '2026-09-18',
    draft: true,
    slug: 'component-contracts',
    subtitle: 'Contract tests should protect behaviour consumers can observe.',
    title: 'A short thought about contracts',
    type: 'Thought'
  },
  {
    category: 'research',
    date: '2026-08-30',
    slug: 'useful-research-questions',
    title: 'The shape of a useful research question',
    type: 'Post'
  }
];
const baseUrl = (entry) => (entry.type === 'Thought' ? '/thoughts' : '/blog');

export default {
  title: 'Post/Post',
  component: Post,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { frontMatter: 'object', locale: locales }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { frontMatter, locale: 'en-US' },
  parameters: {
    docs: {
      description: { story: "A post index: the first entry follows `frontMatter`, followed by a draft thought (`type: 'Thought'` routes under /thoughts and `draft` adds the badge) and a post without a subtitle. `locale` reformats every date." },
      source: playgroundSource('Post', {
        imports: "import { Post } from '@gaudi/design-system';",
        before: '<ul>\n',
        after: '\n</ul>'
      })
    }
  },
  render: ({ frontMatter: featured, locale }) => (
    <ul>
      {[featured, ...neighbours].map((entry) => <Post key={entry.slug} frontMatter={entry} locale={locale} />)}
    </ul>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const entries = [args.frontMatter, ...neighbours];
    await expect(canvas.getAllByRole('article')).toHaveLength(entries.length);
    for (const entry of entries) {
      const article = within(canvas.getByRole('link', { name: entry.title }).closest('article'));
      await expect(article.getByRole('link', { name: entry.title })).toHaveAttribute('href', `${baseUrl(entry)}/${entry.slug}`);
      await expect(article.getByRole('link', { name: entry.category })).toHaveAttribute('href', `/blog/categories/${entry.category}`);
      await expect(article.getByText(formatDate(entry.date, args.locale))).toHaveAttribute('dateTime', entry.date);
      if (entry.subtitle) await expect(article.getByText(entry.subtitle)).toBeVisible();
      await expect(Boolean(article.queryByText('Draft'))).toBe(Boolean(entry.draft));
    }
  }
};
