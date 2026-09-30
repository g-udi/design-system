import { expect, screen, userEvent, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Preview, { PreviewLoadingSkeleton } from './Preview';

const docs = getComponentDocs('MDX/Preview');
const link = (canvasElement, name) => within(canvasElement).findByRole('link', { name });
const unavailable = (status) => ({ error: true, errorMessage: `HTTP ${status}`, status });

export default {
  title: 'MDX/Preview',
  id: 'mdx-preview',
  component: Preview,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { url: 'text', title: 'text', previewData: 'object', showImage: 'boolean', defaultOpen: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><p><Story /></p></ExampleFrame>]
};

export const Playground = {
  args: {
    url: 'https://assaf.website',
    previewData: {
      title: 'assaf.website',
      siteName: 'assaf.website',
      description: 'Personal website and writing archive for Ahmad Assaf.',
      favicon: '/static/favicons/favicon-32x32.png',
      image: '/static/images/og-card.jpg',
      type: 'website'
    },
    showImage: true,
    defaultOpen: false
  },
  parameters: { docs: { source: playgroundSource('Preview', { imports: "import { Preview } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Preview {...args} />,
  play: async ({ args, canvasElement }) => {
    const external = await link(canvasElement, `${args.previewData.title} - ${args.previewData.siteName}`);
    await expect(external).toHaveAttribute('href', args.url);
  }
};

export const Internal = {
  parameters: { docs: { description: { story: '`internal` renders a local app link with no remote fetch. Hovering shows post metadata from `previewData` in a card.' } } },
  render: () => (
    <Preview
      internal
      url='/blog'
      previewData={{
        title: 'Internal blog link',
        siteName: 'Internal',
        type: 'internal',
        description: 'Browse the latest posts, projects, and notes from the blog archive.',
        publishedTime: '2026-06-05',
        readingTime: '8 min read',
        category: 'engineering',
        tags: ['design systems', 'mdx', 'preview']
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const internal = await link(canvasElement, 'Internal blog link - Internal');
    await expect(internal).toHaveAttribute('href', '/blog');
    await expect(internal.closest('[data-preview-internal="true"]')).toBeInTheDocument();
    await userEvent.hover(internal);
    for (const text of ['Browse the latest posts, projects, and notes from the blog archive.', 'June 5, 2026', 'design systems'])
      await expect(await screen.findByText(text)).toBeVisible();
  }
};

export const Unavailable = {
  parameters: { docs: { description: { story: 'A 400, 404, or 410 flags the link as unavailable. Other failures, such as a publisher blocking metadata with 429, keep a normal link.' } } },
  render: () => (
    <span className='flex flex-col gap-2'>
      <Preview url='https://this-link-will-not-work.invalid' title='Unavailable link' showImage={false} previewData={unavailable(404)} />
      <Preview url='https://www.igi-global.com/article/example' title='Published article' showImage={false} previewData={unavailable(429)} />
    </span>
  ),
  play: async ({ canvasElement }) => {
    await expect(await link(canvasElement, 'Unavailable link (link may be unavailable)')).toHaveClass('text-red-700');
    await expect(await link(canvasElement, 'Published article')).not.toHaveClass('text-red-700');
  }
};

export const Loading = {
  parameters: { docs: { description: { story: '`PreviewLoadingSkeleton` holds the inline space while metadata loads and is hidden from assistive technology.' } } },
  render: () => <PreviewLoadingSkeleton />,
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[aria-hidden="true"]');
    await expect(skeleton.querySelectorAll('.animate-pulse')).toHaveLength(2);
    await expect(within(canvasElement).queryByRole('link')).not.toBeInTheDocument();
  }
};
