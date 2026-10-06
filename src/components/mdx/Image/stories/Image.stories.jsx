import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { playgroundSource } from '../../../../docs/components/previewSource';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import Image from '../Image';

const docs = getComponentDocs('MDX/Image');
const image = {
  src: '/static/images/art/0.svg',
  alt: 'Lavender gradient artwork',
  caption: 'A lavender gradient study rendered as a post image.',
  width: 420,
  height: 237
};
const darkSrc = '/static/images/art/5.svg';
const lead = 'Soft gradients bring color to the reading column. Select the image for a closer look.';

export default {
  title: 'MDX/Image',
  id: 'mdx-image',
  component: Image,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { caption: 'text', width: 'number' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { caption: 'A study in lavender and light. Select the image to expand it.', width: 560 },
  parameters: {
    docs: {
      description: { story: 'An article figure using local gradient artwork: the image swaps to a second gradient with the dark theme, the caption sits below, and selecting the image opens it in a lightbox.' },
      source: playgroundSource('Image', {
        imports: "import { Image } from '@gaudi/design-system/mdx';",
        attributes: [`src='${image.src}'`, `darkSrc='${darkSrc}'`, `alt='${image.alt}'`, 'height={316}']
      })
    }
  },
  render: (args) => (
    <div className='text-base leading-7 text-text'>
      <p className='mb-4'>{lead}</p>
      <Image {...image} darkSrc={darkSrc} height={316} {...args} />
    </div>
  ),
  play: async ({ args, canvasElement, id }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(args.caption)).toBeVisible();
    const trigger = canvas.getAllByRole('button', { name: `Open image: ${image.alt}` }).find((button) => button.checkVisibility());
    await expect(within(trigger).getByRole('img')).toHaveAttribute('width', String(args.width));
    // The image and its centred caption share one axis.
    const centre = (element) => { const { left, width } = element.getBoundingClientRect(); return left + width / 2; };
    await expect(Math.abs(centre(trigger) - centre(canvas.getByText(args.caption)))).toBeLessThan(2);
    if (import.meta.env.VITE_GAUDI_AUDIT) {
      const caption = canvas.getByText(args.caption);
      try {
        caption.textContent = 'LongCaption'.repeat(20);
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ canvasElement, id: id + '--long-caption' });
      } finally { caption.textContent = args.caption; }
    }
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: args.caption });
    await expect(within(dialog).getByRole('img', { name: image.alt })).toBeVisible();
    await userEvent.click(within(dialog).getByRole('button', { name: 'Close modal' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  }
};

export const Fallback = {
  parameters: { docs: { description: { story: 'When `src` fails to load, the image swaps to `fallback` and the lightbox opens the fallback too.' } } },
  render: () => <Image {...image} src='/static/images/art/missing.svg' fallback={image.src} />,
  play: async ({ canvasElement }) => {
    const img = within(canvasElement).getByRole('img', { name: image.alt });
    await waitFor(() => expect(img.getAttribute('src')).toContain(image.src));
  }
};
