import { expect, userEvent, waitFor, within } from 'storybook/test';
import { auditSelectMenus } from './auditSelectMenus.js';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'select', import.meta.url,
  import.meta.glob('./fixtures/select/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/select/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

export default { title: 'Core/Select', id: 'core-select', tags: ['autodocs'], ...catalogueMeta('select'), play: auditSelectMenus };

export const FormStates = { name: 'Form fields and states', ...pattern('form-states', 'Label and description, a disabled option, the small trigger, a long list aligned to the selected item, and invalid and disabled fields.') };
export const RichOptions = { name: 'Rich option content', ...pattern('rich-options', 'Icons, status dots, avatars under a group label, badges behind a trigger prefix, flags and font previews.') };
export const Grouped = { name: 'Grouped options', ...pattern('grouped', 'Labelled groups split by separators, each option with a muted offset.') };
export const Descriptions = { name: 'Options with descriptions', ...pattern('descriptions', 'Options with a second line: one trigger hides the description to stay on one line, the other grows to show both.') };
export const Clearable = {
  name: 'Clearable select',
  ...pattern('clearable', 'A controlled select with a keyboard-accessible clear button beside its trigger.'),
  play: async (context) => {
    await auditSelectMenus(context);
    const canvas = within(context.canvasElement);
    const trigger = canvas.getByRole('combobox', { name: 'Framework' });
    trigger.focus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Clear selection' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveTextContent('Select framework');
    await expect(canvas.getByRole('combobox', { name: 'Framework' })).toBe(trigger);
    await expect(canvas.getByRole('button', { name: 'Clear selection' })).toBeDisabled();
    await userEvent.keyboard('{ArrowDown}');
    const body = within(context.canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole('option', { name: 'SvelteKit' }));
    await waitFor(() => expect(trigger).toHaveTextContent('SvelteKit'));
    await expect(trigger).toHaveFocus();
  }
};
export const Toolbar = {
  name: 'Select in a toolbar', ...pattern('toolbar', 'A status filter sized to its content, sharing a row with a search input and working local member search.'),
  play: async (context) => {
    await auditSelectMenus(context);
    const canvas = within(context.canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Search members' });
    await userEvent.type(input, 'Anouk');
    await userEvent.click(canvas.getByRole('button', { name: 'Search' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Anouk Brennan');
    await userEvent.clear(input);
    await userEvent.type(input, 'Nobody');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('status')).toHaveTextContent('No members found.');
    await userEvent.clear(input);
    await userEvent.keyboard('{Enter}');
  }
};
export const InDialog = { name: 'Select inside a dialog', ...pattern('in-dialog', 'The popup layers above the dialog and stays inside its focus trap.') };
