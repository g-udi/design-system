import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Image from './Image';

const docs = getComponentDocs('MDX/Image');
const image = {
  src: '/static/images/posts/gaudi.svg',
  alt: 'Gaudi diagram',
  caption: 'Project architecture diagram rendered as a post image.',
  width: 420,
  height: 260
};

export default {
  title: 'MDX/Image',
  id: 'mdx-image',
  component: Image,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { src: 'text', darkSrc: 'text', alt: 'text', caption: 'text', width: 'number', height: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { ...image, darkSrc: '/static/images/posts/gaudi-dark.svg' },
  parameters: { docs: { source: playgroundSource('Image', { imports: "import { Image } from '@gaudi/design-system/mdx';" }) } },
  render: (args) => <Image {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.caption)).toBeVisible();
    await userEvent.click(canvas.getAllByRole('button', { name: `Open image: ${args.alt}` }).find((button) => button.checkVisibility()));
    const dialog = await screen.findByRole('dialog', { name: args.caption });
    await expect(within(dialog).getByRole('img', { name: args.alt })).toBeVisible();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close modal' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
};

export const Fallback = {
  parameters: { docs: { description: { story: 'When `src` fails to load, the image swaps to `fallback` and the lightbox opens the fallback too.' } } },
  render: () => <Image {...image} src='/static/images/posts/missing.svg' fallback={image.src} />,
  play: async ({ canvasElement }) => {
    const img = within(canvasElement).getByRole('img', { name: image.alt });
    await waitFor(() => expect(img.getAttribute('src')).toContain('gaudi.svg'));
  }
};
