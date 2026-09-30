import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../../core/Button';
import ImageModal from './ImageModal';

const docs = getComponentDocs('MDX/ImageModal');

export default {
  title: 'MDX/ImageModal',
  id: 'mdx-imagemodal',
  component: ImageModal,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, { isOpen: 'boolean', src: 'text', alt: 'text', caption: 'text' }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

/** The host owns `isOpen`; the control sets its initial value. */
function HostedModal({ isOpen, onClose, ...args }) {
  const [open, setOpen] = useState(isOpen);
  const close = () => {
    setOpen(false);
    onClose();
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open image modal</Button>
      <ImageModal {...args} isOpen={open} onClose={close} />
    </>
  );
}

export const Playground = {
  args: {
    isOpen: false,
    src: '/static/images/og-card.jpg',
    alt: 'Gaudi design system article preview',
    caption: 'Accessible image preview with focus management.',
    onClose: fn()
  },
  parameters: {
    docs: {
      source: playgroundSource('ImageModal', {
        imports: "import { ImageModal } from '@gaudi/design-system/mdx';\n\n// The host owns isOpen and closes the modal from onClose."
      })
    }
  },
  render: (args) => <HostedModal key={String(args.isOpen)} {...args} />,
  play: async ({ args, canvasElement }) => {
    const openButton = within(canvasElement).getByRole('button', { name: 'Open image modal' });
    const openDialog = async () => {
      await userEvent.click(openButton);
      return screen.findByRole('dialog', { name: args.caption });
    };

    const dialog = await openDialog();
    await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Close modal' })).toHaveFocus());
    await expect(within(dialog).getByRole('img', { name: args.alt })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(openButton).toHaveFocus();

    await userEvent.click(await openDialog());
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onClose).toHaveBeenCalledTimes(2);
  }
};
