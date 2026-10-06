import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'context-menu', import.meta.url,
  import.meta.glob('./fixtures/context-menu/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/context-menu/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/DropdownMenu', id: 'core-dropdownmenu', tags: ['autodocs'], ...catalogueMeta('context-menu') };

async function closeContextMenu(document) {
  const body = within(document.body);
  if (document.querySelector('[data-slot="context-menu-sub-content"]')) {
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(document.querySelector('[data-slot="context-menu-sub-content"]')).not.toBeInTheDocument());
  }
  if (document.querySelector('[data-slot="context-menu-content"]')) await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
}

async function openContextSubmenu(document, submenuName) {
  await closeContextMenu(document);
  const body = within(document.body);
  const target = body.getByText('Right click here');
  const bounds = target.getBoundingClientRect();
  await userEvent.pointer({
    keys: '[MouseRight]', target,
    coords: { clientX: bounds.left + bounds.width / 2, clientY: bounds.top + bounds.height / 2 }
  });
  const submenu = await body.findByRole('menuitem', { name: submenuName });
  submenu.focus();
  await userEvent.keyboard('{ArrowRight}');
  const item = await body.findByRole('menuitem', { name: /Developer tools/i });
  await expect(item).toBeVisible();
  await waitFor(() => {
    const bounds = item.getBoundingClientRect();
    const target = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    expect(item.contains(target)).toBe(true);
  });
}

export const ContextMenuItemKinds = {
  name: 'Context menu',
  ...pattern('item-kinds', 'Right click the area: labels, icons, shortcuts, a disabled item, a submenu, checkbox and radio items, and a destructive action.'),
  play: async ({ canvasElement, id }) => {
    const document = canvasElement.ownerDocument;
    try {
      await openContextSubmenu(document, 'More tools');
      const menu = within(document.querySelector('[data-slot="context-menu-content"]'));
      await expect(menu.getByRole('menuitem', { name: /Paste/ })).toHaveAttribute('aria-disabled', 'true');
      await expect(menu.getByRole('menuitemradio', { name: '100%' })).toHaveAttribute('aria-checked', 'true');
      if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({
          canvasElement, id: `${id}--open`,
          beforeAuditWidth: () => openContextSubmenu(document, 'More tools')
        });
      }
    } finally {
      await closeContextMenu(document);
    }
  }
};
export const ContextMenuInDialog = {
  name: 'Context menu inside a dialog', ...pattern('in-dialog'),
  play: async ({ canvasElement, id }) => {
    const document = canvasElement.ownerDocument;
    const body = within(document.body);
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Open dialog' }));
    const dialog = await body.findByRole('dialog');
    try {
      await openContextSubmenu(document, 'More options');
      if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
        const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
        await auditStoryLayout({
          canvasElement, id: `${id}--open`,
          beforeAuditWidth: () => openContextSubmenu(document, 'More options')
        });
      }
    } finally {
      await closeContextMenu(document);
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(dialog).not.toBeInTheDocument());
    }
  }
};
