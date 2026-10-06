/** Capture a live open state before preview.afterEach clears focus. Story-only, never copied into examples. */
export async function auditOverlayState(context, state) {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}-${state}` });
}
