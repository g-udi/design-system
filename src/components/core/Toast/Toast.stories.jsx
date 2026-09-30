import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  applicationDocs,
  ExampleFrame
} from '../../../../.storybook/stories/ApplicationStoryHelpers';
import ToastProvider, { toast } from './Toast';
import Button from '../Button';
export default {
  tags: ['autodocs'],
  title: 'Core/Toast',
  component: ToastProvider,
  ...applicationDocs(
    'Sonner notifications styled with Gaudi tokens. Mount one ToastProvider per app. toast.success, toast.error and action callbacks provide non-blocking feedback.',
    "import { Button, ToastProvider, toast } from '@gaudi/design-system';\n\n<>\n  <ToastProvider />\n  <Button onClick={() => toast.success('Draft saved')}>Save draft</Button>\n</>",
    'Sonner announces notifications and supports keyboard focus and dismissal. Critical errors should also remain next to the affected content.'
  )
};
export const SaveFeedback = {
  render: () => (
    <ExampleFrame>
      <ToastProvider />
      <Button
        onClick={() =>
          toast.success('Draft saved', {
            description: 'Your latest changes are ready for review.'
          })
        }
      >
        Save draft
      </Button>
    </ExampleFrame>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Save draft' })
    );
    await waitFor(() =>
      expect(
        within(canvasElement.ownerDocument.body).getByText('Draft saved')
      ).toBeVisible()
    );
    toast.dismiss();
  }
};
export const ErrorWithRecovery = {
  render: () => (
    <ExampleFrame>
      <ToastProvider />
      <Button
        variant='outline'
        onClick={() =>
          toast.error('Export interrupted', {
            description: 'Your draft is still saved.',
            action: {
              label: 'Retry',
              onClick: () => toast.success('Export restarted')
            }
          })
        }
      >
        Simulate failed export
      </Button>
    </ExampleFrame>
  )
};
export const UndoAction = {
  render: () => (
    <ExampleFrame>
      <ToastProvider />
      <Button
        variant='outline'
        onClick={() =>
          toast('Article archived', {
            action: {
              label: 'Undo',
              onClick: () => toast.success('Article restored')
            }
          })
        }
      >
        Archive article
      </Button>
    </ExampleFrame>
  )
};
