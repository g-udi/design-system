import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Button from '../../../core/Button';
import Icon from '../../../core/Icon';
import PostHeader from '../index';
import { ArticleActions, articleActions } from './fixtures/ArticleActions.jsx';
import actionsSource from './fixtures/ArticleActions.jsx?raw';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';

const docs = getComponentDocs('Blocks/Blog/PostHeader');
// A draft that sits second in a three-part series, so every header slot has something to show.
const frontMatter = {
  category: { id: 'engineering', label: 'engineering', href: '/topics/engineering' },
  date: '2026-09-24',
  draft: true,
  readingTime: { text: '8 min read' },
  id: 'design-systems', href: '/articles/design-systems',
  subtitle: 'How component ownership keeps a blog interface consistent.',
  title: 'Design systems keep editorial rhythm predictable',
  tags: [{ id: 'ds', label: 'design systems', href: '/topics/design-systems' }, { id: 'react', label: 'react', href: '/topics/react' }, { id: 'storybook', label: 'storybook', href: '/topics/storybook' }],
  seriesPosts: [
    { order: 1, series: 'Design Systems', id: 'foundations', href: '/articles/foundations', title: 'Foundations' },
    { order: 2, series: 'Design Systems', id: 'design-systems', href: '/articles/design-systems', title: 'Design systems keep editorial rhythm predictable' },
    { order: 3, series: 'Design Systems', id: 'documentation', href: '/articles/documentation', title: 'Documentation' }
  ]
};
const siteMetadata = { locale: 'en-GB' };
const dateLabel = (entry, locale) => new Date(entry.updated || entry.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

export default {
  id: 'post-postheader',
  title: 'Blocks/Blog/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { frontMatter: 'object', siteMetadata: 'object', titleVariant: ['post-title', 'title-md', 'heading-lg', 'heading-md'], subtitleVariant: ['post-subtitle', 'paragraph-md', 'paragraph-sm'] }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { frontMatter, siteMetadata, titleVariant: 'post-title', subtitleVariant: 'post-subtitle' },
  parameters: {
    docs: {
      description: { story: 'A draft article header with category, date, draft badge, tags, and its place in a series. `tocControl` adds a contents action before the reading time on wide screens. Edit `frontMatter` to drop a slot, or `siteMetadata.locale` to reformat the date.' },
      source: playgroundSource('PostHeader', {
        imports: "import { Button, Icon, PostHeader } from '@gaudi/design-system';",
        attributes: ["tocControl={<Button size='xs' variant='outline' tone='neutral'><Icon name='List' decorative size='xs' />Contents</Button>}"]
      })
    }
  },
  render: (args) => (
    <PostHeader
      {...args}
      tocControl={
        <Button size='xs' variant='outline' tone='neutral'>
          <Icon name='List' decorative size='xs' />
          Contents
        </Button>
      }
    />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const entry = args.frontMatter;
    await expect(canvas.getByRole('heading', { level: 1, name: entry.title })).toBeVisible();
    if (entry.subtitle) await expect(canvas.getByText(entry.subtitle)).toBeVisible();
    if (entry.category)
      await expect(canvas.getByRole('link', { name: entry.category.label })).toHaveAttribute('href', entry.category.href);
    await expect(canvas.getByText(dateLabel(entry, args.siteMetadata?.locale))).toBeVisible();
    await expect(Boolean(canvas.queryByText('Draft'))).toBe(Boolean(entry.draft));
    for (const tag of entry.tags || []) await expect(await canvas.findByRole('link', { name: tag.label })).toHaveAttribute('href', tag.href);
    // The contents control closes the tags row at every width.
    const contents = canvas.getByRole('button', { name: 'Contents' });
    await expect(contents).toBeVisible();
    if (entry.readingTime) {
      // Reading time shows at every width in the meta line; the contents control follows on the tags row.
      const readingTime = canvas.getByText(entry.readingTime.text);
      await expect(readingTime).toBeVisible();
      await expect(contents.compareDocumentPosition(readingTime) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    }
    if (entry.seriesPosts?.length) {
      const position = entry.seriesPosts.findIndex((post) => post.id === entry.id) + 1;
      const trigger = canvas.getByRole('button', { name: new RegExp(entry.seriesPosts[0].series, 'u') });
      await expect(canvas.getByRole('progressbar', { name: 'Series progress' })).toHaveAttribute('aria-valuenow', String(position));
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(trigger);
    }
  }
};

export const SharingActions = {
  name: 'Prepared share and source actions',
  args: { frontMatter, siteMetadata },
  parameters: {
    docs: {
      description: { story: 'The publishing app prepares share, repository and source destinations. Compose these existing Icon and Link controls around the article header; Gaudi does not choose a sharing service, repository branch or content route.' },
      source: { code: publicSource(actionsSource, new URL('./fixtures/ArticleActions.jsx', import.meta.url)), language: 'jsx' }
    }
  },
  render: (args) => <><PostHeader {...args} /><ArticleActions /></>,
  play: async ({ canvasElement }) => {
    const actions = within(within(canvasElement).getByRole('navigation', { name: 'Article actions' }));
    for (const [name, href] of [['Share post on X', articleActions.share], ['Publication repository', articleActions.repository], ['View article source', articleActions.source]]) {
      await expect(actions.getByRole('link', { name })).toHaveAttribute('href', href);
      await expect(actions.getByRole('link', { name })).toHaveAttribute('rel', 'noopener noreferrer');
    }
  }
};
