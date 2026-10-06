import { expect, userEvent, waitFor, within } from 'storybook/test';

// Audit the actual open surfaces, including every specimen in a trigger gallery.
export async function auditOpenDialogs(context) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  const { canvasElement, id } = context;
  const body = within(canvasElement.ownerDocument.body);
  const triggers = [...canvasElement.querySelectorAll('button[aria-haspopup="dialog"]')];
  for (const [index, trigger] of triggers.entries()) {
    await userEvent.click(trigger);
    let dialog;
    await waitFor(() => {
      dialog = body.queryByRole('alertdialog') || body.queryByRole('dialog');
      expect(dialog).toBeVisible();
    });
    await auditStoryLayout({ ...context, id: `${id}--open-${index + 1}` });
    const nested = within(dialog).queryByRole('button', { name: 'Open Confirmation Dialog' });
    if (nested) {
      await userEvent.click(nested);
      const confirmation = await body.findByRole('alertdialog');
      await auditStoryLayout({ ...context, id: `${id}--nested` });
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(confirmation).not.toBeInTheDocument());
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  }
}
