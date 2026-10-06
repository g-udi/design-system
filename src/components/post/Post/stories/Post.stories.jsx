import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import formatDate from '../../../../utilities/formatDate';
import Post from '../index';

const docs = getComponentDocs('Post/Post');
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
