import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'command', import.meta.url,
  import.meta.glob('./fixtures/command/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/command/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const auditState = async (context, state) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}--${state}` });
};

export default { title: 'Core/Overlays & Menus/Commander', id: 'core-commander', tags: ['autodocs'], ...catalogueMeta('command') };

const openPalette = async (canvasElement, trigger) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  return within(await within(document.body).findByRole('dialog'));
};
const closePalette = async () => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
};

export const InlinePalette = {
  name: 'Inline palette',
  ...pattern('inline-palette', 'A palette embedded in the page: grouped suggestions, a disabled item, shortcuts, and no selection until the keyboard or search is used.'),
  play: async (context) => {
    const { canvasElement } = context;
    const canvas = within(canvasElement);
    const search = canvas.getByRole('combobox', { name: 'Search commands' });
    const heading = canvas.getByText('Suggestions');
    await expect(getComputedStyle(heading).textTransform).toBe('none');
    await expect(getComputedStyle(heading).letterSpacing).toBe('normal');
    await expect(canvasElement.querySelector('[aria-selected="true"]')).toBeNull();
    await userEvent.click(search);
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(search, 'Billing');
    await expect(search).toHaveAccessibleName('Search commands');
    await expect(canvas.getByRole('option', { name: /Billing/ })).toBeVisible();
    await userEvent.clear(search);
    const verifySemanticSurface = () => {
      const command = canvasElement.querySelector('[data-slot="command"]');
      const sample = canvasElement.ownerDocument.createElement('span');
      sample.style.backgroundColor = 'var(--ds-color-surface)';
      canvasElement.appendChild(sample);
      try {
        expect(getComputedStyle(command).backgroundColor).toBe(getComputedStyle(sample).backgroundColor);
      } finally {
        sample.remove();
      }
    };
    verifySemanticSurface();
    if (import.meta.env.VITE_GAUDI_AUDIT === '1') {
      const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
      await auditStoryLayout({ ...context, beforeAuditWidth: verifySemanticSurface });
    }
  }
};
export const DialogShortcuts = {
  name: 'Command dialog with groups and shortcuts',
  ...pattern('dialog-shortcuts', 'A modal palette with grouped actions, separators and right-aligned shortcuts; the list scrolls and search filters across groups.'),
  play: async (context) => {
    const { canvasElement } = context;
    const palette = await openPalette(canvasElement, 'Quick Actions');
    await auditState(context, 'open');
    await userEvent.keyboard('zoom');
    await expect(await palette.findByRole('option', { name: /Zoom In/ })).toBeVisible();
    await waitFor(() => expect(palette.queryByRole('option', { name: /New Project/ })).not.toBeInTheDocument());
    await closePalette();
  }
};
export const SearchEverything = {
  name: 'Search everything',
  ...pattern('search-everything', 'A ⌘K search across favorites, recent pages, files and people, with custom rows: tinted file glyphs with their folder, avatars with email and role, and trailing timestamps.'),
  play: async (context) => {
    const { canvasElement } = context;
    const palette = await openPalette(canvasElement, /Search/);
    await auditState(context, 'open');
    await userEvent.keyboard('sabine@');
    await expect(await palette.findByRole('option', { name: /Sabine Okafor/ })).toBeVisible();
    await waitFor(() => expect(palette.queryByRole('option', { name: /page\.tsx/ })).not.toBeInTheDocument());
    await closePalette();
    await userEvent.keyboard('{Meta>}k{/Meta}');
    // The dialog mounts at the start of its fade-in, so wait for it to become visible.
    await waitFor(() => expect(within(document.body).getByRole('dialog')).toBeVisible());
    await closePalette();
  }
};
