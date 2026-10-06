import { expect, userEvent, waitFor, within } from 'storybook/test';

/** Check the composed shell's container breakpoints, spacing presets and phone drawer. */
export async function checkFinanceLayout(canvasElement) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { page } = await import('vitest/browser');
  const canvas = within(canvasElement);
  const previous = { width: innerWidth, height: innerHeight, scale: canvasElement.style.getPropertyValue('--ds-space-scale') };
  const frame = canvasElement.querySelector('[data-slot="app-shell-frame"]');
  const main = canvas.getByRole('main');
  const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const checkBounds = () => {
    expect(document.documentElement.scrollWidth, 'page contains the shell').toBeLessThanOrEqual(innerWidth + 1);
    expect(frame.scrollWidth, 'frame contains both columns').toBeLessThanOrEqual(frame.clientWidth + 1);
    expect(main.scrollWidth, 'wide tables scroll within their own region').toBeLessThanOrEqual(main.clientWidth + 1);
  };
  try {
    // 32px preview gutter; the docked rail and panel insets change chart/grid thresholds.
    for (const width of [671, 672, 673, 986, 987, 988, 1050, 1051, 1052, 1338, 1339, 1340]) {
      await page.viewport(width, 900);
      await settle();
      checkBounds();
    }
    for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
      canvasElement.style.setProperty('--ds-space-scale', String(scale));
      for (const width of [320, 1440]) {
        await page.viewport(width, 900);
        await settle();
        checkBounds();
        const trigger = canvas.getByRole('button', { name: 'Toggle Sidebar' });
        await userEvent.click(trigger);
        if (width === 320) {
          const drawer = await canvas.findByRole('dialog', { name: 'Finance navigation' });
          const nav = within(drawer);
          await waitFor(() => {
            expect(nav.getByRole('link', { name: 'Finance', exact: true })).toBeVisible();
            const bounds = drawer.getBoundingClientRect();
            const outer = frame.getBoundingClientRect();
            expect(bounds.left).toBeGreaterThanOrEqual(outer.left - 1);
            expect(bounds.right).toBeLessThanOrEqual(outer.right + 1);
          });
          await userEvent.keyboard('{Escape}');
          await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
          await expect(trigger).toHaveFocus();
        } else {
          const sidebar = canvasElement.querySelector('[data-slot="sidebar"][data-state]');
          await waitFor(() => expect(sidebar).toHaveAttribute('data-state', 'collapsed'));
          await waitFor(() => {
            const mark = sidebar.querySelector('[data-slot="sidebar-header"] svg').getBoundingClientRect();
            const bounds = sidebar.querySelector('[data-slot="sidebar-container"]').getBoundingClientRect();
            expect(mark.left).toBeGreaterThanOrEqual(bounds.left);
            expect(mark.right).toBeLessThanOrEqual(bounds.right);
          });
          await userEvent.click(trigger);
        }
      }
    }
  } finally {
    if (previous.scale) canvasElement.style.setProperty('--ds-space-scale', previous.scale);
    else canvasElement.style.removeProperty('--ds-space-scale');
    await page.viewport(previous.width, previous.height);
    await settle();
  }
}
