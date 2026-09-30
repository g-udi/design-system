import { useEffect } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import ToastProvider, { toast } from './Toast';

const docs = getComponentDocs('Core/Toast');
const saved = { title: 'Draft saved', description: 'Your latest changes are ready for review.' };
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const appears = (canvasElement, text) => waitFor(() => expect(page(canvasElement).getByText(text)).toBeVisible());

// The Playground owns a named toaster, so its stack never leaks into the other examples on the page.
const toasterId = 'toast-playground';
const pinned = { toasterId, duration: Infinity };
const stack = {
  saved: () => toast.success(saved.title, { ...pinned, id: 'saved', description: saved.description }),
  export: () => toast.error('Export interrupted', {
    ...pinned,
    id: 'export',
    description: 'Your draft is still saved.',
    action: {
      label: 'Retry',
      onClick: (event) => {
        // Keep the toast and update it in place instead of letting Sonner dismiss it.
        event.preventDefault();
        toast.success('Export restarted', { ...pinned, id: 'export', description: 'We will email you the PDF.', action: null });
      }
    }
  }),
  publish: () => toast.loading('Publishing to 3 channels', { ...pinned, id: 'publish', description: 'Blog, newsletter and RSS.', classNames: { icon: 'relative size-4 shrink-0' } })
};
const showStack = () => Object.values(stack).forEach((show) => show());
const skeleton = ['w-2/3', 'w-full', 'w-5/6', 'w-full', 'w-1/2'];

function ToastWindow(args) {
  useEffect(() => {
    const timer = setTimeout(showStack);
    return () => clearTimeout(timer);
  }, []);
  return (
    // `transform` makes the frame the containing block, so the fixed toaster is positioned inside it.
    <div className='relative h-96 overflow-hidden rounded-lg border border-border bg-surface [transform:translateZ(0)]'>
      <div className='flex flex-wrap items-center gap-2 border-b border-border px-4 py-3'>
        <span className='me-auto text-sm font-medium'>Quarterly report</span>
        <Button size='sm' variant='outline' tone='neutral' onClick={stack.saved}>Save draft</Button>
        <Button size='sm' variant='outline' tone='neutral' onClick={stack.export}>Export</Button>
        <Button size='sm' onClick={stack.publish}>Publish</Button>
      </div>
      <div className='grid gap-3 p-4' aria-hidden='true'>
        {skeleton.map((width, index) => <div key={index} className={`h-2.5 rounded-full bg-surface-muted ${width}`} />)}
      </div>
      <ToastProvider id={toasterId} {...args} />
    </div>
  );
}

export default {
  title: 'Core/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    position: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    expand: 'boolean',
    closeButton: 'boolean'
  }),
  parameters: {
    docs: {
      description: { component: docs.description },
      page: createComponentDocsPage(docs, { primaryStory: () => Playground })
    }
  },
  decorators: [(Story) => <ExampleFrame><Story /></ExampleFrame>]
};

export const Playground = {
  args: { position: 'bottom-right', expand: true, closeButton: true },
  parameters: {
    docs: {
      description: { story: 'An app window with a live stack: a saved draft, a failed export with a Retry action, and a publish in progress. `position` moves the stack, `expand` fans it out or collapses it, and `closeButton` adds a dismiss action to each toast. The toolbar buttons fire them again.' },
      source: playgroundSource('ToastProvider', {
        imports: "import { Button, ToastProvider, toast } from '@gaudi/design-system';",
        before: '<>\n',
        after: [
          '',
          `<Button onClick={() => toast.success('${saved.title}', { description: '${saved.description}' })}>Save draft</Button>`,
          "<Button onClick={() => toast.error('Export interrupted', { action: { label: 'Retry', onClick: () => toast.success('Export restarted') } })}>Export</Button>",
          "<Button onClick={() => toast.loading('Publishing to 3 channels')}>Publish</Button>",
          '</>'
        ].join('\n')
      })
    }
  },
  render: (args) => <ToastWindow {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [y, x] = args.position.split('-');
    await waitFor(() => expect(canvas.getByText(saved.title)).toBeVisible());
    await expect(canvas.getByText('Export interrupted')).toBeInTheDocument();
    await expect(canvas.getByText('Publishing to 3 channels')).toBeInTheDocument();
    const toaster = canvasElement.querySelector('[data-sonner-toaster]');
    await expect(toaster).toHaveAttribute('data-y-position', y);
    await expect(toaster).toHaveAttribute('data-x-position', x);
    // Sonner omits the close action while a toast is loading.
    await expect(canvas.queryAllByRole('button', { name: /close toast/i })).toHaveLength(args.closeButton ? 2 : 0);
    if (args.expand) {
      await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
      await waitFor(() => expect(canvas.getByText('Export restarted')).toBeVisible());
    }
    // Leave the default stack in place for the story view.
    showStack();
  }
};

export const ErrorWithRecovery = {
  parameters: { docs: { description: { story: 'An error toast keeps the user\'s work safe and offers a keyboard-reachable `action` to retry.' } } },
  render: () => (
    <>
      <ToastProvider />
      <Button
        variant='outline'
        onClick={() =>
          toast.error('Export interrupted', {
            description: 'Your draft is still saved.',
            action: { label: 'Retry', onClick: () => toast.success('Export restarted') }
          })
        }
      >
        Simulate failed export
      </Button>
    </>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Simulate failed export' }));
    await appears(canvasElement, 'Export interrupted');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Retry' }));
    await appears(canvasElement, 'Export restarted');
    toast.dismiss();
  }
};
