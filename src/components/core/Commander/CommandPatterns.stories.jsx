import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'command',
  import.meta.glob('../../../../.storybook/fixtures/patterns/command/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/command/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Overlays & Menus/Commander', id: 'core-commander', tags: ['autodocs'], ...catalogueMeta('command') };

const openPalette = async (canvasElement, trigger) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  return within(await within(document.body).findByRole('dialog'));
};
const closePalette = async () => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument());
};

export const CommandPattern1 = {
  name: 'Inline palette',
  ...pattern(1, 'A palette embedded in the page: grouped suggestions, a disabled item, shortcuts, and no selection until the keyboard or search is used.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('combobox');
    await expect(canvasElement.querySelector('[aria-selected="true"]')).toBeNull();
    await userEvent.click(search);
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('option', { name: 'Calendar' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.type(search, 'Billing');
    await expect(canvas.getByRole('option', { name: /Billing/ })).toBeVisible();
    await userEvent.clear(search);
  }
};
export const CommandPattern4 = {
  name: 'Command dialog with groups and shortcuts',
  ...pattern(4, 'A modal palette with grouped actions, separators and right-aligned shortcuts; the list scrolls and search filters across groups.'),
  play: async ({ canvasElement }) => {
    const palette = await openPalette(canvasElement, 'Quick Actions');
    await userEvent.keyboard('zoom');
    await expect(palette.getByRole('option', { name: /Zoom In/ })).toBeVisible();
    await expect(palette.queryByRole('option', { name: /New Project/ })).not.toBeInTheDocument();
    await closePalette();
  }
};
export const CommandPattern5 = {
  name: 'Search everything',
  ...pattern(5, 'A ⌘K search across favorites, recent pages, files and people, with custom rows: tinted file glyphs with their folder, avatars with email and role, and trailing timestamps.'),
  play: async ({ canvasElement }) => {
    const palette = await openPalette(canvasElement, /Search/);
    await userEvent.keyboard('sarah@');
    await expect(palette.getByRole('option', { name: /Sarah Chen/ })).toBeVisible();
    await expect(palette.queryByRole('option', { name: /page\.tsx/ })).not.toBeInTheDocument();
    await closePalette();
    await userEvent.keyboard('{Meta>}k{/Meta}');
    await expect(await within(document.body).findByRole('dialog')).toBeVisible();
    await closePalette();
  }
};
