import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { previewSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import { linkPreviewExamples as links, linkPreviewKindNames } from '../../../../docs/fixtures/site/link-previews';
import LinkPreview, { LinkPreviewSkeleton } from '../index.js';

const docs = getComponentDocs('Core/Media & Previews/LinkPreview');
const unavailable = (status) => ({ error: true, errorMessage: `HTTP ${status}`, status });
const imports = "import { LinkPreview } from '@gaudi/design-system';";

export default {
  title: 'Core/Media & Previews/LinkPreview',
  id: 'core-linkpreview',
  component: LinkPreview,
  tags: ['autodocs'],
  argTypes: {
    kind: { control: 'select', options: linkPreviewKindNames, description: 'Story only: which sample link (and payload) to preview.', table: { category: 'Story' } },
    ...docsArgTypes(docs, { variant: ['card', 'compact', 'inline'], orientation: ['vertical', 'horizontal'], showImage: 'boolean' })
  },
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { kind: 'repository', variant: 'card', orientation: 'vertical', showImage: true },
  parameters: {
    docs: {
      description: { story: 'One link through the normaliser: pick a kind to see what rich information it earns (stars and language for a repository, channel and duration for a video, author and date for an article), then switch the variant between the card, the compact row and the inline hover link.' },
      source: {
        type: 'dynamic',
        language: 'jsx',
        transform: (_source, { args: { kind, ...args } }) => previewSource('LinkPreview', {
          url: links[kind].url,
          previewData: links[kind].previewData,
          title: args.variant === 'inline' ? links[kind].title : undefined,
          ...args
        }, { imports })
      }
    }
  },
  render: ({ kind, ...args }) => {
    const link = links[kind];
    const preview = <LinkPreview key={`${kind}-${args.variant}`} url={link.url} title={args.variant === 'inline' ? link.title : undefined} previewData={link.previewData} {...args} />;
    return args.variant === 'inline' ? <p className='text-base leading-7 text-text'>Read more in {preview}.</p> : <div className={args.orientation === 'horizontal' ? 'w-full' : 'mx-auto w-full max-w-sm'}>{preview}</div>;
  },
  play: async ({ args, canvasElement }) => {
    const link = links[args.kind];
    const anchors = within(canvasElement).getAllByRole('link');
    await expect(anchors[0]).toHaveAttribute('href', link.url);
    if (args.kind === 'repository' && args.variant === 'card') {
      await expect(within(canvasElement).getByRole('heading', { name: 'ahmadassaf/design-system' })).toBeVisible();
      await expect(within(canvasElement).getByText('1.3K stars')).toBeInTheDocument();
    }
  }
};

const inlineKinds = ['repository', 'video', 'article', 'social', 'docs', 'wikipedia', 'internal'];
const cardKinds = ['repository', 'video', 'article', 'social'];

export const LinkPreviews = {
  name: 'Link previews',
  parameters: { docs: { description: { story: 'Every kind the normaliser knows, in each variant. Hover or focus an inline link for its rich card; cards and compact rows show the same information without interaction, so they suit link lists, chat replies and source panels.' } } },
  render: () => (
    <div className='flex flex-col gap-8'>
      <section aria-labelledby='link-previews-inline' className='flex flex-col gap-2'>
        <h3 id='link-previews-inline' className='text-xs font-semibold text-text-muted'>Inline, in prose</h3>
        <p className='text-base leading-8 text-text'>
          The source is in <LinkPreview {...links.repository} />, and <LinkPreview {...links.video} /> covers the tokens. For background, start
          with <LinkPreview {...links.article} /> or the <LinkPreview {...links.wikipedia} /> article, then <LinkPreview {...links.docs} />.
          It all began with <LinkPreview {...links.social} /> and <LinkPreview {...links.internal} />.
        </p>
      </section>
      <section aria-labelledby='link-previews-cards' className='flex flex-col gap-2'>
        <h3 id='link-previews-cards' className='text-xs font-semibold text-text-muted'>Cards</h3>
        <div className='grid gap-4 sm:grid-cols-2'>
          {cardKinds.map((kind) => <LinkPreview key={kind} url={links[kind].url} previewData={links[kind].previewData} variant='card' headingLevel={4} />)}
        </div>
        <LinkPreview url={links.docs.url} previewData={links.docs.previewData} variant='card' orientation='horizontal' headingLevel={4} />
      </section>
      <section aria-labelledby='link-previews-compact' className='flex flex-col gap-2'>
        <h3 id='link-previews-compact' className='text-xs font-semibold text-text-muted'>Compact rows</h3>
        <div className='flex flex-col gap-2'>
          {['website', 'file', ...inlineKinds.slice(0, 3)].map((kind) => <LinkPreview key={kind} url={links[kind].url} previewData={links[kind].previewData} variant='compact' />)}
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // The inline link opens its rich card on hover with the repository stats from the payload.
    await userEvent.hover(canvas.getByRole('link', { name: 'Gaudi on GitHub - GitHub' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'ahmadassaf/design-system' })).toBeVisible());
    await userEvent.unhover(canvas.getByRole('link', { name: 'Gaudi on GitHub - GitHub' }));
    // Cards title-link to the destination; the video card carries its channel and length.
    await expect(canvas.getByRole('heading', { level: 4, name: 'Designing with tokens' })).toBeVisible();
    await expect(canvas.getAllByText('12:41').length).toBeGreaterThan(0);
    await expect(canvas.getByRole('link', { name: 'Linked Data Quality Assessment' })).toHaveAttribute('href', links.file.url);
  }
};

export const States = {
  parameters: { docs: { description: { story: 'Loading placeholders hold each variant’s space. A 400, 404 or 410 flags the link as possibly gone; other failures such as a 429, and apps with no preview endpoint (`endpoint={null}`), keep an ordinary link.' } } },
  render: () => (
    <dl className='grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-3 text-sm'>
      <dt className='text-text-muted'>Loading</dt>
      <dd className='flex flex-col gap-2'><LinkPreviewSkeleton /><LinkPreviewSkeleton variant='compact' /></dd>
      <dt className='text-text-muted'>404</dt>
      <dd><LinkPreview url='https://this-link-will-not-work.invalid' title='Unavailable link' previewData={unavailable(404)} /></dd>
      <dt className='text-text-muted'>429</dt>
      <dd><LinkPreview url='https://www.igi-global.com/article/example' title='Published article' previewData={unavailable(429)} variant='card' /></dd>
      <dt className='text-text-muted'>No endpoint</dt>
      <dd><LinkPreview url='https://gaudi.dev/docs' title='Gaudi docs' endpoint={null} /></dd>
      <dt className='text-text-muted'>Prepared type</dt>
      <dd><LinkPreview url='https://youtube.com/example' previewData={{ type: 'article', title: 'Article hosted on a video site' }} variant='compact' /></dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvasElement.querySelectorAll('[data-slot="link-preview-skeleton"]')).toHaveLength(2);
    await expect(canvas.getByRole('link', { name: 'Unavailable link (link may be unavailable)' })).toHaveClass('text-danger');
    await expect(canvas.getByRole('link', { name: 'Published article' })).not.toHaveClass('text-danger');
    await expect(canvas.getByRole('link', { name: 'Gaudi docs' })).toHaveAttribute('href', 'https://gaudi.dev/docs');
    await expect(canvas.getByRole('link', { name: /Article hosted on a video site/ }).closest('[data-kind]')).toHaveAttribute('data-kind', 'article');
  }
};
