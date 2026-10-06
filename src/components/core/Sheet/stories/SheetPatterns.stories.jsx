import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';

const pattern = patternStories(
  'sheet', import.meta.url,
  import.meta.glob('./fixtures/sheet/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/sheet/*.jsx', { eager: true, query: '?raw', import: 'default' })
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

export const NewProject = {
  name: 'New project',
  ...pattern('new-project', 'A creation form: name and summary, inline status, priority and lead selects, and a target date picker. The switch shows or hides the corner close button.'),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    let sheet = await openSheet(canvasElement, 'New project', 'New project');
    await waitFor(() => expect(sheet.getByRole('button', { name: 'Close' })).toBeVisible());
    await userEvent.clear(sheet.getByRole('textbox', { name: 'Name' }));
    await userEvent.type(sheet.getByRole('textbox', { name: 'Name' }), 'Reader feedback');
    await userEvent.click(sheet.getByRole('button', { name: 'Create project' }));
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('Created local project: Reader feedback'));
    sheet = await openSheet(canvasElement, 'New project', 'New project');
    await userEvent.click(sheet.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(page(canvasElement).queryByRole('dialog')).not.toBeInTheDocument());
    await userEvent.click(canvas.getByRole('switch', { name: 'Close button' }));
    sheet = await openSheet(canvasElement, 'New project', 'New project');
    await expect(sheet.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    await closeSheet(canvasElement);
    await userEvent.click(canvas.getByRole('switch', { name: 'Close button' }));
    await openSheet(canvasElement, 'New project', 'New project');
  }
};
export const Notifications = {
  name: 'Notifications',
  ...pattern('notifications', 'An inset panel with the unread count on its trigger, Mark all read, and a feed with mentions, a file and an invite to accept or decline.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Notifications, 3 unread', 'Notifications');
    await userEvent.click(sheet.getByRole('button', { name: 'Mark all read' }));
    await waitFor(() => expect(sheet.getByText('You are all caught up')).toBeVisible());
    await closeSheet(canvasElement);
    await openSheet(canvasElement, /Notifications/, 'Notifications');
  }
};
export const Settings = { name: 'Settings', ...pattern('settings', 'Two scrolling sections, profile fields and reading toggles with a layout picker, between a fixed header and a footer that stays in view.'), play: ({ canvasElement }) => openSheet(canvasElement, 'Site settings', 'Site settings') };
export const HelpShortcuts = {
  name: 'Help and shortcuts',
  ...pattern('help-shortcuts', 'One search filters grouped guides and keyboard shortcuts, each on its own tab.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Help', 'Help');
    await userEvent.type(sheet.getByRole('textbox', { name: 'Search help' }), 'news');
    await waitFor(() => expect(sheet.getByText('Grow your newsletter')).toBeVisible());
    await expect(sheet.queryByText('Moderate comments')).not.toBeInTheDocument();
    await closeSheet(canvasElement);
    await openSheet(canvasElement, 'Help', 'Help');
  }
};
export const Assistant = {
  name: 'Assistant',
  ...pattern('assistant', 'A model picker, suggestion chips that start the conversation, and a composer pinned to the bottom.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Assistant', 'Writing assistant');
    await userEvent.click(sheet.getByRole('button', { name: 'Suggest three titles' }));
    await waitFor(() => expect(sheet.getByText(/first pass at “suggest three titles”/)).toBeVisible());
    await userEvent.type(sheet.getByRole('combobox', { name: 'Message' }), 'Shorten the introduction');
    await userEvent.keyboard('{Enter}');
    await expect(sheet.getByText(/first pass at “shorten the introduction”/)).toBeVisible();
    await expect(sheet.getByRole('combobox', { name: 'Message' })).toHaveValue('');
    await closeSheet(canvasElement);
    await openSheet(canvasElement, 'Assistant', 'Writing assistant');
  }
};
export const Comments = {
  name: 'Comments',
  ...pattern('comments', 'React, reply and resolve on each comment; Open only hides resolved threads.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, /Comments/, 'Comments');
    await expect(sheet.queryByText(/broken link/)).not.toBeInTheDocument();
    const replyTrigger = sheet.getAllByRole('button', { name: 'Reply', exact: true })[0];
    await userEvent.click(replyTrigger);
    await userEvent.type(sheet.getByRole('textbox', { name: 'Reply to Maya Patel' }), 'Agreed, I will shorten it.');
    await userEvent.click(sheet.getAllByRole('button', { name: 'Reply', exact: true })[1]);
    await expect(sheet.getByRole('list', { name: 'Replies to Maya Patel' })).toHaveTextContent('Agreed, I will shorten it.');
    await expect(replyTrigger).toHaveFocus();
    await userEvent.click(sheet.getAllByRole('button', { name: 'Resolve' })[0]);
    await expect(sheet.queryByText(/repeats the intro/)).not.toBeInTheDocument();
    await expect(sheet.getByRole('switch', { name: 'Open only' })).toHaveFocus();
    await closeSheet(canvasElement);
    await openSheet(canvasElement, /Comments/, 'Comments');
  }
};
export const RecordDetails = {
  name: 'Record details',
  ...pattern('record-details', 'A wide sheet for one record: rows edit in place, with target progress, owners, the alert rule and a timeline of changes.'),
  play: async ({ canvasElement }) => {
    const sheet = await openSheet(canvasElement, 'Open metric', 'Weekly new subscribers');
    await userEvent.click(sheet.getByRole('button', { name: 'Edit Team' }));
    const input = sheet.getByRole('textbox', { name: 'Team' });
    await userEvent.clear(input);
    await userEvent.type(input, 'Audience');
    await userEvent.click(sheet.getByRole('button', { name: 'Save Team' }));
    await waitFor(() => expect(sheet.getByText('Audience')).toBeVisible());
    await closeSheet(canvasElement);
    await openSheet(canvasElement, 'Open metric', 'Weekly new subscribers');
  }
};
export const Edges = {
  name: 'Sheet from each edge',
  ...pattern('edges', 'A scrolling body between a fixed header and footer, opened from the right, left, top or bottom.'),
  play: async (context) => {
    for (const [index, trigger] of within(context.canvasElement).getAllByRole('button').entries()) {
      await userEvent.click(trigger);
      const dialog = await page(context.canvasElement).findByRole('dialog');
      await waitFor(() => expect(dialog).toBeVisible());
      await auditOverlayState(context, `open-${index + 1}`);
      await closeSheet(context.canvasElement);
      await expect(trigger).toHaveFocus();
    }
    await openSheet(context.canvasElement, 'right', 'Recent activity');
  }
};
