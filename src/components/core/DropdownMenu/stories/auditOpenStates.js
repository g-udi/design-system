import { expect, userEvent, waitFor, within } from 'storybook/test';

export async function auditOpenMenus(context) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  const { canvasElement, id } = context;
  const body = within(canvasElement.ownerDocument.body);
  const triggers = [...canvasElement.querySelectorAll('[aria-haspopup="menu"]')];
  for (const [index, trigger] of triggers.entries()) {
    if (trigger.getAttribute('aria-expanded') !== 'true') await userEvent.click(trigger);
    let menu = await body.findByRole('menu');
    await expect(menu).toBeVisible();
    try {
      await auditStoryLayout({ ...context, id: `${id}--open-${index + 1}` });
      const submenuCount = menu.querySelectorAll('[role="menuitem"][aria-haspopup="menu"]').length;
      for (let subIndex = 0; subIndex < submenuCount; subIndex++) {
        // Escape closes the entire Radix menu tree; reopen for the next branch.
        if (!menu.isConnected) {
          await userEvent.click(trigger);
          menu = await body.findByRole('menu');
        }
        const submenu = menu.querySelectorAll('[role="menuitem"][aria-haspopup="menu"]')[subIndex];
        submenu.focus();
        await userEvent.keyboard(getComputedStyle(submenu).direction === 'rtl' ? '{ArrowLeft}' : '{ArrowRight}');
        await waitFor(() => expect(submenu).toHaveAttribute('aria-expanded', 'true'));
        await auditStoryLayout({
          ...context,
          id: `${id}--open-${index + 1}-submenu-${subIndex + 1}`,
          beforeAuditWidth: async ({ width }) => {
            await waitFor(() => {
              const popup = canvasElement.ownerDocument.getElementById(submenu.getAttribute('aria-controls'));
              const bounds = popup.getBoundingClientRect();
              expect(bounds.width).toBeGreaterThanOrEqual(Math.min(128, width - 16));
              expect(bounds.left).toBeGreaterThanOrEqual(-1);
              expect(bounds.right).toBeLessThanOrEqual(width + 1);
              const item = popup.querySelector('[role="menuitem"]:not([aria-haspopup="menu"])');
              const itemBounds = item.getBoundingClientRect();
              const target = canvasElement.ownerDocument.elementFromPoint(itemBounds.left + itemBounds.width / 2, itemBounds.top + itemBounds.height / 2);
              expect(item.contains(target)).toBe(true);
            });
          }
        });
        // Resizing can move the stationary pointer across another menu row.
        const content = canvasElement.ownerDocument.getElementById(submenu.getAttribute('aria-controls'));
        await expect(content).toBeVisible();
        content.focus();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(content).not.toBeInTheDocument());
      }
    } finally {
      // A failed nested capture must release the menu's modal pointer lock.
      if (menu.isConnected) menu.focus();
      for (let depth = 0; depth < 2 && menu.isConnected; depth++) {
        await userEvent.keyboard('{Escape}');
      }
      await waitFor(() => expect(menu).not.toBeInTheDocument());
    }
  }
}
