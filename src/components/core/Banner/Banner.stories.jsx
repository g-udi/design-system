import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource, previewSource } from '../../../../.storybook/stories/previewSource';
import Banner, { bannerVariants } from './Banner';

const docs = getComponentDocs('Core/Banner');
const tones = ['gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo'];
const variants = ['solid', 'soft', 'outline'];
const sample = { title: 'Now published', children: 'New essays and project notes are available.' };
// A notification stack: the release banner follows the controls; its neighbours keep their own tone and treatment.
const notices = [
  { title: 'Scheduled maintenance', children: 'Search is read-only on Sunday, 02:00–04:00 UTC.', tone: 'amber', variant: 'soft' },
  { title: 'Payment failed', children: 'Update your card to keep publishing.', tone: 'red', variant: 'outline' }
];
const bannerRoot = (canvas, { title, children, href }) => (href
  ? canvas.getByRole('link', { name: `${title}: ${children}` }).closest('p').parentElement
  : canvas.getAllByRole('status').find((node) => node.textContent.includes(title)));
const noticeSource = (size) => notices.map(({ title, children, tone, variant }) => (
  `\n<Banner title='${title}' size='${size}' tone='${tone}' variant='${variant}'>\n  ${children}\n</Banner>`
)).join('');

export default {
  title: 'Core/Banner',
  id: 'core-banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    title: 'text',
    children: 'text',
    href: 'text',
    size: ['xs', 'sm', 'md', 'lg'],
    tone: tones,
    variant: variants
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <div className='grid gap-3'><Story /></div>]
};

export const Playground = {
  args: { title: 'Gaudi 2.0 is out', children: 'New tokens, 40 components and a faster docs site.', href: '/changelog', size: 'md', tone: 'indigo', variant: 'solid' },
  parameters: {
    docs: {
      description: { story: 'A notification stack. The linked release banner follows every control; the maintenance and billing notices keep their own tone and treatment and share the size. Clear `href` to turn the release banner into a static status.' },
      source: {
        ...playgroundSource('Banner'),
        transform: (_source, { args }) => previewSource('Banner', args, {
          imports: "import { Banner } from '@gaudi/design-system';",
          after: noticeSource(args.size)
        })
      }
    }
  },
  render: (args) => (
    <>
      <Banner {...args} />
      {notices.map((notice) => <Banner key={notice.title} {...notice} size={args.size} />)}
    </>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const { size, tone, variant } = args;
    const release = bannerRoot(canvas, args);
    await expect(release).toHaveClass(...bannerVariants({ size, tone, variant }).split(' '));
    await expect(release).toHaveTextContent(args.title);
    if (args.href) {
      const link = within(release).getByRole('link');
      await expect(link).toHaveAttribute('href', args.href);
      await expect(link).toHaveTextContent('→');
      await expect(release).not.toHaveAttribute('role');
    } else {
      await expect(release).toHaveAttribute('role', 'status');
      await expect(within(release).queryByRole('link')).not.toBeInTheDocument();
    }
    for (const notice of notices) await expect(bannerRoot(canvas, notice)).toHaveClass(...bannerVariants({ ...notice, size }).split(' '));
  }
};

export const Variants = {
  parameters: { docs: { description: { story: 'Solid, soft, and outline treatments in the same tone.' } } },
  render: () => variants.map((variant) => <Banner key={variant} title={variant} tone='blue' variant={variant}>{sample.children}</Banner>),
  play: async ({ canvasElement }) => {
    const banners = within(canvasElement).getAllByRole('status');
    await expect(banners[0]).toHaveClass('bg-blue-600', 'text-white');
    await expect(banners[1]).toHaveClass('bg-blue-50', 'text-blue-900');
    await expect(banners[2]).toHaveClass('border', 'border-blue-200', 'text-blue-900');
  }
};

export const Tones = {
  parameters: { docs: { description: { story: 'Every tone in the soft variant.' } } },
  render: () => tones.map((tone) => <Banner key={tone} title={tone} tone={tone}>{sample.children}</Banner>),
  play: async ({ canvasElement }) => {
    const banners = within(canvasElement).getAllByRole('status');
    await expect(banners).toHaveLength(tones.length);
    for (const [index, tone] of tones.entries()) await expect(banners[index]).toHaveClass(`bg-${tone}-50`);
  }
};
