import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'alert', import.meta.url,
  import.meta.glob('./fixtures/alert/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/alert/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Feedback & States/Banner', id: 'core-banner', tags: ['autodocs'], ...catalogueMeta('alert') };

export const Variants = {
  name: 'Alert: Variants', ...pattern('variants', 'Default with and without an icon, then info, success, warning, destructive and invert.'),
  play: async ({ canvasElement }) => {
    const titles = canvasElement.querySelectorAll('[data-slot="alert-title"]');
    for (const title of titles) {
      await expect(getComputedStyle(title).webkitLineClamp).toBe('none');
      await expect(title.scrollHeight).toBeLessThanOrEqual(title.clientHeight + 1);
    }
    const title = within(canvasElement).getByText('Sync failed — retry after checking your network connection');
    const previousWidth = title.style.maxWidth;
    title.style.maxWidth = '180px';
    try {
      await expect(title.getBoundingClientRect().height).toBeGreaterThan(parseFloat(getComputedStyle(title).lineHeight));
      await expect(title.scrollHeight).toBeLessThanOrEqual(title.clientHeight + 1);
    } finally {
      title.style.maxWidth = previousWidth;
    }
  }
};
export const RichActions = {
  name: 'Alert: Actions and rich content', ...pattern('rich-actions', 'Actions beside a title and description, a title alone, or a description alone, plus a destructive alert with a list. Reload updates local demo state.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Update' })).toHaveAttribute('href', '/settings/security');
    await expect(canvas.getByRole('link', { name: 'Rotate' })).toHaveAttribute('href', '/settings/api-keys');
    await userEvent.click(canvas.getByRole('button', { name: 'Reload' }));
    await expect(canvas.getByText('Demo updated. No page reload was performed.')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Reload' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Later' }));
    await expect(canvas.getAllByRole('alert')).toHaveLength(2);
  }
};
export const Dismissible = {
  name: 'Alert: Dismissible notices',
  ...pattern('dismissible', 'A feature announcement with a close button, an inverted upgrade promo, and a billing notice, each removed by its action.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('alert')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss analytics notice' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(canvas.getAllByRole('alert')).toHaveLength(1));
    await userEvent.click(canvas.getByRole('button', { name: 'Restore notices' }));
    await waitFor(() => expect(canvas.getAllByRole('alert')).toHaveLength(3));
  }
};
export const ServiceStatus = {
  name: 'Alert: Service status summary', ...pattern('service-status', 'Flush alerts stacked in a frame, with a simulated retry that updates the status.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Upgrade' })).toHaveAttribute('href', '/settings/billing');
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }));
    await expect(canvas.getByText('API connection restored')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeDisabled();
  }
};
export const MessageNotice = {
  name: 'Alert: Message notification', ...pattern('message-notice', 'An avatar in place of the icon, in the default and inverted variants. Message actions use explicit routes; dismiss and restore update this demo.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Reply' })).toHaveAttribute('href', '/messages/alex?reply=1');
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }));
    await expect(canvas.getAllByRole('alert')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Restore messages' }));
    await expect(canvas.getAllByRole('alert')).toHaveLength(2);
  }
};
