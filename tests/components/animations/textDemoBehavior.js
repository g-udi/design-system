import { expect } from 'storybook/test';

/** The shared stage follows the host density at every supported breakpoint and theme. */
export async function checkTextDemoDensity(context) {
  if (import.meta.env.MODE !== 'test' || import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../.storybook/storyAudit.js');
  const stage = context.canvasElement.querySelector('[data-animated]').parentElement.parentElement;
  const shell = stage.parentElement;
  const original = shell.style.getPropertyValue('--ds-space-scale');
  try {
    for (const density of [.75, .875, 1, 1.25, 1.5]) {
      shell.style.setProperty('--ds-space-scale', density);
      expect(parseFloat(getComputedStyle(stage).paddingTop)).toBe(32 * density);
      expect(parseFloat(getComputedStyle(stage).paddingLeft)).toBe(16 * density);
      expect(parseFloat(getComputedStyle(shell.lastElementChild).gap)).toBe(8 * density);
      await auditStoryLayout({ ...context, id: `${context.id}--density-${density}` });
    }
  } finally {
    if (original) shell.style.setProperty('--ds-space-scale', original);
    else shell.style.removeProperty('--ds-space-scale');
  }
}
