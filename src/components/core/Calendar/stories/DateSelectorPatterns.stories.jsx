import { expect, userEvent, waitFor, within } from 'storybook/test';
import { catalogueMeta, patternStories } from '../../../../docs/components/PatternStoryHelpers.jsx';

const pattern = patternStories(
  'date-selector', import.meta.url,
  import.meta.glob('./fixtures/date-selector/*.jsx', { eager: true }),
  import.meta.glob('./fixtures/date-selector/*.jsx', { eager: true, query: '?raw', import: 'default' })
);

const auditState = async (context, state) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const { auditStoryLayout } = await import('../../../../../.storybook/storyAudit.js');
  await auditStoryLayout({ ...context, id: `${context.id}--${state}` });
};

const auditPicker = async (context) => {
  if (import.meta.env.VITE_GAUDI_AUDIT !== '1') return;
  const trigger = context.canvasElement.querySelector('button[aria-haspopup="dialog"]');
  await userEvent.click(trigger);
  const popup = await within(context.canvasElement.ownerDocument.body).findByRole('dialog');
  await auditState(context, 'open');
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(popup).not.toBeInTheDocument());
};

export default { title: 'Core/Advanced Inputs/Calendar', id: 'core-calendar', tags: ['autodocs'], ...catalogueMeta('date-selector') };

export const DateSelectorOptions = {
  name: 'Date selector: Options',
  ...pattern('options', 'Days, months, quarters, half-years and years with is, before, after and between filters; switches toggle ranges, typed input and a fixed filter, and the value is printed below.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await userEvent.click(canvas.getByRole('radio', { name: 'between', exact: true }));
    const days = [...context.canvasElement.querySelectorAll('[data-slot="calendar"] button[data-day]')];
    // data-day is localized metadata; select actual days in one visible month.
    const late = days.find((button) => !button.closest('[data-outside="true"]') && button.textContent.trim() === '20');
    const month = late.closest('[role="grid"]');
    const early = days.find((button) => button.closest('[role="grid"]') === month && !button.closest('[data-outside="true"]') && button.textContent.trim() === '10');
    // Keyboard selection has no hover preview to reorder the range for us.
    late.focus();
    await userEvent.keyboard('{Enter}');
    early.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      const saved = JSON.parse(context.canvasElement.querySelector('[role="status"] pre').textContent);
      expect(new Date(saved.startDate).getDate()).toBe(10);
      expect(new Date(saved.endDate).getDate()).toBe(20);
    });
    await auditState(context, 'reverse-keyboard-range');
    await userEvent.click(canvas.getByRole('switch', { name: 'Lock filter to is' }));
    for (const name of ['is', 'before', 'after', 'between']) {
      await expect(canvas.getByRole('radio', { name, exact: true })).toBeDisabled();
    }
    await userEvent.click(canvas.getByRole('radio', { name: 'Quarter', exact: true }));
    const quarter = canvas.getByRole('button', { name: 'Q2 2026', exact: true });
    quarter.scrollIntoView({ block: 'nearest' });
    await userEvent.click(quarter);
    await expect(quarter).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas.getByRole('button', { name: 'Q1 2026', exact: true })).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByRole('textbox', { name: 'Due date' })).toHaveValue('Q2 2026');
    await auditState(context, 'fixed-filter-quarter');
    await userEvent.click(canvas.getByRole('switch', { name: 'Lock filter to is' }));
    await expect(canvas.getByRole('radio', { name: 'before', exact: true })).toBeEnabled();
  }
};
export const DateSelectorInPopover = {
  name: 'Date selector: Opened from a field',
  ...pattern('in-popover', 'Edits a draft in a popover; Apply commits, Cancel restores the saved value, and Clear removes the selection.'),
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const page = within(context.canvasElement.ownerDocument.body);
    const open = async (name) => {
      await userEvent.click(canvas.getByRole('button', { name, exact: true }));
      return within(await page.findByRole('dialog'));
    };
    let popup = await open('Select a date');
    await userEvent.type(popup.getByRole('textbox'), '2024');
    await userEvent.click(popup.getByRole('button', { name: 'Cancel' }));
    // Reopen during the exit transition: the mounted selector must accept the
    // host's empty draft rather than resurrecting the cancelled input.
    popup = await open('Select a date');
    await waitFor(() => expect(popup.getByRole('textbox')).toHaveValue(''));
    await auditState(context, 'cancelled-empty-draft');
    await userEvent.type(popup.getByRole('textbox'), '2025');
    await userEvent.click(popup.getByRole('button', { name: 'Apply' }));
    popup = await open('2025');
    await userEvent.clear(popup.getByRole('textbox'));
    await userEvent.type(popup.getByRole('textbox'), '2024');
    await userEvent.click(popup.getByRole('button', { name: 'Cancel' }));
    popup = await open('2025');
    await waitFor(() => expect(popup.getByRole('textbox')).toHaveValue('2025'));
    await auditState(context, 'restored-saved-draft');
    await userEvent.click(popup.getByRole('button', { name: 'Clear', exact: true }));
    await userEvent.click(popup.getByRole('button', { name: 'Apply' }));
    popup = await open('Select a date');
    await waitFor(() => expect(popup.getByRole('textbox')).toHaveValue(''));
    await userEvent.click(popup.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
  }
};
export const DateSelectorTranslatedDialog = { name: 'Date selector: Translated, in a dialog', ...pattern('translated-dialog', 'A dialog with Apply and Cancel whose strings, date format and first weekday follow the chosen language.'), play: auditPicker };
