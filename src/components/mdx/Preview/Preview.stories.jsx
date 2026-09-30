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
  argTypes: docsArgTypes(docs, { previewData: 'object', showImage: 'boolean', defaultOpen: 'boolean' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

const url = 'https://assaf.website';
const internalPost = {
  title: 'Gaudi, my bash framework',
  siteName: 'Internal',
  type: 'internal',
  description: 'How a small core and lazily loaded modules keep a new shell fast.',
  publishedTime: '2026-06-05',
  readingTime: '8 min read',
  category: 'engineering',
  tags: ['bash', 'tooling']
};

export const Playground = {
  args: {
    previewData: {
      title: 'assaf.website',
      siteName: 'assaf.website',
      description: 'Personal website and writing archive for Ahmad Assaf.',
      favicon: '/static/favicons/favicon-32x32.png',
      image: '/static/images/og-card.jpg',
      type: 'website',
      readingTime: '4 min read'
    },
    showImage: true,
    defaultOpen: true
  },
  parameters: {
    docs: {
      description: { story: 'A paragraph with the three link kinds the pipeline generates: an external link with a hover card, an internal post link, and a link flagged as unavailable. The external link follows the controls.' },
      source: playgroundSource('Preview', {
        imports: "import { Preview } from '@gaudi/design-system/mdx';",
        attributes: [`url='${url}'`]
      })
    }
  },
  render: (args) => (
    // An open hover card drops below its link, so the preview reserves room for it inside the canvas.
    <div className={args.defaultOpen && args.showImage ? 'pb-[19.5rem]' : undefined}>
      <p className='text-base leading-7 text-gray-700 dark:text-gray-300'>
        The tooling write-up lives in <Preview internal url='/blog/engineering/gaudi-my-bash-framework' title='the Gaudi post' previewData={internalPost} />,
        and the old mirror at <Preview url='https://this-link-will-not-work.invalid' title='the old archive' showImage={false} previewData={unavailable(404)} /> is
        gone. Everything else is on <Preview key={String(args.defaultOpen)} url={url} {...args} />.
      </p>
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const external = await link(canvasElement, `${args.previewData.title} - ${args.previewData.siteName}`);
    await expect(external).toHaveAttribute('href', url);
    const card = () => screen.queryByText(args.previewData.description);
    if (args.defaultOpen && args.showImage) await expect(await screen.findByText(args.previewData.description)).toBeVisible();
    else await expect(card()).not.toBeInTheDocument();
    await expect(await link(canvasElement, 'the Gaudi post - Internal')).toHaveAttribute('href', '/blog/engineering/gaudi-my-bash-framework');
    await expect(await link(canvasElement, 'the old archive (link may be unavailable)')).toHaveClass('text-red-700');
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
