import { expect, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import Banner from './Banner';

const docs = getComponentDocs('Core/Banner');
const tones = ['gray', 'neutral', 'blue', 'teal', 'green', 'amber', 'yellow', 'red', 'rose', 'indigo'];
const variants = ['solid', 'soft', 'outline'];
const sample = { title: 'Now published', children: 'New essays and project notes are available.' };

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
  args: { ...sample, size: 'md', tone: 'gray', variant: 'soft' },
  parameters: { docs: { source: playgroundSource('Banner', { imports: "import { Banner } from '@gaudi/design-system';" }) } },
  render: (args) => <Banner {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    if (args.href) {
      await expect(canvas.getByRole('link', { name: `${args.title}: ${args.children}` })).toHaveAttribute('href', args.href);
      return;
    }
    const banner = canvas.getByRole('status');
    await expect(banner).toHaveTextContent(args.title);
    await expect(banner).toHaveTextContent(args.children);
    await expect(canvas.queryByRole('link')).not.toBeInTheDocument();
  }
};

export const Linked = {
  parameters: { docs: { description: { story: '`href` turns the copy into one link named "title: body"; the banner drops its status role.' } } },
  render: () => <Banner {...sample} href='/blog' />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: `${sample.title}: ${sample.children}` });
    await expect(link).toHaveAttribute('href', '/blog');
    await expect(link).toHaveTextContent('→');
    await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
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
