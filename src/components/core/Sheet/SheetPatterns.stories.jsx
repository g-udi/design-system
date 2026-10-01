import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../.storybook/stories/PatternStoryHelpers.jsx';
import { openEachDialog } from '../../../../.storybook/stories/PatternInteractions.js';

const pattern = patternStories(
  'sheet',
  import.meta.glob('../../../../.storybook/fixtures/patterns/sheet/*.jsx', { eager: true }),
  import.meta.glob('../../../../.storybook/fixtures/patterns/sheet/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const page = (canvasElement) => within(canvasElement.ownerDocument.body);
/** Opens the sheet from its trigger and returns a query scope inside it. */
const openSheet = async (canvasElement, trigger, title) => {
  await userEvent.click(within(canvasElement).getByRole('button', { name: trigger }));
  return within(await page(canvasElement).findByRole('dialog', { name: title }));
};
const closeSheet = async (canvasElement) => {
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(page(canvasElement).queryByRole('dialog')).not.toBeInTheDocument());
};

export default { title: 'Core/Overlays & Menus/Sheet', id: 'core-sheet', tags: ['autodocs'], ...catalogueMeta('sheet') };

export const SheetPattern1 = {
  name: 'New project',
  ...pattern(1, 'A creation form: name and summary, inline status, priority and lead selects, and a target date picker. The switch shows or hides the corner close button.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    let sheet = await openSheet(canvasElement, 'New project', 'New project');
    await waitFor(() => expect(sheet.getByRole('button', { name: 'Close' })).toBeVisible());
    await userEvent.click(sheet.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(page(canvasElement).queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('switch', { name: 'Close button' }));
    sheet = await openSheet(canvasElement, 'New project', 'New project');
    await expect(sheet.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await closeSheet(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Close button' }));
  }
};
export const SheetPattern4 = {
  name: 'Notifications',
  ...pattern(4, 'An inset panel with the unread count on its trigger, Mark all read, and a feed with mentions, a file and an invite to accept or decline.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Notifications, 3 unread', 'Notifications');
    await userEvent.click(sheet.getByRole('button', { name: 'Mark all read' }));
    await waitFor(() => expect(sheet.getByText('You are all caught up')).toBeVisible());
    await closeSheet(canvasElement);
  }
};
export const SheetPattern5 = { name: 'Settings', ...pattern(5, 'Two scrolling sections, profile fields and reading toggles with a layout picker, between a fixed header and a footer that stays in view.') };
export const SheetPattern6 = {
  name: 'Help and shortcuts',
  ...pattern(6, 'One search filters grouped guides and keyboard shortcuts, each on its own tab.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Help', 'Help');
    await userEvent.type(sheet.getByRole('textbox', { name: 'Search help' }), 'news');
    await waitFor(() => expect(sheet.getByText('Grow your newsletter')).toBeVisible());
    await expect(sheet.queryByText('Moderate comments')).not.toBeInTheDocument();
    await closeSheet(canvasElement);
  }
};
export const SheetPattern7 = {
  name: 'Assistant',
  ...pattern(7, 'A model picker, suggestion chips that start the conversation, and a composer pinned to the bottom.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Assistant', 'Writing assistant');
    await userEvent.click(sheet.getByRole('button', { name: 'Suggest three titles' }));
    await waitFor(() => expect(sheet.getByText(/first pass at “suggest three titles”/)).toBeVisible());
    await closeSheet(canvasElement);
  }
};
export const SheetPattern8 = {
  name: 'Comments',
  ...pattern(8, 'React, reply and resolve on each comment; Open only hides resolved threads.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, /Comments/, 'Comments');
    await expect(sheet.queryByText(/broken link/)).not.toBeInTheDocument();
    await userEvent.click(sheet.getAllByRole('button', { name: 'Resolve' })[0]);
    await expect(sheet.queryByText(/repeats the intro/)).not.toBeInTheDocument();
    await closeSheet(canvasElement);
  }
};
export const SheetPattern9 = {
  name: 'Record details',
  ...pattern(9, 'A wide sheet for one record: rows edit in place, with target progress, owners, the alert rule and a timeline of changes.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Open metric', 'Weekly new subscribers');
    await userEvent.click(sheet.getByRole('button', { name: 'Edit Team' }));
    const input = sheet.getByRole('textbox', { name: 'Team' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Audience');
    await userEvent.click(sheet.getByRole('button', { name: 'Save Team' }));
    await waitFor(() => expect(sheet.getByText('Audience')).toBeVisible());
    await closeSheet(canvasElement);
  }
};
export const SheetPattern3 = {
  name: 'Sheet from each edge',
  ...pattern(3, 'A scrolling body between a fixed header and footer, opened from the right, left, top or bottom.'),
  play: openEachDialog
};
