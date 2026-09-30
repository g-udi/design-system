import { useState } from 'react';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ImageModal from './ImageModal';

const docs = getComponentDocs('MDX/ImageModal');

// A figure gallery from an article: the first figure follows the controls, the others keep their own captions.
const gallery = [
  { src: '/static/images/posts/linked-data-quality.svg', alt: 'Linked data quality framework', caption: 'Roomba profiles a data portal before it scores quality.' },
  { src: '/static/images/posts/jekyll-ci.svg', alt: 'Jekyll continuous deployment pipeline', caption: 'Every push builds, validates, and deploys the site.' },
  { src: '/static/images/posts/unifiedjs.svg', alt: 'unified processing pipeline', caption: 'unified parses markdown, transforms the tree, and serialises HTML.' }
];

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

/** The host owns which figure is open; `isOpen` sets whether the featured figure starts open. */
function Gallery({ isOpen, onClose, ...featured }) {
  const figures = [featured, ...gallery.slice(1)];
  const [open, setOpen] = useState(isOpen ? 0 : null);
  const close = () => {
    setOpen(null);
    onClose();
  };
  return (
    <div className='grid grid-cols-3 gap-2 sm:gap-4'>
      {figures.map((figure, index) => (
        <figure key={figure.alt} className='min-w-0'>
          <button
            type='button'
            className='block w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1 transition sm:p-2 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900'
            aria-label={`Open image: ${figure.alt}`}
            onClick={() => setOpen(index)}
          >
            <img src={figure.src} alt='' className='aspect-[4/3] w-full object-contain' />
          </button>
          <figcaption className='mt-2 text-xs leading-4 text-gray-600 sm:text-sm sm:leading-5 dark:text-gray-400'>{figure.caption}</figcaption>
        </figure>
      ))}
      {figures.map((figure, index) => <ImageModal key={figure.alt} {...figure} isOpen={open === index} onClose={close} />)}
    </div>
  );
}

export const Playground = {
  args: { isOpen: false, ...gallery[0], onClose: fn() },
  argTypes: { alt: { control: false } },
  parameters: {
    docs: {
      description: { story: 'An article figure gallery. Select any figure to open it in the modal; the first figure follows the `src`, `caption`, and `isOpen` controls.' },
      source: playgroundSource('ImageModal', {
        imports: "import { useState } from 'react';\nimport { ImageModal } from '@gaudi/design-system/mdx';\n\n// The host owns isOpen and closes the modal from onClose.\nconst [isOpen, setIsOpen] = useState(false);",
        before: "<button type='button' onClick={() => setIsOpen(true)}>\n  <img src={src} alt={alt} />\n</button>\n\n",
        attributes: ['onClose={() => setIsOpen(false)}']
      })
    }
  },
  render: (args) => <Gallery key={String(args.isOpen)} {...args} />,
  play: async ({ args, canvasElement }) => {
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
