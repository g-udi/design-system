import { expect, userEvent, waitFor, within } from 'storybook/test';

/** Content visibility is independent of the renderer identity, size and pause state. */
export async function checkBackgroundDemo(context) {
  const { canvasElement } = context;
  const canvas = within(canvasElement);
  const content = canvasElement.querySelector('[data-background-demo-content]');
  const effect = canvasElement.querySelector('[data-animated]');
  const renderer = canvasElement.querySelector('canvas') || effect;
  const surface = canvasElement.querySelector('.ds-background') || effect.parentElement;
  const height = surface.getBoundingClientRect().height;
  const toggle = canvas.getByRole('switch', { name: 'Demo content' });
  await expect(content).toBeVisible();
  await expect(canvas.getByRole('heading', { name: 'Make room for your next idea.' })).toBeVisible();
  await expect(toggle).toBeChecked();
  await userEvent.click(canvas.getByRole('button', { name: 'Pause animation' }));
  await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
  toggle.focus();
  await userEvent.keyboard(' ');
  await expect(toggle).toHaveFocus();
  await expect(toggle).not.toBeChecked();
  await expect(content).not.toBeVisible();
  await expect(canvas.queryByRole('heading', { name: 'Make room for your next idea.' })).not.toBeInTheDocument();
  await expect(canvasElement.querySelector('canvas') || canvasElement.querySelector('[data-animated]')).toBe(renderer);
  await expect(surface.getBoundingClientRect().height).toBe(height);
  await expect(effect).toHaveAttribute('data-animated', 'false');
  if (import.meta.env.MODE === 'test' && import.meta.env.VITE_GAUDI_AUDIT === '1') {
    const { auditStoryLayout } = await import('../../../.storybook/storyAudit.js');
    await auditStoryLayout({ ...context, id: `${context.id}--content-hidden` });
  }
  toggle.focus();
  await userEvent.keyboard(' ');
  await expect(toggle).toHaveFocus();
  await expect(toggle).toBeChecked();
  await expect(content).toBeVisible();
  await expect(effect).toHaveAttribute('data-animated', 'false');
  await userEvent.click(canvas.getByRole('button', { name: 'Resume animation' }));
  await expect(canvas.getByRole('button', { name: 'Pause animation' })).toBeVisible();
  if (import.meta.env.MODE === 'test') {
    const { commands } = await import('vitest/browser');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const wasReduced = motion.matches;
    try {
      if (!wasReduced) await commands.emulateStoryMedia({ reducedMotion: 'reduce' });
      await waitFor(() => expect(effect).toHaveAttribute('data-animated', 'false'));
      await expect(content).toBeVisible();
    } finally {
      if (!wasReduced) {
        await commands.emulateStoryMedia({ reducedMotion: null });
        if (motion.matches) await commands.emulateStoryMedia({ reducedMotion: 'no-preference' });
      }
    }
  }
}
