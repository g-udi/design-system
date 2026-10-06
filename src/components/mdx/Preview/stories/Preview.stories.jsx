import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Preview, { PreviewLoadingSkeleton } from '../Preview';
import { aurora } from '../../../../docs/fixtures/site/artwork';

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
      image: aurora,
      type: 'website',
      readingTime: '4 min read'
    },
    showImage: true,
    defaultOpen: true
  },
  parameters: {
    docs: {
      description: { story: 'A paragraph with the three link kinds the pipeline generates: an external link with a hover card, an internal post link whose card shows post metadata, and a link flagged as unavailable. The external link follows the controls.' },
      source: playgroundSource('Preview', {
        imports: "import { Preview } from '@gaudi/design-system/mdx';",
        attributes: [`url='${url}'`]
      })
    }
  },
  render: (args) => (
    // An open hover card drops below its link, so the preview reserves room for it inside the canvas.
    <div className={args.defaultOpen && args.showImage ? 'pb-[19.5rem]' : undefined}>
      <p className='text-base leading-7 text-text'>
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
    if (args.defaultOpen && args.showImage) await waitFor(() => expect(screen.getByText(args.previewData.description)).toBeVisible());
    else await expect(card()).not.toBeInTheDocument();
    await expect(await link(canvasElement, 'the old archive (link may be unavailable)')).toHaveClass('text-danger');
    // The internal link opens a card with the post's metadata from previewData.
    const internal = await link(canvasElement, 'the Gaudi post - Internal');
    await expect(internal).toHaveAttribute('href', '/blog/engineering/gaudi-my-bash-framework');
    await expect(internal.closest('[data-preview-internal="true"]')).toBeInTheDocument();
    await userEvent.hover(internal);
    // The card fades in, so wait for it to settle.
    for (const text of [internalPost.description, 'June 5, 2026', 'tooling']) await waitFor(() => expect(screen.getByText(text)).toBeVisible());
  }
};

export const States = {
  parameters: { docs: { description: { story: 'Loading, unavailable, and blocked links: the skeleton holds the inline space while metadata loads, a 400, 404, or 410 flags the link, and other failures such as a 429 keep a normal link.' } } },
  render: () => (
    <dl className='grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 text-sm'>
      <dt className='text-text-muted'>Loading</dt>
      <dd><PreviewLoadingSkeleton /></dd>
      <dt className='text-text-muted'>404</dt>
      <dd><Preview url='https://this-link-will-not-work.invalid' title='Unavailable link' showImage={false} previewData={unavailable(404)} /></dd>
      <dt className='text-text-muted'>429</dt>
      <dd><Preview url='https://www.igi-global.com/article/example' title='Published article' showImage={false} previewData={unavailable(429)} /></dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('dd [aria-hidden="true"]');
    await expect(skeleton.querySelectorAll('.animate-pulse')).toHaveLength(2);
    await expect(await link(canvasElement, 'Unavailable link (link may be unavailable)')).toHaveClass('text-danger');
    await expect(await link(canvasElement, 'Published article')).not.toHaveClass('text-danger');
  }
};
