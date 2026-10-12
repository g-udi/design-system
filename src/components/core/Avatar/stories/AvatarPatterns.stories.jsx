import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'avatar', import.meta.url,
  import.meta.glob('./fixtures/avatar/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/avatar/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Avatar', id: 'core-avatar', tags: ['autodocs'], ...catalogueMeta('avatar') };

export const SizesFallbacks = { name: 'Sizes, shapes and fallbacks', ...pattern('sizes-fallbacks', 'Built-in and custom sizes, corner radii, and initials or icon fallbacks when there is no image.') };
export const UserDetails = { name: 'User details and badge', ...pattern('user-details') };
export const StatusBadges = { name: 'Status and icon badges', ...pattern('status-badges', 'Status dots, icon badges, every corner position on circles and squares, a custom verified mark, and a count badge.') };
export const Groups = { name: 'Groups', ...pattern('groups', 'Stacked groups with a presence badge, a numeric or icon overflow count, and an add action.') };
export const SocialProof = { name: 'Social proof', ...pattern('social-proof', 'Avatar stacks with a short claim in a pill, a compact count pill, and a frame.') };
export const HoverGroups = {
  name: 'Hover groups with tooltips',
  ...pattern('hover-groups', 'A stacked group lifts on hover; a spaced group scales each avatar in place so its tooltip stays with the person under the pointer.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const target = canvas.getAllByRole('img', { name: 'Maren Wilder' }).at(-1).closest('.ds-part-avatar');
    const before = target.getBoundingClientRect();
    // Audit runs use the browser's real pointer so CSS hover motion is exercised.
    const pointer = import.meta.env.VITE_GAUDI_AUDIT === '1' ? (await import('vitest/browser')).userEvent : userEvent;
    await pointer.hover(target);
    await expect(await body.findByRole('tooltip')).toHaveTextContent('Maren Wilder');
    // The fixture's hover transition takes 300ms; inspect its settled hit target.
    await new Promise((resolve) => setTimeout(resolve, 350));
    const underPointer = canvasElement.ownerDocument.elementFromPoint(before.x + before.width / 2, before.y + before.height / 2);
    await expect(underPointer.closest('.ds-part-avatar')).toBe(target);
    await expect(body.getByRole('tooltip')).toHaveTextContent('Maren Wilder');
    await pointer.unhover(target);
    const previousScale = canvasElement.style.getPropertyValue('--ds-space-scale');
    const previousTransition = target.style.transition;
    try {
      target.style.transition = 'none';
      for (const scale of [0.75, 0.875, 1, 1.25, 1.5]) {
        canvasElement.style.setProperty('--ds-space-scale', String(scale));
        await expect(target.offsetWidth).toBe(32);
        await expect(target.offsetHeight).toBe(32);
      }
    } finally {
      if (previousScale) canvasElement.style.setProperty('--ds-space-scale', previousScale);
      else canvasElement.style.removeProperty('--ds-space-scale');
      target.style.transition = previousTransition;
    }
  }
};
export const InButtons = { name: 'Inside buttons', ...pattern('in-buttons', 'Profile handles in outline, pill outline, and pill solid buttons.') };
export const AccountMenu = {
  name: 'Account dropdown menu',
  ...pattern('account-menu'),
  play: async ({ canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = within(canvasElement).getByRole('button', { name: /Quentin Hale/ });
    await userEvent.click(trigger);
    await expect(await body.findByRole('menuitem', { name: 'Profile' })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('menu')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  }
};
export const ActivityRings = {
  name: 'Rings and activity',
  ...pattern('activity-rings', 'Coloured rings, a pulsing live ring, an animated story ring, an upload spinner overlay, and grayscale for inactive people.'),
  play: async (context) => {
    const uploading = context.canvasElement.querySelector('[aria-busy]');
    await waitFor(() => expect(uploading).toHaveAttribute('aria-busy', 'true'), { timeout: 3000 });
    await expect(uploading.querySelector('[data-slot="loader"]')).toBeInTheDocument();
    await waitFor(() => expect(uploading).toHaveAttribute('aria-busy', 'false'), { timeout: 3000 });
    await expect(uploading.querySelector('[data-slot="loader"]')).not.toBeInTheDocument();
    await expect(within(uploading).getByRole('img', { name: 'Anouk Varga' })).toBeVisible();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, id: `${context.id}--activity-cycle` });
    }
    await waitFor(() => expect(uploading).toHaveAttribute('aria-busy', 'true'), { timeout: 3000 });
  }
};
export const EmptyState = { name: 'Empty state', ...pattern('empty-state') };
