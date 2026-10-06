import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../docs/components/ComponentDocs';
import { docsArgTypes } from '../../../../docs/components/docsContract';
import { publicSource } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { Gallery, gallery } from './fixtures/Gallery.jsx';
import gallerySource from './fixtures/Gallery.jsx?raw';
import { ExampleFrame } from '../../../../docs/components/ApplicationStoryHelpers';
import ImageModal from '../ImageModal';

const docs = getComponentDocs('MDX/ImageModal');

export default {
  title: 'MDX/ImageModal',
  id: 'mdx-imagemodal',
  component: ImageModal,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { isOpen: 'boolean', src: 'text', caption: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { isOpen: false, ...gallery[0], onClose: fn() },
  argTypes: { alt: { control: false } },
  parameters: {
    docs: {
      description: { story: 'An article figure gallery. Select any figure to open it in the modal; the first figure follows the `src`, `caption`, and `isOpen` controls.' },
      source: { code: publicSource(gallerySource, new URL('./fixtures/Gallery.jsx', import.meta.url)), language: 'jsx' }
    }
  },
  render: (args) => <Gallery key={String(args.isOpen)} {...args} />,
  play: async ({ args, canvasElement, id }) => {
    const canvas = within(canvasElement);
    const openButton = canvas.getByRole('button', { name: `Open image: ${args.alt}` });
    await expect(canvas.getByText(args.caption)).toBeVisible();
    await expect(openButton.querySelector('img')).toHaveAttribute('src', args.src);
    if (args.isOpen) {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    }
    const openDialog = async (button, caption) => {
      await userEvent.click(button);
      return screen.findByRole('dialog', { name: caption });
    };

    const dialog = await openDialog(openButton, args.caption);
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Close modal' })).toHaveFocus());
    await expect(within(dialog).getByRole('img', { name: args.alt })).toHaveAttribute('src', args.src);
    if (import.meta.env.VITE_GAUDI_AUDIT) {
      const caption = within(dialog).getByText(args.caption);
      try {
        caption.textContent = 'LongCaption'.repeat(20);
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ canvasElement, id: id + '--long-caption', beforeAuditWidth: () => {
          const bounds = caption.getBoundingClientRect();
          expect(bounds.left).toBeGreaterThanOrEqual(0);
          expect(bounds.right).toBeLessThanOrEqual(innerWidth);
          expect(caption.scrollWidth).toBeLessThanOrEqual(caption.clientWidth + 1);
        } });
      } finally { caption.textContent = args.caption; }
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(openButton).toHaveFocus();

    // A neighbouring figure opens its own image and caption.
    const [, second] = gallery;
    await userEvent.click(await openDialog(canvas.getByRole('button', { name: `Open image: ${second.alt}` }), second.caption));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onClose).toHaveBeenCalledTimes(args.isOpen ? 3 : 2);
  }
};
