import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { toast } from './Toast';

const pattern = patternStories(
  'sonner',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sonner/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sonner/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/Toast', id: 'core-toast', tags: ['autodocs'], ...catalogueMeta('sonner') };

// Toasts portal to the page, so queries run against the document body.
const page = (canvasElement) => within(canvasElement.ownerDocument.body);
const click = (canvasElement, name) => userEvent.click(within(canvasElement).getByRole('button', { name }));
const appears = (canvasElement, text) => waitFor(() => expect(page(canvasElement).getByText(text)).toBeVisible());

export const SonnerPattern4 = {
  name: 'Types and options',
  ...pattern(4, 'Default, success, error, warning, info and loading toasts, with controls for position, duration, description, a close button and a custom icon.'),
  play: async ({ canvasElement }) => {
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
    // Restore the defaults so the story view opens in its resting state.
    await userEvent.click(within(canvasElement).getByRole('switch', { name: 'Close button' }));
    await userEvent.selectOptions(within(canvasElement).getByLabelText('Position'), 'bottom-right');
    toast.dismiss();
  }
};
export const SonnerPattern6 = {
  name: 'Actions',
  ...pattern(6, 'An Undo action after archiving, and a Delete and Cancel pair that turns the toast into a lightweight confirmation.'),
  play: async ({ canvasElement }) => {
    await click(canvasElement, 'Archive message');
    await appears(canvasElement, 'Message archived');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Undo' }));
    await appears(canvasElement, 'Message restored');
    toast.dismiss();
  }
};
export const SonnerPattern7 = {
  name: 'Progress and async work',
  ...pattern(7, '`toast.promise` moves from loading to success; the upload reuses one toast id to update its progress in place.'),
  play: async ({ canvasElement }) => {
    await click(canvasElement, 'Deploy');
    await appears(canvasElement, 'Deploying to production...');
    await waitFor(() => expect(page(canvasElement).getByText('Deployed to production')).toBeVisible(), { timeout: 4000 });
    await click(canvasElement, /Upload report/);
    await waitFor(() => expect(page(canvasElement).getByText('Uploaded')).toBeVisible(), { timeout: 5000 });
    await expect(page(canvasElement).getAllByText('report-q4-2025.pdf')).toHaveLength(1);
    toast.dismiss();
  }
};
export const SonnerPattern9 = {
  name: 'Custom content',
  ...pattern(9, 'Rich toasts built with `toast.custom`: a message with an avatar, an accent update notice, a session warning, deployment details, a failed build log and a pull request with reviewers. The switch renders them on an inverted surface.'),
  play: async ({ canvasElement }) => {
    await click(canvasElement, 'Pull request');
    await appears(canvasElement, 'Pull request #284');
    await userEvent.click(page(canvasElement).getByRole('button', { name: 'Merge' }));
    await appears(canvasElement, 'Merged into main');
    toast.dismiss();
  }
};
