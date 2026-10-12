import { expect, userEvent, waitFor, within } from 'storybook/test';

/*
 * Shared steps for the framed app-shell examples (see the Patterns section of the AppShell README).
 * The desktop sidebar carries `data-state`; in a narrow frame it is a sheet opened from the header.
 */
export const desktopSidebar = (canvasElement) => canvasElement.querySelector('[data-slot="sidebar"][data-state]:not([data-mobile])');

/** Returns the region that holds the navigation: the docked sidebar, or the phone sheet after opening it. */
export async function openNavigation(canvasElement) {
  const canvas = within(canvasElement);
  await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"][data-state="closed"]')).not.toBeInTheDocument());
  const docked = desktopSidebar(canvasElement);
  if (docked) {
    await waitFor(() => {
      expect(docked).toBeVisible();
      expect(docked.closest('[aria-hidden="true"], [inert]')).toBeNull();
    });
    return within(docked);
  }
  const mobile = canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]');
  if (mobile) {
    await waitFor(() => {
      expect(mobile).toHaveAttribute('data-state', 'open');
      expect(mobile).toBeVisible();
      expect(mobile.closest('[aria-hidden="true"], [inert]')).toBeNull();
    });
    return within(mobile);
  }
  await userEvent.click(canvas.getAllByRole('button', { name: 'Toggle Sidebar' })[0]);
  const sheet = await waitFor(() => {
    const element = canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]');
    expect(element).toHaveAttribute('data-state', 'open');
    expect(element).toBeVisible();
    return element;
  });
  return within(sheet);
}

/** Return to the header through the phone drawer's supported keyboard dismissal. */
export async function closeMobileNavigation(canvasElement) {
  if (!canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')) return;
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(canvasElement.querySelector('[data-slot="sidebar"][data-mobile="true"]')).not.toBeInTheDocument());
}

/** Every framed example renders inside one bordered app window that contains its own main landmark. */
export async function expectFramed(canvasElement) {
  const frame = canvasElement.querySelector('[data-slot="app-shell-frame"]');
  await expect(frame).toBeTruthy();
  await expect(within(frame).getByRole('main')).toBeVisible();
  await expect(getComputedStyle(frame).borderTopStyle).toBe('solid');
}

/** The collapse control stays at the top, with no separate toggle on the panel edge. */
export async function expectHeaderToggle(canvasElement) {
  const trigger = within(canvasElement).getByRole('button', { name: 'Toggle Sidebar' });
  await expect(trigger).toBeVisible();
  await expect(trigger.closest('header, [data-slot="sidebar-header"]')).toBeTruthy();
  await expect(canvasElement.querySelector('[data-slot="sidebar-rail"]')).toBeNull();
  return trigger;
}
