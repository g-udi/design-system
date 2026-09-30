import { expect, userEvent, waitFor, within } from 'storybook/test';
import { createComponentDocsPage, getComponentDocs } from '../../../../.storybook/stories/ComponentDocs';
import { docsArgTypes } from '../../../../.storybook/stories/docsContract';
import { playgroundSource } from '../../../../.storybook/stories/previewSource';
import { ExampleFrame } from '../../../../.storybook/stories/ApplicationStoryHelpers';
import Button from '../Button';
import ToastProvider, { toast } from './Toast';

const docs = getComponentDocs('Core/Toast');
const saved = { title: 'Draft saved', description: 'Your latest changes are ready for review.' };
const showSaved = () => toast.success(saved.title, { description: saved.description });
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const appears = (canvasElement, text) => waitFor(() => expect(page(canvasElement).getByText(text)).toBeVisible());

export default {
  title: 'Core/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  argTypes: docsArgTypes(docs, {
    position: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
    closeButton: 'boolean',
    duration: 'number'
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
  args: { position: 'bottom-right', closeButton: true, duration: 4000 },
  parameters: {
    docs: {
      source: playgroundSource('ToastProvider', {
        imports: "import { Button, ToastProvider, toast } from '@gaudi/design-system';",
        before: '<>\n',
        after: `\n<Button onClick={() => toast.success('${saved.title}', { description: '${saved.description}' })}>\n  Save draft\n</Button>\n</>`
      })
    }
  },
  render: (args) => (
    <>
      <ToastProvider {...args} />
      <Button onClick={showSaved}>Save draft</Button>
    </>
  ),
  play: async ({ args, canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save draft' }));
    await appears(canvasElement, saved.title);
    await expect(page(canvasElement).getByText(saved.description)).toBeVisible();
    if (args.closeButton) {
      await userEvent.click(page(canvasElement).getByRole('button', { name: /close toast/i }));
      await waitFor(() => expect(page(canvasElement).queryByText(saved.title)).not.toBeInTheDocument());
    }
    toast.dismiss();
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
