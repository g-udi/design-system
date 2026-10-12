import { checkCascaderRefs } from '../../../../../tests/components/core/Cascader/checkCascaderRefs.jsx';
import { badgeVariants } from '../../Pill/Badge.jsx';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const patternStory = patternStories(
  'cascader', import.meta.url,
  import.meta.glob('./fixtures/cascader/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/cascader/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const auditPopup = async (context) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { canvasElement, id } = context;
  const badgePaths = {
    'core-cascader--avatars-roles': ['Engineering'],
    'core-cascader--columns': ['First steps', 'Opening your studio'],
    'core-cascader--async-drill-down': ['gaudi', 'v4.0'],
    'core-cascader--virtualized': ['Europe']
  };
  const badgePath = badgePaths[id];
  const trigger = within(canvasElement).getByRole('combobox');
  await waitFor(() => expect(trigger).toBeEnabled());
  await userEvent.click(trigger);
  await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  try {
    const popup = canvasElement.ownerDocument.querySelector('[data-slot="cascader-content"]');
    if (badgePath) await within(popup).findByText(badgePath[0], { exact: true });
    await auditStoryLayout({ ...context, id: `${id}--open` });
    if (badgePath) {
      for (const label of badgePath) {
        const row = (await within(popup).findByText(label, { exact: true })).closest('[data-slot="cascader-item"]');
        await userEvent.click(row);
      }
      await waitFor(() => expect(popup.querySelector('[data-slot="badge"]')).not.toBeNull());
      await auditStoryLayout({ ...context, id: `${id}--badge-details`, beforeAuditWidth: () => {
        const badges = [...popup.querySelectorAll('[data-slot="badge"]')];
        badges[0]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        for (const badge of badges) {
          if (badge.closest('[data-highlighted]')) continue;
          // Caller labels must retain the canonical variant ink in either theme.
          const canonical = badge.cloneNode(false);
          canonical.className = badgeVariants({ variant: badge.dataset.variant });
          canvasElement.ownerDocument.body.appendChild(canonical);
          try {
            expect(getComputedStyle(badge).color).toBe(getComputedStyle(canonical).color);
          } finally {
            canonical.remove();
          }
        }
      } });
    }
  } finally {
    // Resize may move focus; dismiss from inside the popup, then wait for the
    // modal's actual cleanup before the next example can receive pointer input.
    const popup = canvasElement.ownerDocument.querySelector('[data-slot="cascader-content"]');
    popup?.focus();
    await userEvent.keyboard('{Escape}');
    await popupGone(canvasElement);
  }
};
const pattern = (...args) => ({ ...patternStory(...args), play: auditPopup });

export default { title: 'Core/Advanced Inputs/Cascader', id: 'core-cascader', tags: ['autodocs'], ...catalogueMeta('cascader') };

// The popup unmounts after its exit transition; axe runs once it has gone.
const popupGone = (canvasElement) =>
  waitFor(() => {
    const document = canvasElement.ownerDocument;
    expect(document.querySelector('[data-slot="cascader-content"]')).toBeNull();
    expect(document.querySelector('[data-base-ui-focus-guard]')).toBeNull();
    expect(getComputedStyle(document.body).pointerEvents).not.toBe('none');
  });

export const DrillDown = {
  name: 'Drill-down picker',
  ...pattern('drill-down', 'Brand icons, branch counts and search keywords across three levels. The toggles switch how the trigger prints the path (collapsed, full, tail, leaf or a headless custom value) and whether search reaches every level.'),
  play: async (context) => {
    const { canvasElement } = context;
    await checkCascaderRefs(canvasElement);
    await auditPopup(context);
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('switch'));
    await userEvent.click(canvas.getByRole('combobox', { name: 'Resource' }));
    await userEvent.type(await page.findByPlaceholderText('Search every level...'), 'review');
    await userEvent.click(await page.findByRole('option', { name: /#design-review/ }));
    await popupGone(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Resource' })).toHaveTextContent('#design-review');
  }
};
export const MultiSelectChips = {
  name: 'Multi-select with chips and presets',
  ...pattern('multi-select-chips', 'Up to five leaves with a count in the trigger, a clear button, removable path chips outside the popup, and a footer with a preset flyout and a clear action.'),
  play: async (context) => {
    const { canvasElement } = context;
    await auditPopup(context);
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Permissions' }));
    await userEvent.click(await page.findByText('Start from a preset'));
    await userEvent.click(await page.findByText('Developer'));
    await userEvent.keyboard('{Escape}');
    await popupGone(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Permissions' })).toHaveTextContent('5 selected');
    await userEvent.click(canvas.getByRole('button', { name: 'Remove Projects / Edit projects' }));
    await expect(canvas.getByRole('combobox', { name: 'Permissions' })).toHaveTextContent('4 selected');
  }
};
export const FormField = {
  name: 'Form field',
  ...pattern('form-field', 'A named field inside a form, built from flat rows whose parent pointers getParent turns into the tree; the submitted value is printed below.'),
  play: async (context) => {
    const { canvasElement } = context;
    await auditPopup(context);
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'What do you need help with?' }));
    await userEvent.click(await page.findByRole('option', { name: /Billing/ }));
    await userEvent.click(await page.findByRole('option', { name: /Invoice question/ }));
    await popupGone(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Submit request' }));
    await expect(canvas.getByText('topic=billing.invoice')).toBeVisible();
  }
};
export const AvatarsRoles = { name: 'Avatars and role badges', ...pattern('avatars-roles', 'Custom rows pairing avatars and presence dots with outline role badges, and a trigger that shows the chosen person.') };
export const TwoLineRows = { name: 'Two-line rows with branch colours', ...pattern('two-line-rows', 'Account codes and amounts on a second line, branch colours inherited by children, any level selectable, and a closed account disabled.') };
export const RecentGroups = { name: 'Recently used groups', ...pattern('recent-groups', 'Custom item rendering splits the root into labelled groups, recent destinations move to the top, and search reaches every folder.') };
export const Columns = { name: 'Columns mode', ...pattern('columns', 'A media library in Miller columns where all three panes overflow and each scrolls on its own.') };
export const PopoverTree = { name: 'Cascading tree in a popover', ...pattern('popover-tree', 'A cascading tree with indeterminate branches in a popover, bounded by the positioner\'s available height.') };
export const Controlled = {
  name: 'Controlled state',
  ...pattern('controlled', 'External buttons jump the panel to a level, reset it to the root and clear the selection, with all four controlled props printed under the control.'),
  play: async (context) => {
    await auditPopup(context);
    const canvas = within(context.canvasElement);
    const page = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Jump to Mains' }));
    await page.findByRole('option', { name: 'Pasta' });
    await userEvent.click(page.getByRole('button', { name: 'Back' }));
    await expect(canvas.getByText('back to parent')).toBeVisible();
    await expect(await page.findByRole('option', { name: /Sides/ })).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await popupGone(context.canvasElement);
  }
};
export const AsyncDrillDown = {
  name: 'Async drill-down',
  ...pattern('async-drill-down', 'Releases and assets load page by page as each branch opens. Closing a pending request cancels it; reopening can request that page again.'),
  play: async (context) => {
    await auditPopup(context);
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const openAssets = async () => {
      await userEvent.click(canvas.getByRole('combobox', { name: 'Release asset' }));
      const popup = await waitFor(() => {
        const content = canvasElement.ownerDocument.querySelector('[data-slot="cascader-content"]');
        expect(content).not.toBeNull();
        return content;
      });
      if (!within(popup).queryByText('asset-01.tar.gz', { exact: true })) {
        await userEvent.click(await within(popup).findByText('gaudi', { exact: true }));
        await userEvent.click(await within(popup).findByText('v4.0', { exact: true }));
      }
      await within(popup).findByText('asset-08.tar.gz', { exact: true });
      return popup;
    };
    try {
      await openAssets();
      await userEvent.click(page.getByText('Load more', { exact: true }));
      await waitFor(() => expect(canvasElement.ownerDocument.querySelector('[data-slot="cascader-item"][data-more][data-state="loading"]')).not.toBeNull());
      await userEvent.keyboard('{Escape}');
      await popupGone(canvasElement);
      await openAssets();
      await userEvent.click(page.getByText('Load more', { exact: true }));
      await expect(await page.findByText('asset-09.tar.gz', { exact: true })).toBeVisible();
      if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({ ...context, id: `${context.id}--retried-page` });
      }
    } finally {
      canvasElement.ownerDocument.querySelector('[data-slot="cascader-content"]')?.focus();
      await userEvent.keyboard('{Escape}');
      await popupGone(canvasElement);
    }
  }
};
export const Virtualized = { name: 'Virtualized rows', ...pattern('virtualized', 'Six unevenly sized regions of country markets, windowed so only the visible rows ever mount.') };
export const Translated = { name: 'Translated labels', ...pattern('translated', 'A German country picker where every string the primitive renders comes from labels, including the live-region announcements, with each flag in an IconTile.') };
