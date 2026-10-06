import { auditOverlayState } from '../../Popover/stories/auditOverlayState.js';
import { auditSelectMenus, waitForDialogAnimation } from './auditSelectMenus.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const pattern = patternStories(
  'combobox', import.meta.url,
  import.meta.glob('./fixtures/combobox/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/combobox/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('combobox'), play: auditSelectMenus };

// Type to filter, then pick with the keyboard; the popup closes on commit.
const pickWithKeyboard = async (context) => {
  const { canvasElement } = context;
  await auditSelectMenus(context);
  const input = within(canvasElement).getByRole('combobox', { name: 'Framework' });
  await userEvent.type(input, 'Svelte');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await expect(input).toHaveValue('SvelteKit');
  await expect(input).toHaveAttribute('aria-expanded', 'false');
};

export const ComboboxInputOptions = {
  name: 'Input options',
  ...pattern('input-options', 'One field per input option: auto highlight, clear button, icon addon, custom trigger icon, disabled and invalid.'),
  play: pickWithKeyboard
};
export const ComboboxPropertyPickers = {
  name: 'Property pickers',
  ...pattern('property-pickers', 'Button triggers with search inside the popup and custom rows: status and priority glyphs, team marks, an assignee list with groups and an invite action, and multiple members or labels summarised in the trigger. Each "No …" option clears its property.'),
  play: async (context) => {
    await auditSelectMenus(context);
    const canvas = within(context.canvasElement);
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Assignee' }));
    await userEvent.click(await body.findByRole('option', { name: 'Invite teammate' }));
    const dialog = within(await body.findByRole('dialog', { name: 'Invite teammate' }));
    await auditOverlayState(context, 'invite');
    await userEvent.type(dialog.getByRole('textbox', { name: 'Name' }), 'Jamie Park');
    await userEvent.type(dialog.getByRole('textbox', { name: 'Email' }), 'jamie@example.com');
    await userEvent.click(dialog.getByRole('button', { name: 'Add teammate' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('combobox', { name: 'Assignee' })).toHaveTextContent('Jamie Park');
  }
};
export const ComboboxMultipleChips = { name: 'Multiple selection with chips', ...pattern('multiple-chips', 'Removable and fixed chips, plus disabled and invalid states.') };
export const ComboboxMemberTags = { name: 'Member tags', ...pattern('member-tags', 'Avatar chips in a boxed field and in a borderless one.') };
export const ComboboxGrouped = { name: 'Grouped options', ...pattern('grouped', 'Labelled groups with separators in a list long enough to scroll.') };
export const ComboboxDatePresets = {
  name: 'Date presets with a custom picker',
  ...pattern('date-presets', 'Relative due-date presets, plus a Custom date option that opens a calendar.'),
  play: async (context) => {
    await auditSelectMenus(context);
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(context.canvasElement.querySelector('[data-slot="combobox-trigger"]'));
    await userEvent.click(await body.findByRole('option', { name: 'Custom date...' }));
    await expect(await body.findByRole('dialog', { name: 'Pick a date' })).toBeVisible();
    await auditOverlayState(context, 'calendar');
    await userEvent.click(body.getByRole('button', { name: 'Dismiss' }));
    await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());
  }
};
export const ComboboxInForm = { name: 'Combobox in a form', ...pattern('in-form', 'A required, named combobox that submits with its form.'), play: async (context) => {
  await auditSelectMenus(context);
  const canvas = within(context.canvasElement);
  await userEvent.type(canvas.getByRole('combobox'), 'Svelte');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
  const body = within(context.canvasElement.ownerDocument.body);
  await waitFor(() => expect(body.getByText('You selected SvelteKit as your framework.')).toBeVisible());
  await userEvent.click(body.getByRole('button', { name: /close toast/i }));
} };
export const ComboboxInDialog = { name: 'Combobox inside a dialog', ...pattern('in-dialog', 'The popup layers above the dialog and keeps focus inside it.'), play: async (context) => {
  await auditSelectMenus(context);
  const body = within(context.canvasElement.ownerDocument.body);
  await userEvent.click(within(context.canvasElement).getByRole('button', {name: 'Open Dialog'}));
  const dialogElement = await body.findByRole('dialog');
  await waitForDialogAnimation(dialogElement);
  const dialog = within(dialogElement);
  await expect(dialog.getByRole('button', {name: 'Confirm'})).toBeDisabled();
  await userEvent.type(dialog.getByRole('combobox'), 'Astro');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  await userEvent.click(dialog.getByRole('button', {name: 'Confirm'}));
  await waitFor(() => expect(body.getByText('Astro selected.')).toBeVisible());
  await userEvent.click(body.getByRole('button', { name: /close toast/i }));
} };
