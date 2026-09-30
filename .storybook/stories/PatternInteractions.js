import { expect, userEvent, within, waitFor } from 'storybook/test';

/**
 * Galleries of dialog triggers: open each one, check the initial focus when asked,
 * close with Escape, and confirm focus returns to its trigger.
 */
export async function openEachDialog({ canvasElement, role = 'dialog', initialFocus }) {
  const body = within(canvasElement.ownerDocument.body);
  for (const trigger of within(canvasElement).getAllByRole('button')) {
    await userEvent.click(trigger);
    const dialog = await body.findByRole(role);
    await waitFor(() => expect(dialog).toBeVisible());
    if (initialFocus) await expect(dialog.querySelector(initialFocus)).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  }
}

/** Open the portal so focus and responsive checks cover the dialog, not just its trigger. */
export async function verifyConfirmationDialogInteraction({ canvasElement }) {
  const document = canvasElement.ownerDocument;
  const body = within(document.body);
  const trigger = within(canvasElement).getByRole('button');
  await userEvent.click(trigger);
  const parentDialog = body.queryByRole('dialog');
  let returnTarget = trigger;
  if (parentDialog) {
    returnTarget = within(parentDialog).getByRole('button', { name: 'Open Confirmation Dialog' });
    await userEvent.click(returnTarget);
  }
  const dialog = await body.findByRole('alertdialog');
  const cancel = dialog.querySelector('[data-slot="alert-dialog-cancel"]');
  await expect(cancel).toHaveFocus();
  if (import.meta.env.VITE_GAUDI_RESPONSIVE === '1') {
    const { verifyResponsiveDialog } = await import('../responsive.js');
    await verifyResponsiveDialog(dialog);
  }
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(dialog).not.toBeInTheDocument());
  await expect(returnTarget).toHaveFocus();
  if (parentDialog) {
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(parentDialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
}

/** Exercise real state transitions in representative compound workflows. */
export const catalogueInteractions = {
  'questionnaire-1': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('radio', { name: /Shipping product work/ })
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Next', exact: true })
    );
    await userEvent.click(canvas.getByRole('radio', { name: /2 to 10/ }));
    await userEvent.click(canvas.getByRole('button', { name: /previous/i }));
    await expect(
      canvas.getByRole('radio', { name: /Shipping product work/ })
    ).toBeChecked();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Next', exact: true })
    );
    await expect(canvas.getByRole('radio', { name: /2 to 10/ })).toBeChecked();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Next', exact: true })
    );
    await userEvent.click(
      canvas.getByRole('radio', { name: /A project board/ })
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Finish setup' }));
    await expect(canvas.getByText('Your workspace is ready')).toBeVisible();
    await expect(canvas.queryByText('Not answered')).not.toBeInTheDocument();
  },
  'sortable-1': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getAllByRole('button', { name: 'Reorder item' })[0];
    handle.focus();
    await userEvent.keyboard(' {ArrowDown} ');
    await waitFor(() => {
      const ids = [
        ...canvasElement.querySelectorAll('[data-slot="sortable-item"]')
      ].map((item) => item.dataset.value);
      expect(ids.slice(0, 2)).toEqual(['2', '1']);
      expect(
        document.querySelector('[data-slot=sortable-item][data-dragging=true]')
      ).not.toBeInTheDocument();
      expect(
        getComputedStyle(
          canvasElement.querySelector(
            '[data-slot=sortable-item][data-value="1"]'
          )
        ).opacity
      ).toBe('1');
    });
  },
  'number-field-1': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Amount' });
    await expect(input).toHaveValue('5');
    await userEvent.click(
      canvas.getByRole('button', { name: /increase|increment/i })
    );
    await expect(input).toHaveValue('6');
    await userEvent.clear(input);
    await userEvent.type(input, '150');
    await userEvent.tab();
    await expect(input).toHaveValue('100');
    await expect(
      canvas.getByRole('button', { name: /increase|increment/i })
    ).toHaveAttribute('aria-disabled', 'true');
  },
  'stepper-1': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Step 2 content')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Step 3', exact: true })
    );
    await expect(canvas.getByText('Step 3 content')).toBeVisible();
    await userEvent.keyboard('{Home}');
    await expect(
      canvas.getByRole('button', { name: 'Step 1', exact: true })
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Step 1 content')).toBeVisible();
  },
  'dialog-1': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Basic Dialog' });
    await userEvent.click(trigger);
    const dialog = within(document.body).getByRole('dialog', {
      name: 'Edit profile'
    });
    await waitFor(() => expect(dialog).toBeVisible());
    await waitFor(() => expect(within(dialog).getByLabelText('Name')).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
  'tree-1': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const leads = canvas.getByRole('treeitem', { name: 'Leads', exact: true });
    await userEvent.click(leads);
    await userEvent.keyboard('{ArrowLeft}');
    await expect(leads).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowRight}');
    await expect(leads).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByText('New Lead')).toBeVisible();
  },
  'message-scroller-3': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Message Nimbus' });
    await expect(
      canvas.getByRole('button', { name: 'Send', exact: true })
    ).toBeDisabled();
    await userEvent.type(input, 'Summarize the migration steps.');
    await userEvent.keyboard('{Enter}');
    await expect(input).toHaveValue('');
    await expect(
      canvas.getByText('Summarize the migration steps.')
    ).toBeVisible();
    await waitFor(
      () =>
        expect(canvas.getByText(/Pulled that into the draft/)).toBeVisible(),
      { timeout: 2500 }
    );
  },
  'file-upload-3': async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Choose files');
    const pixels = Uint8Array.from(
      atob(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jrWQAAAAASUVORK5CYII='
      ),
      (char) => char.charCodeAt(0)
    );
    const file = new File([pixels], 'gaudi-preview.png', { type: 'image/png' });
    await userEvent.upload(input, file);
    await expect(
      canvas.getByRole('img', { name: 'gaudi-preview.png' })
    ).toBeVisible();
    const remove = canvas.getByRole('button', { name: 'Close', exact: true });
    await userEvent.click(remove);
    await expect(
      canvas.queryByRole('img', { name: 'gaudi-preview.png' })
    ).not.toBeInTheDocument();
  }
};
