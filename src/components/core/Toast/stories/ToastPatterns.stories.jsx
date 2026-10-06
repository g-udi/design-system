import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { toast } from '../Toast';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';

const pattern = patternStories(
  'toast', import.meta.url,
  import.meta.glob('./fixtures/toast/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/toast/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/Toast', id: 'core-toast', tags: ['autodocs'], ...catalogueMeta('toast') };

// Toasts portal to the page, so queries run against the document body.
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const click = (canvasElement, name) => userEvent.click(within(canvasElement).getByRole('button', { name }));
const appears = (canvasElement, text) => waitFor(() => expect(page(canvasElement).getByText(text)).toBeVisible());
const clearToasts = async (canvasElement) => {
  toast.dismiss();
  await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-sonner-toast]')).not.toBeInTheDocument());
};

export const TypesOptions = {
  name: 'Types and options',
  ...pattern('types-options', 'Default, success, error, warning, info and loading toasts, with controls for position, duration, description, a close button and a custom icon.'),
  play: async (context) => {
    const { canvasElement } = context;
    await userEvent.click(within(canvasElement).getByRole('radio', { name: 'Until closed' }));
    for (const [label, title] of [['Default', 'Event created'], ['Success', 'Changes saved'], ['Warning', 'Storage almost full'], ['Info', 'Update available'], ['Loading', 'Syncing files']]) {
      await click(canvasElement, label);
      await appears(canvasElement, title);
      await auditOverlayState(context, label.toLowerCase());
      await clearToasts(canvasElement);
    }
    await click(canvasElement, 'Success');
    await appears(canvasElement, 'Changes saved');
    await expect(page(canvasElement).getByText('Your profile is up to date.')).toBeVisible();
    await userEvent.click(within(canvasElement).getByRole('switch', { name: 'Close button' }));
    await userEvent.selectOptions(within(canvasElement).getByLabelText('Position'), 'top-center');
    await click(canvasElement, 'Error');
    await appears(canvasElement, 'Upload failed');
    const toaster = canvasElement.ownerDocument.querySelector('[data-sonner-toaster][data-y-position="top"]');
    await expect(toaster).toHaveAttribute('data-x-position', 'center');
    await expect(within(toaster).getByRole('button', { name: /close toast/i })).toBeVisible();
    await auditOverlayState(context, 'error');
    // Restore the defaults after checking the persistent open states.
    await userEvent.click(within(canvasElement).getByRole('radio', { name: '5s' }));
    await userEvent.click(within(canvasElement).getByRole('switch', { name: 'Close button' }));
    await userEvent.selectOptions(within(canvasElement).getByLabelText('Position'), 'bottom-right');
    toast.dismiss();
  }
};
export const Actions = {
  name: 'Actions',
  ...pattern('actions', 'An Undo action after archiving, and a Delete and Cancel pair that turns the toast into a lightweight confirmation.'),
  play: async (context) => {
    const { canvasElement } = context;
    await click(canvasElement, 'Archive message');
    await appears(canvasElement, 'Message archived');
    await auditOverlayState(context, 'archive');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Undo' }));
    await appears(canvasElement, 'Message restored');
    await clearToasts(canvasElement);
    await click(canvasElement, 'Delete item');
    await appears(canvasElement, 'Delete this item?');
    await auditOverlayState(context, 'delete');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Cancel' }));
    await clearToasts(canvasElement);
  }
};
export const AsyncProgress = {
  name: 'Progress and async work',
  ...pattern('async-progress', '`toast.promise` moves from loading to success; the upload reuses one toast id to update its progress in place.'),
  play: async (context) => {
    const { canvasElement } = context;
    await click(canvasElement, 'Deploy');
    await appears(canvasElement, 'Deploying to production...');
    await expect(within(canvasElement).getByRole('button', { name: 'Deploy' })).toBeDisabled();
    await waitFor(() => expect(page(canvasElement).getByText('Deployed to production')).toBeVisible(), { timeout: 4000 });
    await expect(within(canvasElement).getByRole('button', { name: 'Deploy' })).toBeEnabled();
    await auditOverlayState(context, 'deployed');
    await clearToasts(canvasElement);
    await click(canvasElement, /Upload report/);
    await expect(within(canvasElement).getByRole('button', { name: /Upload report/ })).toBeDisabled();
    await waitFor(() => expect(page(canvasElement).getByText('Uploaded')).toBeVisible(), { timeout: 5000 });
    await expect(page(canvasElement).getAllByText('report-q4-2025.pdf')).toHaveLength(1);
    await expect(within(canvasElement).getByRole('button', { name: /Upload report/ })).toBeEnabled();
    await auditOverlayState(context, 'uploaded');
    toast.dismiss();
  }
};
export const CustomContent = {
  name: 'Custom content',
  ...pattern('custom-content', 'Rich toasts built with `toast.custom`: a message with an avatar, an accent update notice, a session warning, deployment details, a failed build log and a pull request with reviewers. The switch renders them on an inverted surface.'),
  play: async (context) => {
    const { canvasElement } = context;
    for (const [label, title] of [['Message', 'Sabine Okafor'], ['Update', 'A new editor version is ready'], ['Session', 'Session expiring'], ['Deployment', 'Deployment successful'], ['Build failed', 'Compilation errors in 2 files.']]) {
      await click(canvasElement, label);
      await appears(canvasElement, title);
      await auditOverlayState(context, label.toLowerCase().replaceAll(' ', '-'));
      await clearToasts(canvasElement);
    }
    await click(canvasElement, 'Pull request');
    await appears(canvasElement, 'Pull request #284');
    await auditOverlayState(context, 'pull-request');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Merge' }));
    await appears(canvasElement, 'Merged into main');
    await clearToasts(canvasElement);
    await userEvent.click(within(canvasElement).getByRole('switch', { name: 'Inverted surface' }));
    for (const [label, title] of [['Message', 'Sabine Okafor'], ['Update', 'A new editor version is ready'], ['Session', 'Session expiring'], ['Deployment', 'Deployment successful'], ['Build failed', 'Compilation errors in 2 files.'], ['Pull request', 'Pull request #284']]) {
      await click(canvasElement, label);
      await appears(canvasElement, title);
      await auditOverlayState(context, `inverted-${label.toLowerCase().replaceAll(' ', '-')}`);
      await clearToasts(canvasElement);
    }
    await userEvent.click(within(canvasElement).getByRole('switch', { name: 'Inverted surface' }));
    await click(canvasElement, 'Session');
    await appears(canvasElement, 'Session expiring');
    await click(canvasElement, 'Message');
    await appears(canvasElement, 'Sabine Okafor');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Accept' }));
    await appears(canvasElement, 'Invitation accepted');
    // Acting on one custom toast must preserve other notices in the same provider.
    await expect(page(canvasElement).getByText('Session expiring')).toBeVisible();
    await clearToasts(canvasElement);
  }
};
