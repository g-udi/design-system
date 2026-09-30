import { expect, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../../core/Button';
import Icon from '../../core/Icon';
import { tagHref } from '../../../utilities/taxonomy';
import PostHeader from './index';

const docs = getComponentDocs('Post/PostHeader');
// A draft that sits second in a three-part series, so every header slot has something to show.
const frontMatter = {
  category: 'engineering',
  date: '2026-09-24',
  draft: true,
  readingTime: { text: '8 min read' },
  slug: 'design-systems',
  subtitle: 'How component ownership keeps a blog interface consistent.',
  title: 'Design systems keep editorial rhythm predictable',
  tags: ['design systems', 'react', 'storybook'],
  seriesPosts: [
    { order: 1, series: 'Design Systems', slug: 'foundations', title: 'Foundations' },
    { order: 2, series: 'Design Systems', slug: 'design-systems', title: 'Design systems keep editorial rhythm predictable' },
    { order: 3, series: 'Design Systems', slug: 'documentation', title: 'Documentation' }
  ]
};
const siteMetadata = { locale: 'en-GB' };
const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);
const dateLabel = (entry, locale) => new Date(entry.updated || entry.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });

export default {
  title: 'Post/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { frontMatter: 'object', siteMetadata: 'object' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame wide><Story /></ExampleFrame>]
};

export const Playground = {
  args: { frontMatter, siteMetadata },
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
      await expect(canvas.getByRole('link', { name: capitalize(entry.category) })).toHaveAttribute('href', `/blog/categories/${entry.category}`);
    await expect(canvas.getByText(dateLabel(entry, args.siteMetadata?.locale))).toBeVisible();
    await expect(Boolean(canvas.queryByText('Draft'))).toBe(Boolean(entry.draft));
    for (const tag of entry.tags || []) await expect(await canvas.findByRole('link', { name: new RegExp(`^${tag}$`, 'iu') })).toHaveAttribute('href', tagHref(tag));
    const contents = canvas.getByRole('button', { name: 'Contents' });
    if (entry.readingTime) {
      const readingTime = canvas.getByText(entry.readingTime.text);
      await expect(contents.parentElement.contains(readingTime)).toBe(true);
      await expect(contents.compareDocumentPosition(readingTime) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    if (entry.seriesPosts?.length) {
      const position = entry.seriesPosts.findIndex((post) => post.slug === entry.slug) + 1;
      const trigger = canvas.getByRole('button', { name: new RegExp(entry.seriesPosts[0].series, 'u') });
      await expect(canvas.getByRole('progressbar', { name: 'Series progress' })).toHaveAttribute('aria-valuenow', String(position));
      await userEvent.click(trigger);
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      await userEvent.click(trigger);
    }
  }
};
