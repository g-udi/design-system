import { expect, userEvent, waitFor, within } from 'storybook/test';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';

const popupSelector = '[data-slot="select-content"], [data-slot="combobox-content"], [data-slot="autocomplete-popup"]';

export async function waitForDialogAnimation(dialog) {
  // Match a native click's stability check before opening an anchored popup.
  await Promise.all(dialog.getAnimations()
    .filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
    .map(animation => animation.finished.catch(() => {})));
}

/** Exercise each distinct option renderer before restoring its trigger. */
export async function auditSelectMenus(context) {
  const { canvasElement } = context;
  const document = canvasElement.ownerDocument;
  let scope = canvasElement;
  const dialogTrigger = within(canvasElement).queryByRole('button', { name: /^(Open Dialog|Invite member)$/ });
  if (dialogTrigger) {
    await userEvent.click(dialogTrigger);
    scope = await within(document.body).findByRole('dialog');
    await waitForDialogAnimation(scope);
  }
  const triggers = [...scope.querySelectorAll('[role="combobox"], button[data-slot="combobox-trigger"]')]
    .filter(trigger => !trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true');
  await expect(triggers.length).toBeGreaterThan(0);
  for (const [index, trigger] of triggers.entries()) {
    await userEvent.click(trigger);
    if (trigger.tagName === 'INPUT') await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(document.querySelector(popupSelector)).toBeVisible());
    await auditOverlayState({
      ...context,
      beforeAuditWidth: async () => {
        // Radix Select intentionally closes on resize; inspect an open menu at every width.
        if (trigger.getAttribute('aria-expanded') !== 'true') {
          await userEvent.click(trigger);
          if (trigger.tagName === 'INPUT') await userEvent.keyboard('{ArrowDown}');
        }
        await waitFor(() => expect(document.querySelector(popupSelector)).toBeVisible());
      }
    }, `options-${index + 1}`);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
    trigger.blur();
    await waitFor(() => expect(document.querySelector(popupSelector)).not.toBeInTheDocument());
  }
  if (dialogTrigger) {
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
    await expect(dialogTrigger).toHaveFocus();
  }
}
