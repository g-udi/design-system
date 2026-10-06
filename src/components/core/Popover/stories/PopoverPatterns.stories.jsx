import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { auditOverlayState } from './auditOverlayState.js';

const pattern = patternStories(
  'popover', import.meta.url,
  import.meta.glob('./fixtures/popover/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/popover/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const openPanel = async (context) => {
  const { canvasElement } = context;
  const canvas = within(canvasElement);
  const body = within(canvasElement.ownerDocument.body);
  if (!canvasElement.querySelector('[data-slot="popover-trigger"]')) {
    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
    await body.findByRole('dialog');
  }
  const triggers = [...canvasElement.ownerDocument.querySelectorAll('[data-slot="popover-trigger"]')];
  for (const [index, trigger] of triggers.entries()) {
    await userEvent.click(trigger);
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="popover-content"]')).toBeVisible());
    await auditOverlayState(context, `open-${index + 1}`);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="popover-content"]')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
  const hoverTrigger = canvasElement.ownerDocument.querySelector('[data-slot="hover-card-trigger"]');
  if (hoverTrigger) {
    hoverTrigger.focus();
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="hover-card-content"]')).toBeVisible());
    await auditOverlayState(context, 'nested-hover');
    await userEvent.keyboard('{Escape}');
    hoverTrigger.blur();
    await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="hover-card-content"]')).not.toBeInTheDocument());
  }
  await userEvent.click(triggers[0]);
};

export default { title: 'Core/Overlays & Menus/Popover', id: 'core-popover', tags: ['autodocs'], ...catalogueMeta('popover'), play: openPanel };

export const Placement = { name: 'Sides and alignment', ...pattern('placement', 'Each side and each alignment, with a header, title and description.') };
export const SettingsForm = { name: 'Settings form', ...pattern('settings-form', 'Inputs, switches and a slider in a sectioned panel.') };
export const Rich = {
  name: 'Rich content',
  ...pattern('rich', 'Profile and media previews, a premium feature preview, and notifications. Links and actions belong in a focusable popover rather than a tooltip.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    for (const name of ['Dorian Chua', 'Preview']) {
      await userEvent.click(canvas.getByRole('button', { name }));
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="popover-content"]')).toBeVisible());
      await auditOverlayState(context, name === 'Preview' ? 'media' : 'profile');
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="popover-content"]')).not.toBeInTheDocument());
    }
    const notifications = canvas.getByRole('button', { name: 'Notifications, 3 new' });
    notifications.focus();
    await userEvent.keyboard('{Enter}');
    const dialog = await body.findByRole('dialog', { name: 'Notifications' });
    await waitFor(() => expect(dialog).toHaveFocus());
    await userEvent.tab();
    await expect(within(dialog).getByRole('link', { name: 'View all' })).toHaveFocus();
    await auditOverlayState(context, 'notifications');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(notifications).toHaveFocus());
    const analytics = canvas.getByRole('button', { name: 'Advanced analytics' });
    analytics.focus();
    await userEvent.keyboard(' ');
    const preview = await body.findByRole('dialog', { name: 'Advanced analytics' });
    await waitFor(() => expect(within(preview).getByRole('button', { name: 'Try Pro preview' })).toHaveFocus());
    await auditOverlayState(context, 'feature');
    await userEvent.keyboard('{Enter}');
    await expect(within(preview).getByRole('button', { name: 'Preview enabled' })).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(analytics).toHaveFocus());
    await userEvent.click(notifications);
  }
};
export const Paged = { name: 'Paged content', ...pattern('paged', 'Step through release notes inside the panel without closing it.') };
export const InDialog = { name: 'Inside a dialog', ...pattern('in-dialog', 'A popover and a hover card opened from inside a modal dialog.') };
